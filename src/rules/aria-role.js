/**
 * @file Enforce aria role attribute is valid.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom, roles } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';

import getElementType from '../util/getElementType.js';

const { getLiteralPropValue, propName } = jsxAstUtils;

const errorMessage =
  'Elements with ARIA roles must use a valid, non-abstract ARIA role.';

const schema = {
  type: 'object',
  properties: {
    allowedInvalidRoles: {
      items: {
        type: 'string',
      },
      type: 'array',
      uniqueItems: true,
    },
    ignoreNonDOM: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
};

const validRoles = new Set(
  roles.keys().filter((role) => roles.get(role).abstract === false),
);

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/aria-role.md',
      description:
        'Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.',
    },
    schema: [schema],
    defaultOptions: [{ allowedInvalidRoles: [], ignoreNonDOM: false }],
  },

  create: (context) => {
    const options = context.options[0];
    const ignoreNonDOM = options.ignoreNonDOM;
    const allowedInvalidRoles = new Set(options.allowedInvalidRoles);
    const elementType = getElementType(context);

    return {
      JSXAttribute: (attribute) => {
        // If ignoreNonDOM and the parent isn't DOM, don't run rule.
        if (ignoreNonDOM) {
          const type = elementType(attribute.parent);
          if (!dom.get(type)) {
            return;
          }
        }

        // Get prop name
        const name = propName(attribute).toUpperCase();

        if (name !== 'ROLE') {
          return;
        }

        const value = getLiteralPropValue(attribute);

        // If value is undefined, then the role attribute will be dropped in the DOM.
        // If value is null, then getLiteralAttributeValue is telling us that the
        // value isn't in the form of a literal.
        if (value === undefined || value === null) {
          return;
        }

        const values = String(value).split(' ');
        const isValid = values.every(
          (val) => allowedInvalidRoles.has(val) || validRoles.has(val),
        );

        if (isValid === true) {
          return;
        }

        context.report({
          node: attribute,
          message: errorMessage,
        });
      },
    };
  },
};
