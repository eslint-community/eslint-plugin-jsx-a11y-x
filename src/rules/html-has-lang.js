/**
 * @file Enforce html element has lang prop.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { getProp, getPropValue } = jsxAstUtils;

const errorMessage = '<html> elements must have the lang prop.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/html-has-lang.md',
      description: 'Enforce `<html>` element has `lang` prop.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const type = elementType(node);

        if (type && type !== 'html') {
          return;
        }

        const lang = getPropValue(getProp(node.attributes, 'lang'));

        if (lang) {
          return;
        }

        context.report({
          node,
          message: errorMessage,
        });
      },
    };
  },
};
