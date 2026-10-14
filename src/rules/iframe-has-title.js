/**
 * @file Enforce iframe elements have a title attribute.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { getProp, getPropValue } = jsxAstUtils;

const errorMessage = '<iframe> elements must have a unique title property.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/iframe-has-title.md',
      description: 'Enforce iframe elements have a title attribute.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const type = elementType(node);

        if (type && type !== 'iframe') {
          return;
        }

        const title = getPropValue(getProp(node.attributes, 'title'));

        if (title && typeof title === 'string') {
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
