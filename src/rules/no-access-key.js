/**
 * @file Enforce no accesskey attribute on element.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';

const { getProp, getPropValue } = jsxAstUtils;

const errorMessage =
  'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screen readers and keyboard-only users create a11y complications.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-access-key.md',
      description:
        'Enforce that the `accessKey` prop is not used on any element to avoid complications with keyboard commands used by a screen reader.',
    },
    schema: [],
  },

  create: (context) => ({
    JSXOpeningElement: (node) => {
      const accessKey = getProp(node.attributes, 'accesskey');
      const accessKeyValue = getPropValue(accessKey);

      if (accessKey && accessKeyValue) {
        context.report({
          node,
          message: errorMessage,
        });
      }
    },
  }),
};
