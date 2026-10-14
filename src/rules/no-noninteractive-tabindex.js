/**
 * @file Disallow tabindex on static and noninteractive elements
 * @author jessebeach
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';
import isNonLiteralProperty from '../util/isNonLiteralProperty.js';
import getTabIndex from '../util/getTabIndex.js';

const { getProp, getLiteralPropValue } = jsxAstUtils;

const errorMessage =
  '`tabIndex` should only be declared on interactive elements.';

const schema = {
  type: 'object',
  properties: {
    roles: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of ARIA roles',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of HTML tag names',
    },
    allowExpressionValues: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-noninteractive-tabindex.md',
      description:
        'Enforce `tabIndex` only be declared on interactive elements.',
    },
    schema: [schema],
    defaultOptions: [{ roles: [], tags: [] }],
  },

  create: (context) => {
    const { options } = context;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const type = elementType(node);
        const { attributes } = node;
        const tabIndexProp = getProp(attributes, 'tabIndex');
        const tabIndex = getTabIndex(tabIndexProp);
        // Early return;
        if (typeof tabIndex === 'undefined') {
          return;
        }
        const role = getLiteralPropValue(getProp(node.attributes, 'role'));

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        // Allow for configuration overrides.
        const { tags, roles, allowExpressionValues } = options[0];
        if (tags.includes(type)) {
          return;
        }
        if (roles.includes(role)) {
          return;
        }
        if (
          allowExpressionValues === true &&
          isNonLiteralProperty(attributes, 'role')
        ) {
          // Special case if role is assigned using ternary with literals on both side
          const roleProp = getProp(attributes, 'role');
          if (
            roleProp &&
            roleProp.type === 'JSXAttribute' &&
            roleProp.value.type === 'JSXExpressionContainer'
          ) {
            if (roleProp.value.expression.type === 'ConditionalExpression') {
              if (
                roleProp.value.expression.consequent.type === 'Literal' &&
                roleProp.value.expression.alternate.type === 'Literal'
              ) {
                return;
              }
            }
          }
          return;
        }
        if (
          isInteractiveElement(type, attributes) ||
          isInteractiveRole(type, attributes)
        ) {
          return;
        }
        if (tabIndex >= 0) {
          context.report({
            node: tabIndexProp,
            message: errorMessage,
          });
        }
      },
    };
  },
};
