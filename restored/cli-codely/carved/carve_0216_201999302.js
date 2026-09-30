# Codely built-in loop-detection evidence policy (DEFAULT tier).
# Override by placing files in:
#   ~/.codely-cli/loop-detection-policies/*.toml
#   (system) .../loop-detection-policies/*.toml
#
# judge_system_prompt configures only the policy body. The code always wraps it
# in fixed diagnostic, untrusted-data, non-execution, and response guardrails.
# Placeholders in this policy body:
#   {{ignored_tools}}           — comma-separated ignored tool patterns
#   {{ignored_tools_section}}   — full ignored-tools paragraph (or empty)
#   {{analysis_max_chars}}      — analysis length budget
#
# Threshold fields below are the shipped defaults (keep in sync with
# DEFAULT_LOOP_CYCLE_THRESHOLD_CONFIG in loopEvidencePolicy.ts). Higher-tier
# TOML may override individual fields; omitted fields keep these defaults.
# Same-tier conflicts resolve in ordinal (code-point) file order, independent
# of the system locale: thresholds/flags take the last ordinal declaration,
# rules take the first — and within one file, rules resolve by numeric
# declaration order (every toolName entry expanded from one rule shares its
# declaration index).
#
# Content detection layers:
#   - Short fast-path: identical short chunks / same line, count from
#     content_repeat_threshold (the length windows stay code constants)
#   - Long-stream probe: tail needle grep → discover period length

version = 1

# Enable periodic tool-call cycle detection (A→B→A→B, k=2..tool_cycle_max_period).
# Does NOT disable content/reasoning probe detection.
enable_cycle_detection = true

# Max tool-cycle period length k (detect cycles of length 2..k). Range: 2–32.
tool_cycle_max_period = 32

# Full A→B periods required before a tool cycle is reported. Range: 2–20.
# Deliberately independent of tool_call_threshold: an alternating pattern is
# weaker evidence than a byte-identical consecutive repeat, so lowering the
# consecutive threshold must not make cycles fire sooner. A run of the *same*
# call is never reported here — that is tool_call_threshold's job.
tool_cycle_repeat_count = 3

# Consecutive byte-identical calls of the same tool before detection. The key is
# a hash of the tool name plus the full model-supplied arguments (never the call
# id), so a repeat carries no new information. Default 3 tolerates exactly one
# identical retry: an errored tool's response carries retry guidance, so the
# immediate same-args re-request is legitimate. Range: 2–20.
tool_call_threshold = 3

# Same, for read-only and whitelisted tools. `read_file` uses this value
# directly; other whitelisted tools (job_*) get an internal ×2. Range: 2–20.
# Read-only classification covers the current retrieval tools, e.g.
# search_file_content, glob, lsp, list_directory.
read_only_tool_call_threshold = 3

# Identical short chunks, or an identical line, repeated this many times in one
# stream. Kept high on purpose: echoing a file with repetitive lines is normal,
# so lower this only deliberately. Range: 2–50.
content_repeat_threshold = 10

# Detections within a single prompt before escalating from corrective feedback
# to a hard halt. Main agent only; subagents never escalate. Range: 1–10.
strike_threshold = 3

# Long-stream content/reasoning: how many full periods after probe finds a cycle.
# Range: 2–20. Note this is separate from content_repeat_threshold, and the bar
# after a read-only tool is raised internally to 10 periods.
content_probe_repeat_threshold = 3

# Minimum discovered period length (chars). Must be > short fast-path max (30)
# so probe does not false-trigger on short repeats. Range: 31–2000. Default: 48.
# Feasibility: min_period × content_probe_repeat_threshold ≤ 8192 (probe buffer).
content_probe_min_period_chars = 48

# Models matching these patterns disable ALL loop detection for that model
# instance (stream tool/content/reasoning, LLM judge, strike/recovery/halt).
# Exact match or a single trailing *; case-insensitive. Highest-tier TOML
# replaces the whole list (`[]` clears). Main and subagent each evaluate their
# own active model independently.
# Empty by default: no model is exempt out of the box. Opt in per model, e.g.
#   loop_detection_exempt_model = ["codely-core*", "gpt-5*", "claude-*"]
loop_detection_exempt_model = []

judge_system_prompt = """
An unproductive state is characterized by one or more of the following patterns over the last 5 or more assistant turns:

Repetitive Actions: The assistant repeats the same tool calls or conversational responses a decent number of times. This includes simple loops (e.g., tool_A, tool_A, tool_A) and alternating patterns (e.g., tool_A, tool_B, tool_A, tool_B, ...).

Cognitive Loop: The assistant seems unable to determine the next logical step. It might express confusion, repeatedly ask the same questions, or generate responses that don't logically follow from the previous turns, indicating it's stuck and not advancing the task.

Crucially, differentiate between a true unproductive state and legitimate, incremental progress.
For example, a series of 'tool_A' or 'tool_B' tool calls that make small, distinct changes to the same file (like adding docstrings to functions one by one) is considered forward progress and is NOT a loop. A loop would be repeatedly replacing the same text with the same content, or cycling between a small set of files with no net change.
Batch edits across files, different regions of the same file, re-testing after edits, and searches with different parameters are NOT loops.

{{ignored_tools_section}}
"""

# No loop-evidence rules ship by default: every tool counts as evidence.
#
# `loop_detection_rule` is the ONLY place these exemptions can come from — there
# are no hard-coded builtin rules. Exempting a tool is heavier than it looks: it
# hides the tool from the consecutive AND cycle detectors, and once ignored tools
# make up half of recent history the LLM judge is skipped entirely. Prefer
# raising a threshold over adding an exemption.
#
# To exempt a tool family, add it in a user/system policy file:
#
# [[loop_detection_rule]]
# name = "ignore my diagnostic tools"
# toolName = ["my_diag_*", "my_probe"]
# action = "ignore_as_evidence"
# priority = 500
