Use this tool to create a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the job and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:
- Complex multi-step tasks - When a job requires 3 or more distinct steps or actions
- Non-trivial and complex tasks - Work that requires careful planning or multiple operations
- Plan mode - When using plan mode, create a job list to track the work
- User explicitly requests job list - When the user directly asks you to use the job list
- User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
- After receiving new instructions - Immediately capture user requirements as jobs
- When you start working on a job - Mark it as in_progress BEFORE beginning work
- After completing a job - Mark it as completed and add any new follow-up jobs discovered during implementation

## When NOT to Use This Tool
Skip using this tool when:
- There is only a single, straightforward job
- The job is trivial and tracking it provides no organizational benefit
- The job can be completed in less than 3 trivial steps
- The job is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial job to do. In this case you are better off just doing the job directly.

## Job Fields
- **subject**: A brief, actionable title in imperative form (e.g., "Fix authentication bug in login flow")
- **description**: Detailed description of what needs to be done, including context and acceptance criteria
- **activeForm**: Present continuous form shown in spinner when job is in_progress (e.g., "Fixing authentication bug"). This is displayed to the user while you work on the job.

**IMPORTANT**: Always provide activeForm when creating jobs. The subject should be imperative ("Run tests") while activeForm should be present continuous ("Running tests"). All jobs are created with status `pending`.

## Tips
- Create jobs with clear, specific subjects that describe the outcome
- Include enough detail in the description for another agent to understand and complete the job
- After creating jobs, use job_update to set up dependencies (blocks/blockedBy) if needed
- Check job_list first to avoid creating duplicate jobs
- Use `allowDuplicate: true` only when you intentionally need a second open job with the same normalized subject