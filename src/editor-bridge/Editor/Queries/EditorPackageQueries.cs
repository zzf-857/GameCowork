using System;
using System.Collections.Generic;
using System.Text;
using UnityEditor;
using UnityEditor.PackageManager;
using PackageInfo = UnityEditor.PackageManager.PackageInfo;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Snapshot the Editor's loaded UPM registry only. No Client.List/Add/Remove,
    // manifest read-as-installation proof, package resolution or cache mutation.
    internal static class EditorPackageQueries
    {
        const int PackageLimit = 1024, DependencyLimit = 128, ResponseLimit = 900000;
        [Serializable] sealed class Dependency { public string name, version; }
        [Serializable] sealed class Package
        {
            public string name, version, displayName, description, source, assetPath, resolvedPath;
            public bool isDirectDependency, dependenciesTruncated, textTruncated;
            public Dependency[] dependencies;
        }
        [Serializable] sealed class Result
        {
            public bool success = true, readOnly = true, registeredPackagesOnly = true, networkRequestStarted = false, queryComplete, truncated;
            public string projectRoot, scope = "currently-loaded-registered-packages", filterLimitation;
            public int totalPackages, returnedCount;
            public Package[] data;
        }
        static string Clip(string value, int limit, ref bool clipped)
        { if (value == null) return ""; if (value.Length <= limit) return value; clipped = true; return value.Substring(0, limit) + " [truncated]"; }
        internal static string Invoke(string raw)
        {
            var envelope = EditorCancellation.Parse(raw); object value;
            var input = envelope.TryGetValue("params", out value) ? value as Dictionary<string, object> : null;
            if (input == null) throw new ArgumentException("Package params object is required");
            if (!input.TryGetValue("action", out value) || !(value is string) || (string)value != "list_packages")
                throw new NotSupportedException("This package query handler supports list_packages; install/remove require their separate write lifecycle");
            if (input.TryGetValue("timeoutSeconds", out value) && value != null && (!(value is double) || double.IsNaN((double)value) || double.IsInfinity((double)value) || (double)value % 1 != 0 || (double)value < 1 || (double)value > 300))
                throw new ArgumentException("timeoutSeconds must be an integer in 1..300");
            PackageInfo[] registered = PackageInfo.GetAllRegisteredPackages();
            if (registered == null) throw new InvalidOperationException("The Editor registered-package snapshot is unavailable");
            var ordered = (PackageInfo[])registered.Clone();
            Array.Sort(ordered, (left, right) => StringComparer.Ordinal.Compare(left == null ? "" : left.name, right == null ? "" : right.name));
            var packages = new List<Package>(); int bytes = 0; bool truncated = registered.Length > PackageLimit;
            foreach (var package in ordered) {
                if (packages.Count >= PackageLimit) break;
                if (package == null || string.IsNullOrEmpty(package.name)) { truncated = true; continue; }
                bool clipped = false; var dependencies = new List<Dependency>(); var required = package.dependencies ?? new DependencyInfo[0];
                for (int index = 0; index < Math.Min(required.Length, DependencyLimit); index++) {
                    var dependency = required[index]; dependencies.Add(new Dependency { name = Clip(dependency.name, 256, ref clipped), version = Clip(dependency.version, 256, ref clipped) });
                }
                var row = new Package { name = Clip(package.name, 256, ref clipped), version = Clip(package.version, 256, ref clipped), displayName = Clip(package.displayName, 512, ref clipped),
                    description = Clip(package.description, 4096, ref clipped), source = package.source.ToString(), assetPath = Clip(package.assetPath, 2048, ref clipped), resolvedPath = Clip(package.resolvedPath, 4096, ref clipped),
                    isDirectDependency = package.isDirectDependency, dependencies = dependencies.ToArray(), dependenciesTruncated = required.Length > DependencyLimit, textTruncated = clipped };
                int size = Encoding.UTF8.GetByteCount(JsonUtility.ToJson(row)); if (bytes + size > 800000) { truncated = true; break; }
                bytes += size; packages.Add(row); if (row.dependenciesTruncated || clipped) truncated = true;
            }
            bool complete = !truncated && !EditorApplication.isCompiling && !EditorApplication.isUpdating;
            string json = JsonUtility.ToJson(new Result { data = packages.ToArray(), projectRoot = Bridge.ProjectRoot, totalPackages = registered.Length, returnedCount = packages.Count,
                queryComplete = complete, truncated = truncated, filterLimitation = complete ? null : "Loaded package snapshot is bounded or the Editor is changing; this is not the remote available-package catalog" });
            if (Encoding.UTF8.GetByteCount(json) > ResponseLimit) throw new InvalidOperationException("Package response exceeds 900000 bytes");
            return json;
        }
    }
}
