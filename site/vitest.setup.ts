import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest.config.ts doesn't set `test.globals`, so RTL's own auto-cleanup
// (which checks for a global `afterEach`) never registers — without this,
// each test's render leaks into the next, corrupting any assertion that
// queries broadly (e.g. getAllByRole) rather than by exact unique name.
afterEach(() => {
  cleanup();
});
