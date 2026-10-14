/**
 * @file Enforce that elements with ARIA roles must have all required attributes
 *   for that role.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom, roles } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isSemanticRoleElement from '../util/isSemanticRoleElement.js';

const { getProp, getLiteralPropValue, propName } = jsxAstUtils;

const errorMessage = (role, requiredProps) =>
  `Elements with the ARIA role "${role}" must have the following attributes defined: ${String(requiredProps).toLowerCase()}`;

const roleKeys = roles.keys();

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/role-has-required-aria-props.md',
      description:
        'Enforce that elements with ARIA roles must have all required attributes for that role.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXAttribute: (attribute) => {
        const name = propName(attribute).toLowerCase();

        if (name !== 'role') {
          return;
        }

        const type = elementType(attribute.parent);
        if (!dom.get(type)) {
          return;
        }

        const roleAttrValue = getLiteralPropValue(attribute);
        const { attributes } = attribute.parent;

        // If value is undefined, then the role attribute will be dropped in the DOM.
        // If value is null, then getLiteralAttributeValue is telling us
        // that the value isn't in the form of a literal.
        if (roleAttrValue === undefined || roleAttrValue === null) {
          return;
        }

        const normalizedValues = String(roleAttrValue).toLowerCase().split(' ');
        const validRoles = normalizedValues.filter(
          (val) => roleKeys.indexOf(val) > -1,
        );

        // Check semantic DOM elements
        // For example, <input type="checkbox" role="switch" />
        if (isSemanticRoleElement(type, attributes)) {
          return;
        }
        // Check arbitrary DOM elements
        validRoles.forEach((role) => {
          const { requiredProps: requiredPropKeyValues } = roles.get(role);
          const requiredProps = Object.keys(requiredPropKeyValues);

          if (requiredProps.length > 0) {
            const hasRequiredProps = requiredProps.every((prop) =>
              getProp(attributes, prop),
            );
            if (hasRequiredProps === false) {
              context.report({
                node: attribute,
                message: errorMessage(role.toLowerCase(), requiredProps),
              });
            }
          }
        });
      },
    };
  },
};
