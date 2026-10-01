using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace GameCowork.EditorBridge
{
    // This module uses BCL only. The separate cancellation connection can run
    // while a Unity main-thread request waits in Bridge.Pending. No Unity API,
    // SessionState or editor object may be touched from this control channel.
    internal static class EditorCancellation
    {
        internal sealed class Lease
        {
            public readonly object Sync = new object();
            public string ClientId, Token, RequestId, Root, OperationId, Phase = "queued";
            public string DomainId;
            public readonly HashSet<string> Owners = new HashSet<string>();
            public bool Cancelled, Applied, UncertainTombstone;
            public long FinishedAt;
        }
        static readonly ConcurrentDictionary<string, Lease> Requests = new ConcurrentDictionary<string, Lease>();
        static readonly Dictionary<string, long> HighWater = new Dictionary<string, long>();
        static readonly object Gate = new object();
        static bool frozen;
        internal static void Freeze() { lock (Gate) frozen = true; }
        static string Key(string client, string request) { return client + ":" + request; }
        internal static bool IsControl(string action)
        { return action == "play" || action == "pause" || action == "resume" || action == "stop" || action == "refresh"; }
        static string Text(Dictionary<string, object> value, string key)
        { object result; return value != null && value.TryGetValue(key, out result) ? result as string : null; }
        static Dictionary<string, object> Object(Dictionary<string, object> value, string key)
        { object result; return value != null && value.TryGetValue(key, out result) ? result as Dictionary<string, object> : null; }
        static string Root(string value)
        {
            if (string.IsNullOrEmpty(value)) throw new ArgumentException("An originating project root is required");
            return Path.GetFullPath(value).Replace('\\', '/').TrimEnd('/');
        }
        static void Validate(string client, string token, string request, string root, string domain = null)
        {
            if (client == null || !Regex.IsMatch(client, "^[a-f0-9]{48}$") || token == null || !Regex.IsMatch(token, "^[a-f0-9]{64}$") ||
                string.IsNullOrEmpty(request) || !Regex.IsMatch(request, "^ntb-[1-9][0-9]{0,12}$") ||
                (domain != null && !Regex.IsMatch(domain, "^[a-f0-9]{32}$")) || !string.Equals(Root(root), Root(Bridge.ProjectRoot), StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Editor cancellation identity is invalid");
        }
        static bool EqualSecret(string a, string b)
        {
            if (a == null || b == null || a.Length != b.Length) return false;
            int different = 0; for (int index = 0; index < a.Length; index++) different |= a[index] ^ b[index];
            return different == 0;
        }
        internal static Lease Register(Dictionary<string, object> envelope, string owner = null)
        {
            lock (Gate) {
            if (frozen) throw new IOException("Editor bridge is reloading");
            if (Text(envelope, "type") != "manage_editor" || !IsControl(Text(Object(envelope, "params"), "action"))) return null;
            var identity = Object(envelope, "gamecowork_control");
            if (identity == null) return null; // Existing native UI requests remain compatible, without claiming cancellability.
            string client = Text(identity, "clientId"), token = Text(identity, "cancelToken"), request = Text(envelope, "request_id"), root = Text(identity, "projectRoot"), domain = Text(identity, "domainId");
            Validate(client, token, request, root, domain);
            if (domain != Bridge.EditorDomain) throw new ArgumentException("Editor control targets an obsolete domain");
            if (!HighWater.ContainsKey(client) && HighWater.Count >= 256) throw new InvalidOperationException("Editor client identity capacity exceeded");
            long number = long.Parse(request.Substring(4), CultureInfo.InvariantCulture), highest;
            Lease prior;
            bool known = Requests.TryGetValue(Key(client, request), out prior);
            if (HighWater.TryGetValue(client, out highest) && number <= highest && (!known || prior.UncertainTombstone))
                throw new InvalidOperationException("Editor control request identity is retired or out of order");
            if (number > highest) HighWater[client] = number;
            if (known) lock (prior.Sync)
            {
                if (prior.FinishedAt != 0 && DateTime.UtcNow.Ticks - prior.FinishedAt > TimeSpan.FromMinutes(5).Ticks)
                    throw new InvalidOperationException("Editor control request identity is retired");
                if (prior.Cancelled && !prior.Applied && !prior.UncertainTombstone && EqualSecret(prior.Token, token) && prior.DomainId == domain)
                    return prior;
                throw new InvalidOperationException("Editor control request identity is already registered");
            }
            foreach (var entry in Requests)
                if (entry.Value.FinishedAt != 0 && DateTime.UtcNow.Ticks - entry.Value.FinishedAt > TimeSpan.FromMinutes(5).Ticks)
                { Lease removed; Requests.TryRemove(entry.Key, out removed); }
            while (Requests.Count >= 256)
            {
                string oldestKey = null; long oldest = long.MaxValue;
                foreach (var entry in Requests) if (entry.Value.FinishedAt != 0 && entry.Value.FinishedAt < oldest)
                { oldestKey = entry.Key; oldest = entry.Value.FinishedAt; }
                if (oldestKey == null) throw new InvalidOperationException("Editor control identity capacity exceeded");
                Lease removed; Requests.TryRemove(oldestKey, out removed);
            }
            var lease = new Lease { ClientId = client, Token = token, RequestId = request, Root = Root(root), DomainId = domain };
            if (owner != null) lease.Owners.Add(owner);
            if (!Requests.TryAdd(Key(client, request), lease)) {
                Lease existing;
                if (Requests.TryGetValue(Key(client, request), out existing)) lock (existing.Sync)
                    if (existing.Cancelled && !existing.Applied && !existing.UncertainTombstone && EqualSecret(existing.Token, token) && existing.DomainId == domain)
                    { return existing; }
                throw new InvalidOperationException("Editor control request identity is already registered");
            }
            return lease;
            }
        }
        internal static Lease Restore(string client, string token, string request, string root, string operation, bool applied, bool cancelled, bool completed, string domain = null)
        {
            if (string.IsNullOrEmpty(token)) return null;
            Validate(client, token, request, root, domain);
            var lease = new Lease { ClientId = client, Token = token, RequestId = request, Root = Root(root), OperationId = operation,
                DomainId = domain, Applied = applied, Cancelled = cancelled, Phase = cancelled ? "cancelled" : completed ? "completed" : applied ? "applied" : "accepted" };
            if (completed || cancelled) lease.FinishedAt = DateTime.UtcNow.Ticks;
            lock (Gate) { Requests[Key(client, request)] = lease; HighWater[client] = long.Parse(request.Substring(4), CultureInfo.InvariantCulture); } return lease;
        }
        internal static void Accepted(Lease lease, string operation)
        {
            if (lease == null) return;
            lock (lease.Sync) { lease.OperationId = operation; if (!lease.Cancelled) lease.Phase = "accepted"; }
        }
        internal static bool Begin(Lease lease)
        {
            if (lease == null) return true;
            lock (lease.Sync) { if (lease.Cancelled) return false; lease.Phase = "executing"; return true; }
        }
        internal static bool BeginEffect(Lease lease)
        {
            if (lease == null) return true;
            lock (lease.Sync)
            {
                if (lease.Cancelled || lease.Owners.Count == 0) return false;
                // Conservatively mark the effect as submitted before invoking
                // Unity. A cancellation cannot claim rollback while an API runs.
                lease.Applied = true; lease.Phase = "applied"; return true;
            }
        }
        internal static bool IsCancelled(Lease lease)
        { if (lease == null) return false; lock (lease.Sync) return lease.Cancelled; }
        internal static void Finish(Lease lease, string phase)
        { if (lease == null) return; lock (lease.Sync) { lease.Phase = phase; lease.FinishedAt = DateTime.UtcNow.Ticks; } }
        internal static bool HasOwner(Lease lease)
        { if (lease == null) return true; lock (lease.Sync) return lease.Owners.Count > 0; }
        internal static Lease Renew(Dictionary<string, object> envelope, string owner)
        {
            if (Text(envelope, "type") != "manage_editor" || Text(Object(envelope, "params"), "action") != "get_state") return null;
            var identity = Object(envelope, "gamecowork_control"); if (identity == null) return null;
            string client = Text(identity, "clientId"), token = Text(identity, "cancelToken"), request = Text(identity, "requestId"), root = Text(identity, "projectRoot"), domain = Text(identity, "domainId"), operation = Text(identity, "operationId");
            Validate(client, token, request, root, domain); Lease lease;
            lock (Gate) {
                if (frozen) throw new IOException("Editor bridge is reloading");
                if (!Requests.TryGetValue(Key(client, request), out lease)) throw new ArgumentException("Originating Editor control is unknown");
                lock (lease.Sync) {
                    if (!EqualSecret(lease.Token, token) || lease.DomainId != domain || (!string.IsNullOrEmpty(operation) && lease.OperationId != operation)) throw new ArgumentException("Editor control renewal identity did not match");
                    if (!lease.Cancelled) lease.Owners.Add(owner); return lease;
                }
            }
        }
        internal static void CancelDisconnected(Lease lease, string owner = null)
        {
            if (lease == null) return;
            lock (Gate) lock (lease.Sync) {
                if (owner != null) lease.Owners.Remove(owner);
                if (!frozen && !lease.Applied && (owner == null || lease.Owners.Count == 0)) { lease.Cancelled = true; lease.Phase = "cancelled"; lease.FinishedAt = DateTime.UtcNow.Ticks; }
            }
        }
        internal static string Cancel(Dictionary<string, object> envelope, bool cancel = true)
        {
            lock (Gate) {
            var parameters = Object(envelope, "params");
            string client = Text(parameters, "clientId"), token = Text(parameters, "cancelToken"), request = Text(parameters, "requestId"), root = Text(parameters, "projectRoot"), operation = Text(parameters, "operationId"), domain = Text(parameters, "domainId");
            Validate(client, token, request, root, domain);
            if (frozen) return "{\"cancelled\":false,\"applied\":null,\"state\":\"unknown\",\"reason\":\"Editor bridge is reloading\"}";
            Lease lease;
            if (!Requests.TryGetValue(Key(client, request), out lease)) {
                if (cancel && domain == Bridge.EditorDomain && string.IsNullOrEmpty(operation)) {
                    long highest; bool uncertain = HighWater.TryGetValue(client, out highest) && long.Parse(request.Substring(4), CultureInfo.InvariantCulture) <= highest;
                    lease = new Lease { ClientId = client, Token = token, RequestId = request, Root = Root(root), DomainId = domain,
                        Cancelled = true, Phase = "cancelled", FinishedAt = DateTime.UtcNow.Ticks, UncertainTombstone = uncertain };
                    if (Requests.Count < 256) Requests[Key(client, request)] = lease;
                    else return "{\"cancelled\":false,\"applied\":null,\"state\":\"unknown\",\"reason\":\"Editor identity capacity exceeded\"}";
                } else
                return "{\"cancelled\":false,\"applied\":null,\"state\":\"unknown\",\"reason\":\"The originating request is not known in this Editor domain\"}";
            }
            lock (lease.Sync)
            {
                if (!EqualSecret(lease.Token, token) || lease.DomainId != domain || !string.Equals(lease.Root, Root(root), StringComparison.OrdinalIgnoreCase) ||
                    (!string.IsNullOrEmpty(operation) && lease.OperationId != operation))
                    throw new ArgumentException("Editor cancellation identity did not match");
                if (cancel && !lease.Applied)
                { lease.Cancelled = true; lease.Phase = "cancelled"; lease.FinishedAt = DateTime.UtcNow.Ticks; }
                if (lease.UncertainTombstone) return "{\"cancelled\":false,\"applied\":null,\"state\":\"unknown\",\"reason\":\"Older request identity awaits admission evidence\"}";
                return "{\"cancelled\":" + (lease.Cancelled ? "true" : "false") + ",\"applied\":" + (lease.Applied ? "true" : "false") +
                    ",\"state\":" + Bridge.Json(lease.Phase) + ",\"operationId\":" + Bridge.Json(lease.OperationId) + "}";
            }
            }
        }
        internal static Dictionary<string, object> Parse(string raw) { return new JsonReader(raw).Read(); }
        // A bounded strict JSON reader avoids calling UnityEngine.JsonUtility
        // from a network thread. Duplicate keys, invalid escapes and deep data
        // fail before queue registration or cancellation.
        sealed class JsonReader
        {
            readonly string text; int position;
            public JsonReader(string value) { text = value; }
            public Dictionary<string, object> Read()
            { var value = Value(0) as Dictionary<string, object>; Space(); if (value == null || position != text.Length) throw new ArgumentException("Invalid editor request JSON"); return value; }
            void Space() { while (position < text.Length && char.IsWhiteSpace(text[position])) position++; }
            char Take() { if (position >= text.Length) throw new ArgumentException("Incomplete JSON"); return text[position++]; }
            object Value(int depth)
            {
                if (depth > 32) throw new ArgumentException("JSON is too deep"); Space(); char first = Take();
                if (first == '"') return String();
                if (first == '{')
                {
                    var result = new Dictionary<string, object>(StringComparer.Ordinal); Space(); if (position < text.Length && text[position] == '}') { position++; return result; }
                    while (true) { Space(); if (Take() != '"') throw new ArgumentException("Object key required"); string key = String(); Space(); if (Take() != ':') throw new ArgumentException("Object separator required"); if (result.ContainsKey(key)) throw new ArgumentException("Duplicate JSON key"); result.Add(key, Value(depth + 1)); Space(); char next = Take(); if (next == '}') return result; if (next != ',') throw new ArgumentException("Object delimiter required"); }
                }
                if (first == '[')
                { var result = new List<object>(); Space(); if (position < text.Length && text[position] == ']') { position++; return result; } while (true) { result.Add(Value(depth + 1)); Space(); char next = Take(); if (next == ']') return result; if (next != ',') throw new ArgumentException("Array delimiter required"); } }
                int start = position - 1; while (position < text.Length && !char.IsWhiteSpace(text[position]) && text[position] != ',' && text[position] != '}' && text[position] != ']') position++;
                string literal = text.Substring(start, position - start); if (literal == "null") return null; if (literal == "true") return true; if (literal == "false") return false;
                double number; if (!Regex.IsMatch(literal, "^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$") || !double.TryParse(literal, NumberStyles.Float, CultureInfo.InvariantCulture, out number) || double.IsInfinity(number)) throw new ArgumentException("Invalid JSON value"); return number;
            }
            string String()
            {
                var value = new StringBuilder(); while (true) { char current = Take(); if (current == '"') return value.ToString(); if (current < 32) throw new ArgumentException("Invalid JSON string"); if (current != '\\') { value.Append(current); continue; } char escaped = Take(); switch (escaped) { case '"': case '\\': case '/': value.Append(escaped); break; case 'b': value.Append('\b'); break; case 'f': value.Append('\f'); break; case 'n': value.Append('\n'); break; case 'r': value.Append('\r'); break; case 't': value.Append('\t'); break; case 'u': if (position + 4 > text.Length) throw new ArgumentException("Incomplete unicode escape"); ushort code; if (!ushort.TryParse(text.Substring(position, 4), NumberStyles.HexNumber, CultureInfo.InvariantCulture, out code)) throw new ArgumentException("Invalid unicode escape"); value.Append((char)code); position += 4; break; default: throw new ArgumentException("Invalid JSON escape"); } }
            }
        }
    }
}
