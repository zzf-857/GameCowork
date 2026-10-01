:root {
  color-scheme: dark;

  --bg: #0f111a;
  --panel: #151a27;
  --panel-2: #101521;
  --border: rgba(255, 255, 255, 0.08);
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.62);
  --subtle: rgba(255, 255, 255, 0.12);

  --accent: #7aa2f7;
  --accent-2: #bb9af7;
  --ok: #9ece6a;
  --warn: #e0af68;
  --err: #f7768e;

  --shadow: 0 16px 50px rgba(0, 0, 0, 0.45);
  --radius: 8px;
  --radius-sm: 6px;

  --mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  --sans:
    ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    'Apple Color Emoji', 'Segoe UI Emoji';
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  height: 100%;
  min-height: 0;
}

body {
  margin: 0;
  background:
    radial-gradient(1200px 800px at 10% 0%, #1b2140 0%, transparent 60%),
    radial-gradient(900px 700px at 90% 10%, #2a1b40 0%, transparent 55%),
    var(--bg);
  color: var(--text);
  font-family: var(--sans);
  overflow: hidden;
}

a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

button,
input,
textarea {
  font-family: inherit;
}

.app {
  height: 100%;
  display: flex;
  padding: 12px;
  min-height: 0;
  min-width: 0;
  position: relative;
  overflow: hidden;
}

.main,
.cp-main {
  flex: 1;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
    var(--panel-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  position: relative;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  cursor: pointer;
  font-size: 13px;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.06);
}
.btn:active {
  transform: translateY(1px);
}
.btn.primary {
  background: linear-gradient(
    135deg,
    rgba(122, 162, 247, 0.2),
    rgba(187, 154, 247, 0.16)
  );
  border-color: rgba(122, 162, 247, 0.35);
}
.btn.danger {
  background: rgba(247, 118, 142, 0.12);
  border-color: rgba(247, 118, 142, 0.28);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 18px 80px;
  min-height: 0;
  min-width: 0;
  overflow-anchor: auto;
  scroll-padding-bottom: 80px;
}

.content > * {
  margin-bottom: 8px;
}

.content > * {
  margin-bottom: 12px;
}

.session-notice {
  position: sticky;
  top: 0;
  z-index: 4;
  padding: 10px 12px;
  border: 1px solid rgba(224, 175, 104, 0.3);
  border-radius: var(--radius-md);
  background: rgba(224, 175, 104, 0.08);
  color: var(--warn);
  white-space: pre-wrap;
  line-height: 1.45;
  backdrop-filter: blur(18px);
}

.user-message {
  padding: 4px 0;
  color: var(--text);
  font-weight: 500;
}

.assistant-message {
  padding: 4px 0;
}

.md {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
}
.md p {
  margin: 0 0 10px;
  white-space: pre-wrap;
}
.md h1,
.md h2,
.md h3,
.md h4 {
  margin: 14px 0 8px;
  line-height: 1.25;
}
.md h1 {
  font-size: 20px;
}
.md h2 {
  font-size: 17px;
}
.md h3 {
  font-size: 15px;
}
.md h4 {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.86);
}
.md ul,
.md ol {
  margin: 0 0 10px 18px;
  padding: 0;
}
.md li {
  margin: 4px 0;
  white-space: pre-wrap;
}
.md code.inline {
  font-family: var(--mono);
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(187, 154, 247, 0.95);
}
.md pre {
  margin: 10px 0;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.5;
}
.md pre code {
  font-family: var(--mono);
}
.md hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 14px 0;
}
.md table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 12px;
}
.md th,
.md td {
  border: 1px solid var(--border);
  padding: 8px 10px;
  vertical-align: top;
}
.md th {
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.86);
}
.md blockquote {
  margin: 10px 0;
  padding: 8px 10px;
  border-left: 3px solid rgba(122, 162, 247, 0.5);
  background: rgba(122, 162, 247, 0.06);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.86);
}

.think {
  margin: 12px 0;
}
.think summary {
  cursor: pointer;
  padding: 4px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 600;
  user-select: none;
  opacity: 0.8;
  letter-spacing: 0.05em;
}
.think summary:hover {
  opacity: 1;
}
.think.active {
  margin: 12px 0;
}
.think-body {
  margin-top: 6px;
  padding: 10px 12px;
  border-left: 3px solid rgba(122, 162, 247, 0.55);
  background: rgba(122, 162, 247, 0.06);
  border-radius: 10px;
}
.think-content,
.think pre {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.86);
  font-family: var(--sans);
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.tool-card {
  margin: 12px 0;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}

.tool-compact {
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  opacity: 0.95;
}

.tool-compact-arrow {
  color: rgba(255, 255, 255, 0.55);
}

.tool-compact-kind {
  color: rgba(187, 154, 247, 0.95);
}

.tool-compact-title {
  color: rgba(255, 255, 255, 0.86);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.tool-compact-status {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--muted);
}

.planning-indicator {
  font-size: 11px;
  color: var(--muted);
  margin: 12px 0;
  font-style: italic;
  background: linear-gradient(90deg, var(--muted), var(--text), var(--muted));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-text 2s infinite linear;
  opacity: 0.6;
}

@keyframes shimmer-text {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.shimmer {
  display: none;
}

@keyframes shimmer-pulse {
  0% {
    background-position: 200% 0;
    transform: scale(0.9);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    background-position: -200% 0;
    transform: scale(0.9);
    opacity: 0.4;
  }
}
.tool-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border);
}
.tool-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.tool-kind {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--muted);
  background: rgba(255, 255, 255, 0.03);
}
.tool-status {
  font-size: 11px;
  color: var(--muted);
}
.tool-card-body {
  padding: 10px 12px;
}
.diff {
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.26);
  overflow: auto;
  max-height: 420px;
}
.diff pre {
  margin: 0;
  padding: 10px 12px;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.45;
}
.diff .add {
  color: rgba(158, 206, 106, 0.95);
}
.diff .del {
  color: rgba(247, 118, 142, 0.95);
}
.diff .meta {
  color: rgba(122, 162, 247, 0.92);
}
.diff .hunk {
  color: rgba(224, 175, 104, 0.95);
}

.composer {
  border-top: 1px solid var(--border);
  padding: 12px;
  background: var(--panel-2);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}
.composer-inner {
  display: block;
}
.input-wrap {
  position: relative;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.03);
  /* Allow the slash command autocomplete popover to render outside the input. */
  overflow: visible;
  transition: all 0.2s;
}
.input-wrap:focus-within {
  border-color: rgba(122, 162, 247, 0.5);
  box-shadow: 0 0 0 4px rgba(122, 162, 247, 0.12);
}
textarea {
  width: 100%;
  min-height: 44px;
  max-height: 180px;
  resize: none;
  padding: 11px 44px 11px 12px;
  border: none;
  background: transparent;
  color: var(--text);
  outline: none;
  font-size: 13px;
  line-height: 1.45;
  display: block;
}

.composer-references {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px 0;
  background: transparent;
}

.ref-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
  max-width: 200px;
}

.ref-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ref-chip.file {
  background: rgba(255, 255, 255, 0.08);
}

.ref-chip.link {
  background: rgba(255, 255, 255, 0.08);
}

.ref-chip.default {
  background: rgba(255, 255, 255, 0.04);
}

.ref-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  width: 14px;
  height: 14px;
}

.ref-remove:hover {
  opacity: 1;
}

.composer-submit {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 20;
  opacity: 0.8;
}

.composer-submit:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

.composer-submit:active {
  transform: scale(0.92);
}

.composer-submit.busy {
  background: rgba(255, 255, 255, 0.15);
  opacity: 1;
  color: var(--err);
}

.composer-submit svg {
  display: block;
}
.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 12px;
}

.composer-footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-info {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50%;
}

.hint {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: normal;
  white-space: nowrap;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}
.status-bar:hover {
  background: rgba(255, 255, 255, 0.04);
}

.status-text {
  font-size: 11px;
  color: var(--err);
  opacity: 0.9;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--subtle);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.04);
}
.status-dot.connected {
  background: var(--ok);
  box-shadow: 0 0 8px rgba(158, 206, 106, 0.4);
}
.status-dot.connecting {
  background: var(--warn);
  animation: pulse 1.5s infinite ease-in-out;
}
.status-dot.disconnected {
  background: var(--err);
  box-shadow: 0 0 8px rgba(247, 118, 142, 0.4);
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

.autocomplete {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 50;
  border: 1px solid var(--border);
  background: rgba(20, 24, 35, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-height: 320px;
  display: flex;
  flex-direction: column;
}

.ac-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.ac-item {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.ac-item:last-child {
  border-bottom: none;
}

.ac-item:hover,
.ac-item.active {
  background: rgba(122, 162, 247, 0.12);
}

.ac-name code {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.ac-desc {
  font-size: 12px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ac-item.active .ac-desc {
  color: var(--text);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
}
.modal {
  width: min(1100px, 96vw);
  max-height: 90vh;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: rgba(16, 21, 33, 0.96);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}
.modal-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.modal-header h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 650;
}
.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
  overflow: auto;
}
.modal-pane {
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.18);
}
.modal-pane .pane-title {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted);
}
.modal-pane textarea {
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 12px;
  min-height: 320px;
  max-height: none;
  outline: none;
  font-family: var(--mono);
  font-size: 12px;
}
.modal-footer {
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ask-user-countdown {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid rgba(224, 175, 104, 0.58);
  border-radius: 12px;
  background: rgba(224, 175, 104, 0.12);
  box-shadow: inset 0 0 0 1px rgba(224, 175, 104, 0.08);
}
.ask-user-countdown-label {
  color: var(--warn);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ask-user-countdown-time {
  grid-row: span 2;
  min-width: 56px;
  padding: 6px 10px;
  border: 1px solid rgba(224, 175, 104, 0.6);
  border-radius: 999px;
  color: #ffd089;
  background: rgba(224, 175, 104, 0.16);
  font-family: var(--mono);
  font-size: 16px;
  font-weight: 800;
  text-align: center;
}
.ask-user-countdown-message {
  color: var(--muted);
  font-size: 12px;
}
.ask-user-option {
  position: relative;
  gap: 8px;
}
.ask-user-option-default {
  border-color: rgba(224, 175, 104, 0.85) !important;
  background: rgba(224, 175, 104, 0.12) !important;
  box-shadow: inset 0 0 0 1px rgba(224, 175, 104, 0.25);
}
.ask-user-option-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.ask-user-default-badge {
  padding: 2px 6px;
  border: 1px solid rgba(224, 175, 104, 0.68);
  border-radius: 999px;
  color: var(--warn);
  background: rgba(224, 175, 104, 0.1);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

/* Subagent card styles */
.subagent-card {
  background: linear-gradient(
    135deg,
    rgba(122, 162, 247, 0.04),
    rgba(187, 154, 247, 0.03)
  );
  border-color: rgba(122, 162, 247, 0.2);
}

.subagent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(122, 162, 247, 0.06);
  border-bottom: 1px solid rgba(122, 162, 247, 0.15);
}

.subagent-header.running {
  background: linear-gradient(
    90deg,
    rgba(122, 162, 247, 0.08),
    rgba(187, 154, 247, 0.08),
    rgba(122, 162, 247, 0.08)
  );
  background-size: 200% 100%;
  animation: shimmer-bg 3s infinite linear;
}

@keyframes shimmer-bg {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.subagent-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subagent-label {
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(122, 162, 247, 0.25),
    rgba(187, 154, 247, 0.2)
  );
  border: 1px solid rgba(122, 162, 247, 0.4);
  color: var(--accent);
  font-weight: 700;
}

.subagent-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.subagent-status-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subagent-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(122, 162, 247, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.subagent-status {
  font-size: 11px;
  color: var(--muted);
  font-weight: 500;
}

.subagent-task {
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--border);
}

.subagent-task-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 4px;
  font-weight: 600;
}

.subagent-task-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.subagent-params {
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subagent-param {
  font-family: var(--mono);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.subagent-result {
  padding: 10px 14px;
}

@media (max-width: 980px) {
  .app {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .modal-body {
    grid-template-columns: 1fr;
  }
}

/* =============================================
   Control Plane — shared base styles
   ============================================= */

.control-plane {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  min-height: 0;
}

/* Top header bar */
.cp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cp-header h1 {
  margin: 0;
  font-size: 16px;
}

.cp-header-actions {
  display: flex;
  gap: 8px;
}

.cp-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 3px;
}

/* Body area below header — sidebar + main */
.cp-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* =============================================
   PC Sidebar
   ============================================= */

.cp-sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--panel-2);
}

.cp-sidebar-section-label {
  padding: 10px 12px 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cp-sidebar-workers-label {
  border-top: 1px solid var(--border);
}

.cp-sidebar-workers-count {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
}

/* Broadcast summary section in sidebar */
.cp-sidebar-broadcast-section {
  padding: 10px 12px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cp-sidebar-broadcast-target {
  font-size: 12px;
  color: var(--muted);
}

.cp-sidebar-broadcast-btn {
  width: 100%;
  justify-content: center;
}

/* Worker nav list inside sidebar */
.cp-sidebar-workers {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0 8px;
}

.cp-sidebar-worker-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.12s;
  border-left: 2px solid transparent;
}

.cp-sidebar-worker-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.cp-sidebar-worker-item.active {
  background: rgba(122, 162, 247, 0.08);
  border-left-color: var(--accent);
}

.cp-sidebar-worker-item input[type='checkbox'] {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
  margin-top: 3px;
}

.cp-sidebar-worker-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cp-sidebar-worker-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.cp-sidebar-worker-url {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  word-break: break-all;
  line-height: 1.4;
}

.cp-sidebar-worker-tags {
  font-size: 11px;
  color: rgba(187, 154, 247, 0.7);
  line-height: 1.4;
}

.cp-sidebar-worker-status {
  flex-shrink: 0;
  margin-top: 2px;
}

/* =============================================
   PC Broadcast Modal
   ============================================= */

.cp-broadcast-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(3px);
}

.cp-broadcast-modal {
  width: min(860px, 96vw);
  max-height: 88vh;
  background: rgba(16, 21, 33, 0.98);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cp-broadcast-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cp-broadcast-modal-title {
  font-size: 15px;
  font-weight: 650;
}

.cp-broadcast-modal-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
}

.cp-broadcast-modal-close:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.cp-broadcast-modal-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.cp-broadcast-modal-left {
  display: flex;
  flex-direction: column;
  padding: 14px 18px;
  gap: 10px;
  border-right: 1px solid var(--border);
  min-height: 0;
}

.cp-broadcast-modal-right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.cp-broadcast-modal-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}

.cp-broadcast-modal-node-actions {
  display: flex;
  gap: 6px;
}

.cp-broadcast-modal-textarea {
  flex: 1;
  min-height: 160px;
  resize: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
}

.cp-broadcast-modal-textarea:focus {
  outline: none;
  border-color: rgba(122, 162, 247, 0.5);
  box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.1);
}

.cp-broadcast-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
}

.cp-broadcast-modal-target {
  font-size: 12px;
  color: var(--muted);
}

.cp-broadcast-modal-node-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.cp-broadcast-modal-node-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.1s;
}

.cp-broadcast-modal-node-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.cp-broadcast-modal-node-item input[type='checkbox'] {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  cursor: pointer;
  margin-top: 2px;
}

.cp-broadcast-modal-node-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cp-broadcast-modal-node-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.cp-broadcast-modal-node-url {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  word-break: break-all;
}

.cp-broadcast-modal-node-tags {
  font-size: 11px;
  color: rgba(187, 154, 247, 0.7);
}

/* =============================================
   PC Main area — worker grid
   ============================================= */

.cp-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cp-workers {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.cp-workers-header {
  padding: 12px 16px 0;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cp-workers-header .btn {
  text-transform: none;
  letter-spacing: normal;
  font-size: 11px;
  padding: 2px 8px;
}

.cp-worker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  padding: 12px 16px 16px;
  align-content: start;
}

/* =============================================
   Worker task cards
   ============================================= */

.cp-task-card {
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: border-color 0.15s ease;
  max-height: 30vh;
  min-height: 180px;
}

.cp-task-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.cp-task-card.selected {
  border-color: var(--ok);
}

.cp-task-card.error {
  border-color: var(--err);
}

.cp-task-card.selected.error {
  border-color: var(--err);
}

.cp-task-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cp-task-header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.cp-task-header-left {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.cp-task-header-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  /* Keep title + URL as two explicit lines; do not clip the link row away */
  overflow: visible;
}

.cp-task-name {
  font-weight: 600;
  font-size: 13px;
  line-height: 1.35;
  /* Line 1: title only; URL is always the next sibling on line 2 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cp-task-url {
  font-size: 11px;
  color: var(--muted);
  display: block;
  line-height: 1.35;
  word-break: break-all;
  /* Second line dedicated to link; wrap instead of single-line ellipsis */
  overflow-wrap: anywhere;
}

.cp-task-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
  margin-left: auto;
}

.cp-conn {
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
}

.cp-conn.connected {
  color: var(--ok);
  border-color: rgba(158, 206, 106, 0.4);
}

.cp-conn.disconnected {
  color: var(--err);
  border-color: rgba(247, 118, 142, 0.4);
}

.cp-queue,
.cp-activity {
  font-size: 11px;
}

/* One row: Cancel / Refresh / Retry + idle activity timestamp */
.cp-task-actions-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.cp-task-actions {
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.cp-task-actions-time {
  flex-shrink: 0;
}

.cp-task-actions .btn {
  padding: 2px 8px;
  font-size: 11px;
}

.cp-task-error {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--err);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cp-task-notice {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--warn);
  border-bottom: 1px solid var(--border);
  background: rgba(224, 175, 104, 0.06);
  white-space: pre-wrap;
  flex-shrink: 0;
}

.cp-task-body {
  padding: 10px 12px;
  overflow: auto;
  flex: 1;
  min-height: 60px;
}

.cp-task-message,
.cp-task-tool {
  margin-bottom: 10px;
}

.cp-task-input {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.cp-task-textarea {
  flex: 1;
  min-height: 40px;
  max-height: 80px;
  resize: vertical;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.4;
}

.cp-task-input .btn {
  align-self: flex-end;
}

/* =============================================
   Endpoint registry Drawer (right side)
   ============================================= */

.cp-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 600px;
  max-width: 100%;
  z-index: 100;
  background: var(--panel-2);
  border-left: 1px solid var(--border);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.cp-drawer.open {
  transform: translateX(0);
}

.cp-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(2px);
}

.cp-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--panel-2);
  z-index: 10;
}

.cp-drawer-header h2 {
  margin: 0;
  font-size: 14px;
}

.cp-drawer-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.cp-drawer-content {
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
}

/* =============================================
   Shared form elements
   ============================================= */

.cp-input,
.cp-select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 13px;
  width: 100%;
}

.cp-select {
  min-width: 100px;
}

.cp-content {
  padding: 12px 16px;
  overflow: auto;
  flex: 1;
}

.cp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cp-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.03);
}

.cp-select-box {
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
}

.cp-select-box input {
  width: 15px;
  height: 15px;
}

.cp-row-main {
  flex: 1;
  min-width: 0;
}

.cp-row-title {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cp-name {
  font-weight: 600;
  font-size: 13px;
}

.cp-url {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  word-break: break-all;
}

.cp-row-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.cp-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cp-tag {
  padding: 2px 6px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  color: var(--muted);
}

.cp-tag.muted {
  opacity: 0.6;
}

.cp-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.cp-health {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  color: var(--muted);
}

.cp-health.ok {
  color: var(--ok);
  border-color: rgba(158, 206, 106, 0.4);
}

.cp-health.err {
  color: var(--err);
  border-color: rgba(247, 118, 142, 0.4);
}

.cp-health.pending {
  color: var(--muted);
}

.cp-health-ms {
  margin-left: 6px;
  color: var(--muted);
  font-size: 11px;
}

.cp-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
}

.cp-page-info,
.cp-page-number {
  font-size: 12px;
  color: var(--muted);
}

.cp-page-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp-modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.cp-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.cp-modal-actions {
  display: flex;
  gap: 8px;
}

.cp-error {
  color: var(--err);
  font-size: 13px;
  margin-top: 6px;
}

.cp-loading,
.cp-empty {
  color: var(--muted);
  font-size: 13px;
  padding: 10px 0;
}

/* =============================================
   Mobile — Worker compact list card
   ============================================= */

.cp-task-card-compact {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
}

.cp-task-card-compact:active {
  background: rgba(255, 255, 255, 0.05);
}

.cp-task-card-compact.error {
  border-color: rgba(247, 118, 142, 0.35);
}

.cp-task-card-compact input[type='checkbox'] {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.cp-task-card-compact-body {
  flex: 1;
  min-width: 0;
}

.cp-task-card-compact-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.cp-task-card-compact-name {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cp-task-card-compact-meta {
  font-size: 11px;
  color: var(--muted);
  display: flex;
  gap: 8px;
}

.cp-task-card-compact-preview {
  font-size: 12px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cp-task-card-compact-chevron {
  color: var(--muted);
  flex-shrink: 0;
  font-size: 16px;
  opacity: 0.5;
}

/* =============================================
   Mobile — Detail view
   ============================================= */

.cp-mobile-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.cp-mobile-header-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.cp-mobile-back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--accent);
  font-size: 15px;
  cursor: pointer;
  padding: 4px 0;
  flex-shrink: 0;
}

.cp-mobile-detail-title {
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cp-mobile-detail-feed {
  flex: 1;
  overflow: auto;
  padding: 10px 14px;
  min-height: 0;
}

.cp-mobile-detail-input {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.cp-mobile-detail-textarea {
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  resize: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
}

.cp-mobile-detail-send {
  align-self: flex-end;
  min-height: 44px;
  padding: 0 18px;
}

/* =============================================
   Mobile — Bottom Tab Bar
   ============================================= */

.cp-mobile-tab-bar {
  display: none;
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  background: var(--panel-2);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.cp-mobile-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 11px;
  cursor: pointer;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.12s;
}

.cp-mobile-tab.active {
  color: var(--accent);
}

.cp-mobile-tab svg {
  flex-shrink: 0;
}

.cp-mobile-tab-broadcast {
  color: var(--muted);
}

.cp-mobile-tab-badge {
  position: absolute;
  top: 6px;
  right: calc(50% - 18px);
  background: var(--accent);
  color: #0f111a;
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  padding: 1px 5px;
  min-width: 16px;
  text-align: center;
  line-height: 1.4;
}

/* =============================================
   Mobile — Broadcast tab (inline, full height)
   ============================================= */

.cp-mobile-broadcast-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.cp-broadcast-sheet-nodes {
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cp-broadcast-sheet-nodes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
}

.cp-broadcast-sheet-subtitle {
  font-size: 13px;
  color: var(--muted);
}

.cp-broadcast-sheet-node-list {
  overflow-y: auto;
  flex: 1;
}

.cp-broadcast-sheet-node-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  -webkit-tap-highlight-color: transparent;
}

.cp-broadcast-sheet-node-item:active {
  background: rgba(255, 255, 255, 0.04);
}

.cp-broadcast-sheet-node-item:last-child {
  border-bottom: none;
}

.cp-broadcast-sheet-node-item input[type='checkbox'] {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
}

.cp-broadcast-sheet-node-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.cp-broadcast-sheet-node-name {
  font-size: 14px;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.4;
}

.cp-broadcast-sheet-node-url {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
  word-break: break-all;
}

.cp-broadcast-sheet-compose {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}

.cp-broadcast-sheet-textarea {
  width: 100%;
  min-height: 80px;
  max-height: 160px;
  resize: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
}

.cp-broadcast-sheet-footer {
  display: flex;
  gap: 10px;
}

.cp-broadcast-sheet-footer .btn {
  flex: 1;
  min-height: 44px;
  font-size: 14px;
}

/* =============================================
   Mobile — Worker list view
   ============================================= */

.cp-mobile-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* =============================================
   Mobile — Endpoints tab
   ============================================= */

.cp-mobile-endpoints-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.cp-mobile-endpoints-toolbar {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

/* =============================================
   Responsive breakpoints
   ============================================= */

/* Desktop: sidebar + broadcast modal, no mobile elements */
@media (min-width: 769px) {
  .cp-sidebar {
    display: flex;
  }
  .cp-header-mobile,
  .cp-mobile-list,
  .cp-mobile-detail,
  .cp-mobile-tab-bar,
  .cp-mobile-endpoints-tab,
  .cp-mobile-broadcast-tab {
    display: none !important;
  }
  .cp-header-pc {
    display: flex;
  }
}

/* Mobile: bottom tabs, no sidebar */
@media (max-width: 768px) {
  .app {
    padding: 0;
  }

  .cp-header-pc {
    display: none !important;
  }

  .cp-header-mobile {
    display: flex;
  }

  .cp-sidebar {
    display: none;
  }

  .cp-main {
    display: none;
  }

  .cp-mobile-tab-bar {
    display: flex;
  }

  /* Body fills between header and tab bar */
  .cp-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }

  /* Drawer goes full screen on mobile */
  .cp-drawer {
    inset: 0;
    width: 100%;
    max-width: none;
    border-radius: 0;
    border: none;
  }
  .cp-drawer.open {
    width: 100%;
  }

  /* Endpoint list rows stack vertically */
  .cp-row {
    flex-direction: column;
    gap: 8px;
  }
  .cp-actions {
    margin-top: 0;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cp-actions .btn {
    min-height: 40px;
    flex: 1;
  }

  .cp-input,
  .cp-select {
    min-height: 40px;
    font-size: 14px;
  }

  .btn {
    min-height: 38px;
  }

  /* Broadcast modal hidden on mobile (use sheet instead) */
  .cp-broadcast-modal-backdrop {
    display: none !important;
  }
}

/* ─── Rollout Page ──────────────────────────────────────────────────────────── */

.rollout-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
}

.rollout-stats {
  display: flex;
  gap: 20px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
}
.rollout-stat {
  text-align: center;
  min-width: 72px;
}
.rollout-stat-value {
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.rollout-stat-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.rollout-running {
  color: var(--accent);
}
.rollout-queued {
  color: var(--warn);
}
.rollout-completed {
  color: var(--ok);
}
.rollout-failed {
  color: var(--err);
}

.rollout-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.rollout-sidebar {
  width: 320px;
  border-right: 1px solid var(--border);
  background: var(--panel);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.rollout-sidebar-section {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.rollout-sidebar-queue {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
}
.rollout-label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.rollout-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.rollout-input,
.rollout-textarea,
.rollout-select {
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--sans);
  outline: none;
  width: 100%;
}
.rollout-input:focus,
.rollout-textarea:focus {
  border-color: var(--accent);
}
.rollout-input-sm {
  width: 70px;
  flex: 0 0 auto;
}
.rollout-textarea {
  resize: vertical;
  min-height: 80px;
}
.rollout-select {
  cursor: pointer;
}
.rollout-add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rollout-badge {
  background: var(--subtle);
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.rollout-queue-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rollout-queue-empty {
  color: var(--muted);
  font-size: 12px;
  padding: 8px 0;
}
.rollout-queue-item {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}
.rollout-queue-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rollout-queue-item-prompt {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rollout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}
.rollout-main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
}
.rollout-main-title {
  font-size: 15px;
  font-weight: 600;
}
.rollout-main-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}
.rollout-main-controls .rollout-select {
  width: auto;
  min-width: 100px;
}
.rollout-task-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rollout-empty {
  text-align: center;
  padding: 40px;
  color: var(--muted);
}
.rollout-task-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  transition: border-color 0.15s;
}
.rollout-task-card:hover {
  border-color: var(--muted);
}
.rollout-task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.rollout-task-card-left {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.rollout-task-id {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
}
.rollout-task-model {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--subtle);
  color: var(--muted);
}
.rollout-task-tags {
  font-size: 11px;
  color: var(--accent-2);
}
.rollout-task-status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 10px;
}
.rollout-task-status.queued {
  background: rgba(224, 175, 104, 0.15);
  color: var(--warn);
}
.rollout-task-status.running {
  background: rgba(122, 162, 247, 0.15);
  color: var(--accent);
}
.rollout-task-status.completed {
  background: rgba(158, 206, 106, 0.15);
  color: var(--ok);
}
.rollout-task-status.failed,
.rollout-task-status.stopped {
  background: rgba(247, 118, 142, 0.15);
  color: var(--err);
}
.rollout-task-status.cancelled {
  background: var(--subtle);
  color: var(--muted);
}

.rollout-task-prompt {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text);
  margin-bottom: 4px;
  word-break: break-word;
}
.rollout-task-command {
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.4;
  color: var(--muted);
  background: var(--subtle);
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rollout-task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 11px;
  color: var(--muted);
}
.rollout-task-actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}
.rollout-btn-sm {
  font-size: 12px !important;
  padding: 4px 10px !important;
}
.rollout-btn-xs {
  font-size: 11px !important;
  padding: 2px 8px !important;
}

/* Tabs */
.rollout-tabs {
  display: flex;
  gap: 0;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
}
.rollout-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.rollout-tab:hover {
  color: var(--text);
}
.rollout-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.rollout-hint {
  font-size: 12px;
  color: var(--muted);
  font-weight: 400;
}
.rollout-task-card.is-running {
  border-left: 3px solid var(--accent);
}

/* Detail / Log panel */
.rollout-log-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.rollout-log-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 55vw;
  min-width: 500px;
  height: 100vh;
  background: var(--panel);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: rollout-slide-in 0.2s ease;
}
@keyframes rollout-slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.rollout-log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.rollout-log-header h3 {
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}
.rollout-detail-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
}
.rollout-detail-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
}
.rollout-detail-tab:hover {
  color: var(--text);
}
.rollout-detail-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.rollout-log-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--muted);
}
.rollout-log-content.loading {
  opacity: 0.5;
}
.rollout-live-dot {
  color: var(--ok);
  font-size: 11px;
  font-weight: 600;
  animation: rollout-blink 1s infinite;
}
@keyframes rollout-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Artifacts list */
.rollout-artifact-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rollout-artifact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--subtle);
  border-radius: var(--radius);
  color: var(--text);
  text-decoration: none;
  font-family: var(--mono);
  font-size: 12px;
  transition: background 0.15s;
}
.rollout-artifact-item:hover {
  background: var(--border);
}
.rollout-artifact-icon {
  font-size: 14px;
}

/* Resolution badge */
.rollout-task-resolution {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  background: rgba(187, 154, 247, 0.15);
  color: #bb9af7;
  font-weight: 600;
}

/* Config info */
.rollout-config-info {
  font-size: 12px;
  line-height: 1.8;
  color: var(--muted);
}
.rollout-config-info code {
  font-family: var(--mono);
  font-size: 11px;
  background: var(--subtle);
  padding: 1px 5px;
  border-radius: 3px;
}

/* New Task Dialog */
.rollout-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 680px;
  max-width: 90vw;
  max-height: 85vh;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: rollout-dialog-in 0.2s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
@keyframes rollout-dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
.rollout-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border);
}
.rollout-dialog-header h3 {
  font-size: 16px;
  margin: 0;
}
.rollout-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rollout-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}

/* Form groups */
.rollout-form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rollout-form-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.rollout-form-details {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
}
.rollout-form-details[open] {
  padding-bottom: 4px;
}

/* JSON editor */
.rollout-json-editor {
  font-family: var(--mono) !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  min-height: 300px;
  resize: vertical;
  tab-size: 2;
}
.rollout-json-error {
  color: var(--err);
  font-size: 12px;
  padding: 4px 0;
}
