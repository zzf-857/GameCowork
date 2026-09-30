# GameCowork App (Cowork) Reference

Cowork is a standalone desktop application that provides a unified GUI
platform to orchestrate agent activities independently of a terminal or IDE. It
shares the same underlying agentic capabilities as GameCowork CLI.

> [!NOTE] Cowork coexists with **GameCowork CLI**. While the CLI provides
> a terminal-based experience, Cowork offers a full desktop application with
> graphical project management, visual settings, and integrated workspaces. Both
> share the same settings hierarchy, skills system, and MCP support.

## 1. Unified Interface Surfaces

### Left-hand Sidebar

The sidebar provides session history, workspace management, and quick actions.

- **New Session**: Start a new chat session with the agent.
- **Asset Marketplace**: Browse and install assets via natural language.
- **Search**: Search across session history.
- **History**: Scrollable list of past sessions, grouped by time period
  (Today, Yesterday, Last 7 Days, etc.).
- **Workspaces**: In Hub mode, the sidebar shows multiple workspace sections,
  each with its own session list. Workspaces can be opened, closed,
  reordered, and pinned.
- **User Profile**: Bottom of sidebar — access Settings, Theme switching,
  Account, and Login/Logout.

### Settings Page

Accessed via the User Profile menu or the settings gear icon. Organized into
sidebar groups:

**Workspace group:**

- **General**: Chat settings (wrap codeblocks, session titles, format
  markdown), notifications, appearance (language, font size), autocomplete
  settings, and external script editor.
- **Devices**: Remote tunnel and keep-awake settings (Tauri shell only).
- **Shortcuts**: Keyboard shortcut reference.

**Personal group:**

- **Account & Usage**: Opens the usage dashboard in a browser.

**Capabilities group:**

- **Models**: Custom model profile management.
- **Skills**: Manage skills (list, enable/disable, install/uninstall).
- **Subagents**: Manage custom subagent definitions.
- **Commands**: Manage custom slash commands.
- **Extensions**: Manage installed extensions (bundles of skills, agents, and
  MCP servers).
- **MCP Servers**: Add, edit, and remove MCP server configurations.

**Help group:**

- **Docs**: Opens external documentation.

### Chat Canvas

The main panel for direct agent interaction, planning, and task execution.

- **Slash Commands**: Type `/` to invoke built-in workflows. Available
  commands include `/manage skills`, `/manage commands`, `/manage extensions`,
  `/manage mcp`, `/manage subagents`, `/switch model`, `/attach file`,
  `/mention file`, `/clear conversation`, `/account usage`, and more.
- **@ Mentions**: Type `@` to attach context directly to your message.
  Supported categories include files and folders, previous conversations, and
  MCP tools.
- **Media Uploads**: Drag-and-drop or paste images and files into the chat
  canvas to share them with the agent. Uploaded media is analyzed via the
  `analyze_multimedia` tool.

## 2. Agent Settings & Permissions

The **Settings** page provides global and project-level controls for agent
behavior, security, and permissions. All settings are stored in JSON
configuration files and shared with GameCowork CLI.

### Global Settings

Path: `~/.gamecowork-cli/settings.json`

These settings apply across all projects and conversations:

- **Model Selection**: Choose the active model (e.g., `gamecowork-core`,
  `gamecowork-flash`, `gamecowork-air`). Configured via `model-config.json`.
- **Authentication**: Configure auth method via `selectedAuthType`
  (e.g., `gamecowork-oauth`).
- **MCP Servers**: Add HTTP(S)-based MCP server endpoints under
  `mcpServers`.
- **Unity Insight**: Enable/disable Unity project analysis via
  `unityInsight.enabled`.
- **IDE Mode**: Toggle `ideMode` for IDE integration features.

### Project-Level Settings

Path: `<project-root>/.gamecowork-cli/settings.json`

Each project can override specific fields from global settings:

- **Model Override**: Use a different model for a specific project (e.g.,
  `gamecowork-core` for large codebases, `gamecowork-flash` for lightweight tasks).
- **MCP Servers**: Project-level servers are merged with global servers.
- **Skills**: Project-level skills in `.gamecowork-cli/skills/` can be shared via
  Git. Team members clone and use the in-app Skills manager to install or
  enable them.

> **Security**: Do not commit API keys or tokens in project-level settings.
> Store secrets in user-level settings or local overrides excluded from Git.

## 3. Applying Changes

| Change                      | How to apply                                 |
| :-------------------------- | :------------------------------------------- |
| Skill content / new install | Use in-app Skills manager, or restart Cowork |
| Subagent (`agents/*.toml`)  | Restart Cowork or open new session           |
| Settings / MCP / Model      | Restart Cowork                               |

## 4. FAQ

For common questions and troubleshooting (including pricing and billing),
see the official FAQ page:
<https://gamecowork-docs.tuanjie.cn/faq/common-questions>
