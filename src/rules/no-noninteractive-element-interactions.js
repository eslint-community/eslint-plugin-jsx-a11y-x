/**
 * @file Enforce non-interactive elements have no interactive handlers.
 * @author Jese Beach
 */
// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isAbstractRole from '../util/isAbstractRole.js';
import isContentEditable from '../util/isContentEditable.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';
import isNonInteractiveElement from '../util/isNonInteractiveElement.js';
import isNonInteractiveRole from '../util/isNonInteractiveRole.js';
import isPresentationRole from '../util/isPresentationRole.js';

const { eventHandlersByType, getPropValue, getProp, hasProp, propName } =
  jsxAstUtils;

const errorMessage =
  'Non-interactive elements should not be assigned mouse or keyboard event listeners.';

const defaultInteractiveProps = [
  ...eventHandlersByType.focus,
  ...eventHandlersByType.image,
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
  },
  additionalProperties: {
    type: 'array',
    items: { type: 'string' },
    uniqueItems: true,
  },
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-noninteractive-element-interactions.md',
      description:
        'Disallow non-interactive elements being assigned mouse or keyboard event listeners.',
    },
    schema: [schema],
    defaultOptions: [{ handlers: defaultInteractiveProps }],
  },

  create: (context) => {
    const { options } = context;
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        let { attributes } = node;
        const type = elementType(node);
        const config = options[0];
        const interactiveProps = config.handlers || defaultInteractiveProps;
        // Allow overrides from rule configuration for specific elements and roles.
        if (Object.hasOwn(config, type)) {
          attributes = attributes.filter(
            (attr) =>
              attr.type !== 'JSXSpreadAttribute' &&
              !config[type].includes(propName(attr)),
          );
        }

        const hasInteractiveProps = interactiveProps.some(
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
          isContentEditable(type, attributes) ||
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
          (!isNonInteractiveElement(type, attributes) &&
            !isNonInteractiveRole(type, attributes)) ||
          isAbstractRole(type, attributes)
        ) {
          // This rule has no opinion about abtract roles.
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
