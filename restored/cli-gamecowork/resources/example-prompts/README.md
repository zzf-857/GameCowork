# Example Prompts

This directory contains example prompts that can be used with the CLI. These prompts are bundled with the CLI package for easy access.

## Available Example Prompts

- `git-commit` - Review Git staged changes, generate commit message and commit
- `analyze` - Analyze an open/complex topic across a very large codebase
- `explain-code` - Analyze and explain code functionality in detail

## Using Example Prompts

### In Non-Interactive Mode

You can use these example prompts directly in non-interactive mode with the `--example-prompt` flag:

```bash
# Run the git-commit example
gamecowork --yolo --example-prompt git-commit

# List all available example prompts
gamecowork --list-example-prompts
```

### In Interactive Mode

In interactive mode, you can use the `/example-prompt` slash command:

```bash
# Start interactive mode
gamecowork

# Then use the command:
/example-prompt git-commit

# Or for the explain-code prompt:
/example-prompt explain-code

# Or list available prompts:
/example-prompt
```

## Features

This functionality allows you to:

- Execute pre-defined prompts without needing to type them out
- Create reusable prompt templates for common tasks
- Share standardized prompts across your team
- List all available prompts to see what's available

## Notes

- The `--example-prompt` flag cannot be used together with `--prompt` or `--prompt-interactive`
- Example prompts must be TOML files with at least a `prompt` field
- The `description` field is optional but recommended for better documentation
