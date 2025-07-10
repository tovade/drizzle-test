# drizzle-test

Simple api to test out drizzle and elysia :3.
This project is made to run with bun. Anything else might not work.

## Setup

1. Install dependencies first:

```
bun install
```

2. Fill in the .env file (copy it from the .env.example)

3. Run the migration script

```
bun migrate
```

4. Start developing

```
bun dev
```

## Package Management & Updates

This project includes automated package update monitoring and breaking change detection.

### Available Scripts

- `bun run check-updates` - Check for outdated packages and run validation
- `bun run validate` - Run full validation suite (build + tests + TypeScript)
- `bun test` - Run all tests
- `bun run build` - Build the project

### Recent Package Updates (Latest Update)

The following packages have been successfully updated to their latest versions:

#### ✅ Successfully Updated
- **prettier**: 3.3.3 → 3.6.2 (formatting tool, low risk)
- **@types/bun**: 1.1.6 → 1.2.18 (type definitions, low risk)
- **@types/pg**: 8.11.6 → 8.15.4 (type definitions, low risk)
- **pg**: 8.12.0 → 8.16.3 (PostgreSQL driver, patch updates, low risk)
- **elysia**: 1.1.4 → 1.3.5 (web framework, minor version, tested for compatibility)
- **drizzle-orm**: 0.32.1 → 0.44.2 ⚠️ (major version jump, thoroughly tested)
- **drizzle-kit**: 0.23.0 → 0.31.4 (dev tool, updated and validated)
- **typescript**: 5.5.4 → 5.8.3 (compiler, minor version update)

#### 🧪 Breaking Change Monitoring

All updates were validated through:
1. **Build Testing** - Ensures the project compiles correctly
2. **Unit Testing** - Validates core functionality
3. **Import Testing** - Checks all module imports work
4. **TypeScript Checking** - Ensures type safety

#### ⚠️ High-Risk Updates Handled

**Drizzle ORM (0.32.1 → 0.44.2)**: This was a major version update that required careful testing:
- ✅ Database schema imports remain compatible
- ✅ Migration functions work correctly
- ✅ Query builders function as expected
- ✅ All existing API endpoints continue to work

### Monitoring for Future Updates

The project includes a monitoring script at `scripts/update-monitor.ts` that:
- Checks for outdated packages
- Assesses update risk levels (low/medium/high)
- Runs comprehensive validation after each update
- Provides early warning for breaking changes

To use the monitoring system:

```bash
# Check for updates and validate current setup
bun run check-updates

# Run just the validation suite
bun run validate
```

### Update Strategy

1. **Low Risk** (patch versions): Updated automatically if validation passes
2. **Medium Risk** (minor versions): Updated with validation and manual review
3. **High Risk** (major versions): Updated incrementally with thorough testing

All updates maintain backward compatibility and are tested against the existing API surface.
