import { createRequire } from 'node:module';
import { resolve } from 'node:path';

let require = createRequire(import.meta.url), playwright;
try { playwright = require('playwright'); }
catch {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw Error('Browser QA needs Playwright. Install playwright@1.62.1 and its Chromium browser, or provide the existing QA runtime.');
  require = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '../package.json')); playwright = require('playwright');
}
export const chromium = playwright.chromium;
