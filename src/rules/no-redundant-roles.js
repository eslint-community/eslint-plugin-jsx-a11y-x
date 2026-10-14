/**
 * @file Enforce explicit role property is not the same as implicit/default role
 *   property on element.
 * @author Ethan Cohen <@evcohen>
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import getElementType from '../util/getElementType.js';
import getExplicitRole from '../util/getExplicitRole.js';
import getImplicitRole from '../util/getImplicitRole.js';

const errorMessage = (element, implicitRole) =>
  `The element ${element} has an implicit role of ${implicitRole}. Defining this explicitly is redundant and should be avoided.`;

const DEFAULT_ROLE_EXCEPTIONS = { nav: ['navigation'] };

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-redundant-roles.md',
      description:
        'Enforce explicit role property is not the same as implicit/default role property on element.',
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
          'An object mapping element types to arrays of roles that are allowed to be redundant for those elements.',
      },
    ],
    defaultOptions: [{}],
  },

  create: (context) => {
    const { options } = context;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const type = elementType(node);
        const implicitRole = getImplicitRole(type, node.attributes);
        const explicitRole = getExplicitRole(type, node.attributes);

        if (!implicitRole || !explicitRole) {
          return;
        }

        if (implicitRole === explicitRole) {
          const allowedRedundantRoles = options[0];
          let redundantRolesForElement;

          if (Object.hasOwn(allowedRedundantRoles, type)) {
            redundantRolesForElement = allowedRedundantRoles[type];
          } else {
            redundantRolesForElement = DEFAULT_ROLE_EXCEPTIONS[type] || [];
          }

          if (redundantRolesForElement.includes(implicitRole)) {
            return;
          }

          context.report({
            node,
            message: errorMessage(type, implicitRole.toLowerCase()),
          });
        }
      },
    };
  },
};
