/**
 * @file Enforce static elements have no interactive handlers.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isAbstractRole from '../util/isAbstractRole.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';
import isNonInteractiveElement from '../util/isNonInteractiveElement.js';
import isNonInteractiveRole from '../util/isNonInteractiveRole.js';
import isNonLiteralProperty from '../util/isNonLiteralProperty.js';
import isPresentationRole from '../util/isPresentationRole.js';

const { eventHandlersByType, getPropValue, getProp, hasProp } = jsxAstUtils;

const errorMessage =
  'Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.';

const defaultInteractiveProps = [
  ...eventHandlersByType.focus,
  ...eventHandlersByType.keyboard,
  ...eventHandlersByType.mouse,
];
const schema = {
  type: 'object',
  properties: {
    handlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
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
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-static-element-interactions.md',
      description:
        'Enforce that non-interactive, visible elements (such as `<div>`) that have click handlers use the role attribute.',
    },
    schema: [schema],
    defaultOptions: [{ handlers: defaultInteractiveProps }],
  },

  create: (context) => {
    const { options } = context;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const { attributes } = node;
        const type = elementType(node);

        const { allowExpressionValues, handlers } = options[0];

        const hasInteractiveProps = handlers.some(
          (prop) =>
            hasProp(attributes, prop) &&
            getPropValue(getProp(attributes, prop)) != null,
        );

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        if (
          !hasInteractiveProps ||
          isHiddenFromScreenReader(type, attributes) ||
          isPresentationRole(type, attributes)
        ) {
          // Presentation is an intentional signal from the author that this
          // element is not meant to be perceivable. For example, a click screen
          // to close a dialog .
          return;
        }
        if (
          isInteractiveElement(type, attributes) ||
          isInteractiveRole(type, attributes) ||
          isNonInteractiveElement(type, attributes) ||
          isNonInteractiveRole(type, attributes) ||
          isAbstractRole(type, attributes)
        ) {
          // This rule has no opinion about abstract roles.
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

        // Visible, non-interactive elements should not have an interactive handler.
        context.report({
          node,
          message: errorMessage,
        });
      },
    };
  },
};
