---
name: tdd
description: Red-Green-Refactor TDD workflow. Use when implementing features test-first, fixing bugs with regression tests, or when the user asks for TDD.
allowed-tools: Read Write Edit Bash Grep Glob Agent
disable-model-invocation: false
user-invocable: true
argument-hint: "<feature or bug description>"
---

# Red-Green-Refactor TDD Skill

Implement features and fix bugs using strict Red-Green-Refactor TDD discipline.

## Project Context

- **Test runner**: `npx vitest run` (unit/integration), `npx playwright test` (E2E)
- **Test location**: Co-located as `src/**/*.test.{ts,tsx}`
- **Stack**: Next.js, React, TypeScript, Vitest, Playwright, Zustand, Zod, Dexie

## Workflow

Repeat the following cycle for each requirement. Never skip a phase.

### Phase 1 — RED: Write a Failing Test

1. Identify the **smallest** next behaviour to implement.
2. Write **one** test (or a small focused group) that asserts the expected behaviour.
   - Place it in the appropriate `*.test.ts(x)` file next to the source.
   - Use descriptive `it("should …")` names.
3. Run the tests:
   ```bash
   npx vitest run --reporter=verbose <path-to-test-file>
   ```
4. **Verify the new test FAILS.** If it passes, the test is not adding value — revisit.
5. Commit:
   ```
   test: add failing test for <what>
   ```

### Phase 2 — GREEN: Make It Pass with Minimal Code

1. Write the **simplest** production code that makes the failing test pass.
   - No extra abstractions, no optimisation, no handling of cases not yet tested.
2. Run the **full** test suite to check for regressions:
   ```bash
   npx vitest run
   ```
3. If any test fails, fix immediately before moving on.
4. Commit:
   ```
   feat: implement <what>
   ```
   (Use `fix:` for bug fixes.)

### Phase 3 — REFACTOR: Improve Without Changing Behaviour

1. Look for duplication, unclear names, long functions, or missing type safety.
2. Refactor production code **and** test code.
3. Run the full test suite again — all tests must still pass.
4. If nothing needs refactoring, skip this commit.
5. Commit:
   ```
   refactor: <what was improved>
   ```

### Then Loop

Go back to Phase 1 for the next behaviour. Continue until $ARGUMENTS is fully implemented.

## Rules

- **One test at a time.** Do not write multiple failing tests before making any pass.
- **Tests are the spec.** If a behaviour has no test, it does not exist.
- **No production code without a failing test.** Every line of implementation is motivated by a red test.
- **Keep commits small and atomic.** Each commit should be safe to revert independently.
- **Run tests after every change.** Never assume they pass.
- **Show test output.** Always display the test runner output so the user sees red → green transitions.

## Bug Fix Variant

When fixing a bug with TDD:

1. **RED**: Write a test that reproduces the bug (it should fail, proving the bug exists).
2. **GREEN**: Fix the bug with minimal code (test passes).
3. **REFACTOR**: Clean up if needed.

This guarantees the bug cannot silently regress.

## Output Format

After each phase, briefly report:
- Which phase just completed (RED / GREEN / REFACTOR)
- The test(s) involved and their pass/fail status
- What was changed and why
