/**
 * @file Enforce aria-hidden is not used on interactive elements or contain
 *   interactive elements.
 * @author Kate Higa
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isFocusable from '../util/isFocusable.js';

const { getProp, getPropValue } = jsxAstUtils;

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-aria-hidden-on-focusable.md',
      description:
        'Disallow `aria-hidden="true"` from being set on focusable elements.',
    },
    schema: [],
  },

  create(context) {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement(node) {
        const { attributes } = node;
        const type = elementType(node);
        const isAriaHidden =
          getPropValue(getProp(attributes, 'aria-hidden')) === true;

        if (isAriaHidden && isFocusable(type, attributes)) {
          context.report({
            node,
            message:
              'aria-hidden="true" must not be set on focusable elements.',
          });
        }
      },
    };
  },
};
