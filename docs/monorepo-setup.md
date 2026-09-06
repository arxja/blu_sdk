# Monorepo & Development Setup

## Tooling Stack

- **Package Manager:** `pnpm` (Workspace support & strict symlinking)
- **Task Orchestrator:** `turborepo` (Incremental builds & task pipeline execution)
- **Bundler:** `tsup` (esbuild-powered output for ESM, CJS, and IIFE)
- **Linter & Formatter:** `biome` (Fast Rust-based formatting and linting)
- **Testing:** `bun test` (Zero-config TypeScript execution runner)

## Local Setup

```bash
# Clone and install dependencies
pnpm install

# Build all packages in topological order
pnpm run build

# Run formatting & linter checks
pnpm run lint

# Execute unit tests
bun test
```

## Turbo Pipeline Tasks

Configured in `turbo.json`:

- `pnpm run build`: Executes `tsup` across all `packages/*`. Core builds prior to dependent packages.
- `pnpm run type-check`: Runs `tsc --noEmit` across all workspace projects.
