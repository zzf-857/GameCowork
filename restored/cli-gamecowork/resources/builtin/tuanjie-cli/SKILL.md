---
name: tuanjie-cli
description: Manage Tuanjie Engine editors, project templates, and projects through the Windows-only tuanjie-cli. Use on Windows when the user asks to list or install Tuanjie editor versions, manage editor modules or install paths, list or download templates, register, inspect, create, remove, or open a Tuanjie project, or uninstall an editor.
allowedTools:
  - run_shell_command
---

# tuanjie-cli

Use tuanjie-cli for editor and project management. Read
[commands.md](references/commands.md) before constructing a command when exact
arguments or current implementation limits matter.

## Invoke the executable

Cowork places its bundled `tuanjie.exe` executable at the front of the child
process `PATH`. Invoke it by command name. Do not run setup or path-discovery
commands before the requested command.

```powershell
tuanjie.exe editors list-installed
```

If `tuanjie.exe` cannot be resolved, report that Cowork must be restarted or
updated; do not search the filesystem.

Always quote user-provided paths by passing them as PowerShell arguments; do
not concatenate them into a command string.

## Operating rules

1. Use this skill only on Windows. On macOS, Linux, or any other platform,
   report that tuanjie-cli is currently unsupported and do not invoke it.
2. Use long command and option names for clarity.
3. Every version argument passed to the CLI must use the public `1.x.x`
   semantic version shown by Hub, for example `1.6.11`. Never pass the internal
   editor version such as `2022.3.61t12`. When output contains both forms, use
   the `1.x.x` value.
4. Do not add `--json`. Preserve the CLI's human-readable output and live
   progress in the standard terminal tool UI.
5. Inspect current state before changing it:
   - Before installing an editor, run `editors list-releases` and
     `editors list-installed`.
   - Before installing modules, run `install-modules <semver> --list`.
   - Before uninstalling, run `editors list-installed`.
   - Before removing a project, run `projects info <path>`.
6. Treat editor installation and module installation as long-running
   foreground commands. Wait for completion and report the final output.
7. Never run `uninstall` or `projects remove` unless the user explicitly
   requested that exact destructive action. If intent is ambiguous, ask for
   confirmation after showing the resolved version or project path.
8. Prefer a specific module list over `--all`. Use `--all` only when the user
   explicitly requests every available module.
9. Report command failures faithfully. Do not claim success based only on a
   zero exit code when output says the operation is unsupported.
10. Before using `template`, `projects create`, or the implemented `open`
    workflow, verify that `template` appears in
    `tuanjie.exe --help`. If it
    does not, report that the installed tuanjie-cli is outdated.

## Common workflows

### List editor versions

```powershell
tuanjie.exe editors list-releases
tuanjie.exe editors list-installed
```

### Install an editor

Confirm that the requested semantic version appears in `list-releases`, then:

```powershell
tuanjie.exe install <semver>
```

To include selected modules, repeat `--module`:

```powershell
tuanjie.exe install <semver> --module <module-id-1> --module <module-id-2>
```

### Manage modules

```powershell
tuanjie.exe install-modules <semver> --list
tuanjie.exe install-modules <semver> --module <module-id>
```

### Manage the install path

```powershell
tuanjie.exe install-path --get
tuanjie.exe install-path --set '<absolute-path>'
```

### Manage registered projects

```powershell
tuanjie.exe projects list
tuanjie.exe projects info '<project-path>'
tuanjie.exe projects add '<project-path>'
```

`projects remove` removes only the Hub registry entry according to the current
CLI documentation, but it is still destructive registry state and requires
explicit user intent.

### Manage project templates

The editor version must already be installed. List templates before choosing
one:

```powershell
tuanjie.exe template list <semver>
tuanjie.exe template download <semver> '<template-name>'
```

Use `--upgrade` with `template download` only when the user asks to update an
existing template.

### Create a project

Before creation, verify the editor is installed and list valid templates for
that version. Obtain the project name, parent directory, editor semantic
version, and exact template ID from the user or unambiguous context.

```powershell
tuanjie.exe projects create '<name>' --path '<parent-directory>' --editor-version <semver> --template '<template-id>'
```

Add `--uos-enabled` only when requested. If `--path` is omitted, the CLI uses
the project directory configured in Hub.

### Open a project

By default, the CLI reads the required editor version from the project:

```powershell
tuanjie.exe open '<project-path>'
```

Use `--editor-version <semver>` only when the user explicitly requests a
different editor version. On Windows, leave `--architecture` unset.
