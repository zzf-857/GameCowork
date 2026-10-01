using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace GameCowork.EditorBridge
{
    // TcpListener avoids machine-wide HTTP URL reservations and administrator privileges.
    internal sealed class LocalServer : IDisposable
    {
        readonly TcpListener listener;
        readonly Action<TcpClient> handle;
        readonly bool http;
        readonly object clientsLock = new object();
        readonly HashSet<TcpClient> clients = new HashSet<TcpClient>();
        int stopped;
        public int Port { get { return ((IPEndPoint)listener.LocalEndpoint).Port; } }
        public LocalServer(bool isHttp, Action<TcpClient> handler, int port = 0)
        {
            if (port < 0 || port > 65535) throw new ArgumentOutOfRangeException("port");
            http = isHttp;
            handle = handler;
            listener = new TcpListener(IPAddress.Loopback, port);
        }
        public void Start()
        {
            listener.Start(16);
            new Thread(Accept) { IsBackground = true, Name = "GameCowork local bridge accept" }.Start();
        }
        void Accept()
        {
            while (Volatile.Read(ref stopped) == 0)
            {
                TcpClient client;
                try { client = listener.AcceptTcpClient(); }
                catch (SocketException) { return; }
                catch (ObjectDisposedException) { return; }
                lock (clientsLock)
                {
                    if (clients.Count >= 16 || Volatile.Read(ref stopped) != 0) { client.Close(); continue; }
                    clients.Add(client);
                }
                client.NoDelay = true;
                client.ReceiveTimeout = http ? 5000 : 30000;
                client.SendTimeout = 5000;
                ThreadPool.QueueUserWorkItem(_ => {
                    try { handle(client); }
                    catch (Exception) { /* Bad/disconnected clients are closed; Unity APIs never run here. */ }
                    finally { lock (clientsLock) clients.Remove(client); client.Close(); }
                });
            }
        }
        public void Dispose()
        {
            if (Interlocked.Exchange(ref stopped, 1) != 0) return;
            listener.Stop();
            lock (clientsLock) { foreach (var client in clients) client.Close(); clients.Clear(); }
        }
        public static byte[] ReadExact(Stream stream, int length)
        {
            byte[] data = new byte[length];
            int offset = 0;
            while (offset < length)
            {
                int count = stream.Read(data, offset, length - offset);
                if (count == 0) { if (offset == 0) return null; throw new EndOfStreamException(); }
                offset += count;
            }
            return data;
        }
        static string ReadLine(Stream stream, ref int headerBytes)
        {
            var bytes = new List<byte>();
            while (true)
            {
                int value = stream.ReadByte();
                if (value < 0) throw new EndOfStreamException();
                if (++headerBytes > 16384) throw new IOException("HTTP headers exceed 16 KiB");
                if (value == 10) break;
                bytes.Add((byte)value);
            }
            if (bytes.Count == 0 || bytes[bytes.Count - 1] != 13) throw new IOException("HTTP requires CRLF headers");
            bytes.RemoveAt(bytes.Count - 1);
            return Encoding.ASCII.GetString(bytes.ToArray());
        }
        public static HttpRequest ReadHttp(Stream stream)
        {
            int headerBytes = 0;
            string[] start = ReadLine(stream, ref headerBytes).Split(' ');
            if (start.Length != 3 || start[2] != "HTTP/1.1" || !start[1].StartsWith("/", StringComparison.Ordinal))
                throw new IOException("Invalid HTTP request");
            int contentLength = 0;
            var request = new HttpRequest { Method = start[0], Path = start[1], Body = "" };
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            while (true)
            {
                string line = ReadLine(stream, ref headerBytes);
                if (line.Length == 0) break;
                int colon = line.IndexOf(':');
                if (colon < 1) throw new IOException("Invalid HTTP header");
                string key = line.Substring(0, colon), value = line.Substring(colon + 1).Trim();
                if (!seen.Add(key)) throw new IOException("Duplicate HTTP header");
                if (key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase)) throw new IOException("Chunked HTTP requests are unsupported");
                if (key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase) &&
                    (!int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out contentLength) || contentLength < 0 || contentLength > 65536))
                    throw new IOException("HTTP body exceeds 64 KiB");
                if (key.Equals("Origin", StringComparison.OrdinalIgnoreCase)) request.Origin = value;
            }
            if (contentLength > 0)
            {
                byte[] bytes = ReadExact(stream, contentLength);
                if (bytes == null) throw new EndOfStreamException();
                request.Body = new UTF8Encoding(false, true).GetString(bytes);
            }
            return request;
        }
        public static bool IsLocalOrigin(string origin)
        {
            if (string.IsNullOrEmpty(origin)) return true; // CLI/native clients still need the capability path.
            Uri parsed;
            return Uri.TryCreate(origin, UriKind.Absolute, out parsed) &&
                (parsed.Scheme == "http" || parsed.Scheme == "https") &&
                (parsed.Host == "127.0.0.1" || parsed.Host == "localhost" || parsed.Host == "::1") &&
                string.IsNullOrEmpty(parsed.UserInfo) && parsed.AbsolutePath == "/" && string.IsNullOrEmpty(parsed.Query);
        }
        public static void SendJson(TcpClient client, int status, string json, string origin)
        {
            Send(client, status, "application/json; charset=utf-8", Encoding.UTF8.GetBytes(json), origin, "");
        }
        public static void SendFrame(TcpClient client, CapturedFrame frame, string origin)
        {
            Send(client, 200, "image/jpeg", frame.Bytes, origin,
                "X-GameCowork-Frame-Id: " + frame.Sequence + "\r\nX-GameCowork-Frame-Width: " + frame.Width +
                "\r\nX-GameCowork-Frame-Height: " + frame.Height + "\r\nX-GameCowork-Stream-Id: " + frame.StreamId +
                "\r\nX-GameCowork-Source-Width: " + frame.SourceWidth + "\r\nX-GameCowork-Source-Height: " + frame.SourceHeight +
                "\r\nX-GameCowork-Capture-Epoch: " + frame.CaptureEpoch + "\r\nX-GameCowork-Geometry-Revision: " + frame.GeometryRevision +
                "\r\nX-GameCowork-Instance-Id: " + frame.InstanceId +
                "\r\nX-GameCowork-Content-Rect: " + RectJson(frame.ContentRect) +
                "\r\nX-GameCowork-Capture-Mode: " + frame.CaptureMode + "\r\nX-GameCowork-Capture-Backend: " + frame.CaptureBackend +
                "\r\nX-GameCowork-Includes-Toolbar: " + (frame.IncludesToolbar ? "true" : "false") +
                "\r\nX-GameCowork-Pixels-Per-Point: " + frame.PixelsPerPoint.ToString("R",System.Globalization.CultureInfo.InvariantCulture) +
                (frame.IncludesToolbar ? "\r\nX-GameCowork-Window-Content-Rect: " + RectJson(frame.WindowContentRect) : "") + "\r\n");
        }
        static string RectJson(UnityEngine.Rect rect)
        {
            var culture = System.Globalization.CultureInfo.InvariantCulture;
            return "[" + rect.x.ToString("R", culture) + "," + rect.y.ToString("R", culture) + "," + rect.width.ToString("R", culture) + "," + rect.height.ToString("R", culture) + "]";
        }
        static void Send(TcpClient client, int status, string type, byte[] body, string origin, string extra)
        {
            string reason = status == 200 ? "OK" : status == 204 ? "No Content" : status == 403 ? "Forbidden" :
                status == 404 ? "Not Found" : status == 409 ? "Conflict" : status == 503 ? "Service Unavailable" : "Bad Request";
            var headers = new StringBuilder("HTTP/1.1 ").Append(status).Append(' ').Append(reason)
                .Append("\r\nConnection: close\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\nContent-Type: ")
                .Append(type).Append("\r\nContent-Length: ").Append(body.Length).Append("\r\n").Append(extra);
            if (!string.IsNullOrEmpty(origin)) headers.Append("Access-Control-Allow-Origin: ").Append(origin)
                .Append("\r\nVary: Origin\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nAccess-Control-Expose-Headers: X-GameCowork-Frame-Id, X-GameCowork-Frame-Width, X-GameCowork-Frame-Height, X-GameCowork-Stream-Id, X-GameCowork-Source-Width, X-GameCowork-Source-Height, X-GameCowork-Content-Rect, X-GameCowork-Capture-Mode, X-GameCowork-Capture-Backend, X-GameCowork-Includes-Toolbar, X-GameCowork-Pixels-Per-Point, X-GameCowork-Window-Content-Rect, X-GameCowork-Capture-Epoch, X-GameCowork-Geometry-Revision, X-GameCowork-Instance-Id\r\n");
            headers.Append("\r\n");
            byte[] encoded = Encoding.ASCII.GetBytes(headers.ToString());
            var stream = client.GetStream();
            stream.Write(encoded, 0, encoded.Length);
            stream.Write(body, 0, body.Length);
        }
        internal sealed class HttpRequest { public string Method, Path, Origin, Body; }
    }
}
