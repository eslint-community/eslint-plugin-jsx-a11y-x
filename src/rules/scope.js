/**
 * @file Enforce scope prop is only used on <th> elements.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { propName } = jsxAstUtils;

const errorMessage = 'The scope prop can only be used on <th> elements.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/scope.md',
      description: 'Enforce `scope` prop is only used on `<th>` elements.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXAttribute: (node) => {
        const name = propName(node);
        if (name && name.toUpperCase() !== 'SCOPE') {
          return;
        }

        const { parent } = node;
        const tagName = elementType(parent);

        // Do not test higher level JSX components, as we do not know what
        // low-level DOM element this maps to.
        if (!dom.has(tagName)) {
          return;
        }
        if (tagName && tagName.toUpperCase() === 'TH') {
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
