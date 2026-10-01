"""Restore public Unity package dependencies into an owned temp cache before tests.

No account, token, user cache or project manifest is changed. This is dependency
preparation; it is deliberately separate from the offline Editor verification.
"""
import argparse
import hashlib
import json
import pathlib
import shutil
import tarfile
import urllib.request
import urllib.parse
import time

parser = argparse.ArgumentParser()
parser.add_argument('--project', required=True)
parser.add_argument('--editor', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--resume', action='store_true')
args = parser.parse_args()
owned = pathlib.Path('F:/AI/AgentMake/temp/GameCowork').resolve()
project, output = pathlib.Path(args.project).resolve(), pathlib.Path(args.output).resolve()
assert project.is_relative_to(owned) and output.is_relative_to(owned), 'Test caches and projects must stay in temp/GameCowork'
if output.exists():
    assert args.resume and (output / 'dependency-ledger.json').is_file(), 'Resume only the exact owned cache produced by this tool'
else:
    assert not args.resume, 'No prepared cache exists to resume'
editor = pathlib.Path(args.editor).resolve()
base = editor.parent / 'Data/Resources/PackageManager'
defaults = json.loads((base / 'Editor/manifest.json').read_text(encoding='utf8'))['packages']
lock = json.loads((project / 'Packages/packages-lock.json').read_text(encoding='utf8'))['dependencies']
pending = list(json.loads((project / 'Packages/manifest.json').read_text(encoding='utf8'))['dependencies'].items())
pending += [(name, row['version']) for name, row in lock.items() if row['source'] == 'registry']
visited = set()
metadata = {}
ledger = []
output.mkdir(parents=True, exist_ok=args.resume)

def fetch_bytes(url):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=60) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)
while pending:
    name, version = pending.pop(0)
    assert (name.startswith('com.unity.') or name == 'nuget.mono-cecil') and all(c.isalnum() or c in '.-' for c in name), name
    if version == 'default':
        version = defaults.get(name, {}).get('version') or lock.get(name, {}).get('version')
    assert version and all(c.isalnum() or c in '.+-' for c in version), (name, version)
    if (name, version) in visited:
        continue
    visited.add((name, version))
    builtin = base / 'BuiltInPackages' / name / 'package.json'
    if builtin.exists():
        package = json.loads(builtin.read_text(encoding='utf-8-sig'))
        if package['version'] == version:
            pending += list(package.get('dependencies', {}).items())
            ledger.append({'name': name, 'version': version, 'source': 'selected-editor-builtin'})
            continue
    if name not in metadata:
        metadata[name] = json.loads(fetch_bytes('https://packages.unity.com/' + name))
    package = metadata[name]['versions'][version]
    pending += list(package.get('dependencies', {}).items())
    url = package['dist']['tarball']
    parsed = urllib.parse.urlparse(url)
    assert parsed.scheme == 'https' and parsed.hostname == 'download.packages.unity.com' and not parsed.username
    archive = output / 'downloads' / (name + '-' + version + '.tgz')
    archive.parent.mkdir(exist_ok=True)
    if not archive.exists():
        archive.write_bytes(fetch_bytes(url))
    payload = archive.read_bytes()
    assert hashlib.sha1(payload).hexdigest() == package['dist']['shasum'], 'Public registry artifact integrity mismatch'
    staging = output / 'extract' / (name + '@' + version)
    if not (staging / '.extraction-complete').exists():
        staging.mkdir(parents=True, exist_ok=True)
        with tarfile.open(archive, 'r:gz') as tar:
            assert all(member.name == 'package' or member.name.startswith('package/') for member in tar.getmembers())
            tar.extractall(staging, filter='data')
        (staging / '.extraction-complete').write_text(hashlib.sha256(payload).hexdigest(), encoding='ascii')
    restored = json.loads((staging / 'package/package.json').read_text(encoding='utf-8-sig'))
    assert restored['name'] == name and restored['version'] == version
    for registry in ('packages.unity.com', 'packages.unity.cn'):
        npm = output / 'npm' / registry / name / version
        npm.mkdir(parents=True, exist_ok=True)
        if not (npm / 'package.tgz').exists():
            shutil.copyfile(archive, npm / 'package.tgz')
        unpacked = output / 'packages' / registry / (name + '@' + version)
        unpacked.parent.mkdir(parents=True, exist_ok=True)
        if not unpacked.exists():
            shutil.copytree(staging / 'package', unpacked)
    ledger.append({'name': name, 'version': version, 'url': url, 'sha1': package['dist']['shasum'],
                   'sha256': hashlib.sha256(payload).hexdigest(), 'source': 'public-unity-registry'})
    (output / 'dependency-ledger.json').write_text(json.dumps(ledger, indent=2), encoding='utf8')
    print('Restored public test dependency: ' + name + '@' + version, flush=True)
(output / 'dependency-ledger.json').write_text(json.dumps(ledger, indent=2), encoding='utf8')
print(json.dumps({'output': str(output), 'packages': len(ledger), 'prepared': True}))
