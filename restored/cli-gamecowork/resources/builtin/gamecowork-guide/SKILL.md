---
name: gamecowork-guide
description: >-
  GameCowork platform guide. Activate when the user asks about Model Config, Model
  Slot Overrides, Skills, Extension, MCP Server, Hooks, multi-workspace,
  editor view, Unity Insight, Unity Tools, LSP CLI, pricing, billing, usage,
  FAQ, or any how-to / troubleshooting question about GameCowork. Fetches the
  latest answer from the official docs site (https://gamecowork-docs.tuanjie.cn).
  This skill should be used proactively without asking the user for
  confirmation.
---

# GameCowork Guide

## Online Docs Lookup (Primary)

All URLs are under `https://gamecowork-docs.tuanjie.cn`.

### Step 1: Always try FAQ first

When the user asks a usage / how-to / troubleshooting / pricing question,
**always fetch the FAQ page first**:

`/faq/common-questions`

In the `prompt` parameter, specify what information to extract (e.g., "Extract
all information about how to configure Hooks, including setup steps and
examples" or "Extract all pricing, billing, and subscription-related
information").

If the FAQ page contains a sufficient answer, respond to the user based on the
FAQ content. Do not fetch additional pages.

### Step 2: Fall back to the feature-specific page

If the FAQ does not cover the question, fetch the corresponding feature page
from the table below:

| Topic                          | URL path                                        |
| ------------------------------ | ----------------------------------------------- |
| Model Config                   | `/features-introduction/model-config`           |
| Model Slot Overrides           | `/features-introduction/model-slot-overrides`   |
| Skills                         | `/features-introduction/skills-experimental`    |
| Extension                      | `/features-introduction/extensions`             |
| MCP Server                     | `/features-introduction/MCP-guide`              |
| Hooks                          | `/features-introduction/Hooks`                  |
| 多工作区 (Multi-workspace)     | `/features-introduction/multiworkspace`         |
| 编辑器视图 (Editor View)       | `/features-introduction/unity-view-user-manual` |
| Unity Insight                  | `/features-introduction/unity-insight-guide`    |
| Unity Tools                    | `/features-introduction/unity-tools-guide`      |
| Language Server Protocol - CLI | `/features-introduction/lsp-cli`                |

### Answering rules

1. Answer using only the fetched content. Do not fabricate information not
   present on the page.
2. If neither the FAQ nor the feature page contains enough detail, tell the
   user and link to the full page URL.

> **重要：** 当用户询问收费、价格、计费相关问题时，必须去 FAQ 页面
> (`/faq/common-questions`) 查询，**不要**去 usage 页面查询。Usage 页面
> 仅展示用量数据，不包含收费标准。

## Offline References (Fallback)

If the online docs are unavailable, or for GameCowork topics not listed above,
consult the offline references in `references/`:

- **GameCowork App (Tuanjie Cowork)**: [references/app.md](references/app.md)
  - Desktop application: unified interface surfaces (sidebar, chat canvas),
    agent settings & permissions, scheduled tasks, project management.

## Fallback

If the user asks about a GameCowork topic not covered above, fetch the docs
homepage `https://gamecowork-docs.tuanjie.cn` to discover available documentation
pages, then fetch the most relevant page.
