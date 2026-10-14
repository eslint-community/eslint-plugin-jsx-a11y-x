/**
 * @file Disallow inherently interactive elements to be assigned non-interactive
 *   roles.
 * @author Jesse Beach
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isNonInteractiveRole from '../util/isNonInteractiveRole.js';
import isPresentationRole from '../util/isPresentationRole.js';

const { getProp, getLiteralPropValue, propName } = jsxAstUtils;

const errorMessage =
  'Interactive elements should not be assigned non-interactive roles.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-interactive-element-to-noninteractive-role.md',
      description:
        'Disallow interactive elements being assigned non-interactive roles.',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
        },
        description:
          'An object mapping element types to arrays of non-interactive roles that are allowed for those elements.',
      },
    ],
    defaultOptions: [{}],
  },

  create: (context) => {
    const { options } = context;
    const elementType = getElementType(context);
    return {
      JSXAttribute: (attribute) => {
        const attributeName = propName(attribute);
        if (attributeName !== 'role') {
          return;
        }
        const node = attribute.parent;
        const { attributes } = node;
        const type = elementType(node);
        const role = getLiteralPropValue(getProp(node.attributes, 'role'));

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        // Allow overrides from rule configuration for specific elements and
        // roles.
        const allowedRoles = options[0];
        if (
          Object.hasOwn(allowedRoles, type) &&
          allowedRoles[type].includes(role)
        ) {
          return;
        }
        if (
          isInteractiveElement(type, attributes) &&
          (isNonInteractiveRole(type, attributes) ||
            isPresentationRole(type, attributes))
        ) {
          // Visible, non-interactive elements should not have an interactive handler.
          context.report({
            node: attribute,
            message: errorMessage,
          });
        }
      },
    };
  },
};
