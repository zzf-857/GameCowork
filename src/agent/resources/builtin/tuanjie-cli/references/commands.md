# tuanjie-cli command reference

This CLI skill is supported only on Windows.

The executable is named `tuanjie.exe`. Run `<exe> <command> --help` if the
installed CLI differs from this reference.

## Version arguments

Every `<semver>` and `--editor-version` argument below requires the public
`1.x.x` version reported by Hub, such as `1.6.11`. Do not pass the internal
editor version, such as `2022.3.61t12`. If a command output shows both values,
select the `1.x.x` value for subsequent commands.

## Editors

```text
editors list-releases [--architecture <value>]
editors list-installed [--architecture <value>]
editors add <paths...>
```

- `list-releases` lists downloadable releases.
- `list-installed` lists installed editors and their locations/platforms.
- `add` accepts an editor root, an `Editor` directory, or an editor executable
  path. On Windows, directory inputs are resolved to `Editor/Tuanjie.exe`.
- `--architecture` is intended for macOS. Leave it unset on Windows.

## Install an editor

```text
install <semver> [--module <id> ...] [--childModules]
```

- `<semver>` is the public `1.x.x` version, such as `1.9.3`; it is not the
  internal `2022.x.x` editor version.
- Repeat `--module` for multiple module IDs.
- `--childModules` defaults to true and expands selected parent modules to
  include their child modules.
- The command waits for installation progress to finish.

## Editor modules

```text
install-modules <semver> --list
install-modules <semver> --module <id> ... [--childModules]
install-modules <semver> --all [--childModules]
```

- The editor version must already be installed.
- Use `--list` to obtain valid module IDs and installation state.
- Repeat `--module` for multiple module IDs.
- `--all` installs all currently uninstalled modules.
- `--childModules` defaults to true.

## Install path

```text
install-path --get
install-path --set <path>
```

`--get` defaults to true when `--set` is absent.

## Uninstall an editor

```text
uninstall <semver> [--architecture <value>]
```

- Confirm the semantic version against `editors list-installed`.
- `--architecture` is normally unnecessary on Windows.
- This is destructive and must follow the confirmation rule in `SKILL.md`.

## Projects

```text
projects list [pattern]
projects add <paths...>
projects remove <paths...>
projects info <path>
projects create <name> [--path <parent-directory>]
  --editor-version <semver> --template <template-id>
  [--architecture <value>] [--uos-enabled]
```

- `list` optionally filters by a case-insensitive title/path substring.
- `add` registers existing Tuanjie project directories with Hub.
- `remove` removes projects from the Hub registry without an interactive
  confirmation. The CLI source indicates registry removal, not filesystem
  deletion.
- `info` reports title, path, editor version, architecture, modification time,
  cloud metadata, arguments, and project size.
- `create` creates and registers a project. `--editor-version` and `--template`
  are required.
- When `--path` is omitted, `create` uses the project directory configured in
  Hub.
- Obtain template IDs from `template list <semver>`.
- `--uos-enabled` enables the UOS template variant.

## Project templates

```text
template list <semver>
template download <semver> <template-name> [--upgrade]
```

- The semantic editor version must be installed.
- `list` returns template IDs, display names, status, and versions.
- `download` downloads a remote template and waits for completion.
- `--upgrade` updates an existing template; omit it for a normal download.

## Open a project

```text
open <path> [--editor-version <semver>] [--architecture <value>]
```

- Without `--editor-version`, the command reads the required version from the
  project's settings.
- With `--editor-version`, the public semantic version is resolved to the
  editor's internal version.
- The command delegates to Hub's project opening service.
- `--architecture` is intended for macOS; leave it unset on Windows.

## Version compatibility

The current command set includes `template`, implemented `projects create`,
and implemented `open`. Older binaries may expose older help text while those
operations are unavailable. Check top-level `--help`; if `template` is absent,
do not attempt these newer workflows.

## Exit and output handling

- Preserve the CLI's human-readable stdout and live progress output.
- Installation and uninstallation may emit progress before the final result.
- The top-level CLI error handler may print help and exit with code 0 for some
  argument errors. Check output content as well as the process exit code.
