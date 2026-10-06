# Changelog

## 0.2.1

### Patch Changes

- [#106](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/pull/106) [`589b813`](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/commit/589b81350a2e8456ab9767e249cb13b9c612a86d) Thanks [@karlhorky](https://github.com/karlhorky)! - Fix default export types missing `meta` and `rules`.

- [#105](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/pull/105) [`b3d9766`](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/commit/b3d97668e1e422ef9fdf665fdfbf484fbf616ccb) Thanks [@yungando](https://github.com/yungando)! - Remove deprecated rule `label-has-for` from provided configs and docs.

- [#95](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/pull/95) [`308fad6`](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/commit/308fad6bc2c13223b8ebc3527398fdb88addf18f) Thanks [@jdufresne](https://github.com/jdufresne)! - Convert several files to TypeScript.

- [#107](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/pull/107) [`8458b55`](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/commit/8458b558003837989cb44e3d0f30efe9ae56deb7) Thanks [@AdamMagued](https://github.com/AdamMagued)! - Remove documentation for removed rules `accessible-emoji` and `no-onchange`.

## 0.2.0

### Minor Changes

- [#89](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/89) [`7c7a6ec`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/7c7a6ecf947be0ab2bd1fbcc571d748beb4ec058) Thanks [@43081j](https://github.com/43081j)! - Remove support for legacy eslintrc configs.

- [#56](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/56) [`779f695`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/779f6950d93b0aca0561aab0a2fc80fadfa420d2) Thanks [@jdufresne](https://github.com/jdufresne)! - Add `defaultOptions` to all rules that take options.

- [#48](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/48) [`8d99dab`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/8d99dab5f825ff4e855ecf176d3249e39534335f) Thanks [@jdufresne](https://github.com/jdufresne)! - Remove deprecated rules accessible-emoji, label-has-for, and no-onchange.

- [#75](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/75) [`336cbab`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/336cbab132df78cfaefaf42cd7d1eb44296aa891) Thanks [@jdufresne](https://github.com/jdufresne)! - Remove support for eslint 8.

- [#79](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/79) [`6dc9889`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/6dc98890921df4ff7a00bd4627798623b731138f) Thanks [@jdufresne](https://github.com/jdufresne)! - Add support for ESLint 10.

- [#43](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/43) [`d7fc23c`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/d7fc23cdd14cc819c0a902aab70e8a33c15a6920) Thanks [@jdufresne](https://github.com/jdufresne)! - Remove support for Flow.

- [#71](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/71) [`3d2ee2d`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/3d2ee2da7fe64002042e77fc9b6e5f3494663606) Thanks [@43081j](https://github.com/43081j)! - Move to ES modules only (dropping all CommonJS). CommonJS users can still `require` the package since Node 20.x (LTS).

- [#76](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/76) [`710cec4`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/710cec4ccfc1a914da531ad5c425bf0a549cf085) Thanks [@jdufresne](https://github.com/jdufresne)! - Update minimatch dependency to 10.2.5.

- [#73](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/73) [`9531d52`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/9531d5295c7f0dc0ddd933e18a50aafab89f766e) Thanks [@jdufresne](https://github.com/jdufresne)! - Remove support for Node.js 18. Now requires Node.js 20+.

- [#87](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/87) [`26507a3`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/26507a39ccf1d726ed9fb64712d5ec3f537093ec) Thanks [@jdufresne](https://github.com/jdufresne)! - Add `TypeScript` support and initial declarations.

## 0.1.1

### Patch Changes

- [#23](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/23) [`9d6abbf`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/9d6abbf8dd74aa2c2af310e838dbe833555aaef7) Thanks [@JounQin](https://github.com/JounQin)! - chore: cleanup dependencies with built-in replacements

- [#22](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/22) [`7079630`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/70796302379b4d37d6d4031d000c74055066b8a2) Thanks [@JounQin](https://github.com/JounQin)! - chore: migrate `jsx-ast-utils` to `jsx-ast-utils-x`

- [#17](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/17) [`fc498c5`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/fc498c53e18bcd92d103af744ca842b296bf9aad) Thanks [@43081j](https://github.com/43081j)! - Removes `array-includes` and uses the built-in `Array.prototype.includes` method instead.

- [#19](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/19) [`e911b81`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/e911b8199a7410a5a7ca7d1201458232de02dbd8) Thanks [@43081j](https://github.com/43081j)! - Removes `hasOwn` polyfill and uses native functionality instead.

- [#18](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/18) [`2627d60`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/2627d605a5140292eed5be7c4025e2945d360549) Thanks [@43081j](https://github.com/43081j)! - Removes `flatMap` polyfill and uses native functionality instead.

## 0.1.0

### Minor Changes

- [#13](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/pull/13) [`b167ac4`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/commit/b167ac4d6fd5f5349363ee652e62c003ade55edb) Thanks [@JounQin](https://github.com/JounQin)! - chore: start migration, yarn v4, changesets, workflows

## Legacy `jsx-ast-utils`'s Changelog

[CHANGELOG_LEGACY](CHANGELOG_LEGACY)
