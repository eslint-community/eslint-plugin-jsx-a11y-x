/**
 * @file Enforce that elements that do not support ARIA roles, states and
 *   properties do not have those attributes.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { aria, dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { propName } = jsxAstUtils;

const errorMessage = (invalidProp) =>
  `This element does not support ARIA roles, states and properties. \
Try removing the prop '${invalidProp}'.`;

const invalidAttributes = new Set(aria.keys().concat('role'));

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/aria-unsupported-elements.md',
      description:
        'Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const nodeType = elementType(node);
        const nodeAttrs = dom.get(nodeType) || {};
        const { reserved: isReservedNodeType = false } = nodeAttrs;

        // If it's not reserved, then it can have aria-* roles, states, and properties
        if (isReservedNodeType === false) {
          return;
        }

        node.attributes.forEach((prop) => {
          if (prop.type === 'JSXSpreadAttribute') {
            return;
          }

          const name = propName(prop).toLowerCase();

          if (invalidAttributes.has(name)) {
            context.report({
              node,
              message: errorMessage(name),
            });
          }
        });
      },
    };
  },
};
