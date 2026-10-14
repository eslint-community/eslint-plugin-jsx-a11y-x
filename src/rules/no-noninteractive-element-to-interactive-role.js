/**
 * @file Disallow inherently non-interactive elements to be assigned interactive
 *   roles.
 * @author Jesse Beach
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import getExplicitRole from '../util/getExplicitRole.js';
import isNonInteractiveElement from '../util/isNonInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';

const { propName } = jsxAstUtils;

const errorMessage =
  'Non-interactive elements should not be assigned interactive roles.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-noninteractive-element-to-interactive-role.md',
      description:
        'Disallow non-interactive elements being assigned interactive roles.',
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
          'An object mapping element types to arrays of interactive roles that are allowed for those elements.',
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
        const role = getExplicitRole(type, node.attributes);

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
          isNonInteractiveElement(type, attributes) &&
          isInteractiveRole(type, attributes)
        ) {
          context.report({
            node: attribute,
            message: errorMessage,
          });
        }
      },
    };
  },
};
