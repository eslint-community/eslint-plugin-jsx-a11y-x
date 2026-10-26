import { expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import plugin from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rules = fs
  .readdirSync(path.resolve(__dirname, '../src/rules/'))
  .map((f) => path.parse(f).name);

test('all rule files should be exported by the plugin', async () => {
  for (const ruleName of rules) {
    const mod = await import(path.join('../src/rules', `${ruleName}.js`));
    expect(plugin.rules[ruleName]).toBe(mod.default);
  }
});

test('configurations', () => {
  expect(plugin.configs.recommended).not.toBe(undefined);
});

test('schemas', async () => {
  for (const ruleName of rules) {
    const mod = await import(path.join('../src/rules', `${ruleName}.js`));
    const rule = mod.default;
    const schema = rule.meta.schema[0];
    // Some rules don't have a schema.
    if (schema) {
      const { type } = schema;
      expect(type).toBe('object');
    }
  }
});

test('plugin referentially equal to prevent flat config issues', () => {
  for (const config of Object.values(plugin.configs)) {
    expect(plugin).toBe(config.plugins['jsx-a11y-x']);
  }
});
