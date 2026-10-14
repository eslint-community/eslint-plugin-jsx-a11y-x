/**
 * @file Enforce onmouseover/onmouseout are accompanied by onfocus/onblur.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';

const { getProp, getPropValue } = jsxAstUtils;

const schema = {
  type: 'object',
  properties: {
    hoverInHandlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description:
        'An array of events that need to be accompanied by `onFocus`',
    },
    hoverOutHandlers: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
      description: 'An array of events that need to be accompanied by `onBlur`',
    },
  },
  additionalProperties: false,
};

// Use `onMouseOver` and `onMouseOut` by default if no config is
// passed in for backwards compatibility
const DEFAULT_HOVER_IN_HANDLERS = ['onMouseOver'];
const DEFAULT_HOVER_OUT_HANDLERS = ['onMouseOut'];

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/mouse-events-have-key-events.md',
      description:
        'Enforce that `onMouseOver`/`onMouseOut` are accompanied by `onFocus`/`onBlur` for keyboard-only users.',
    },
    schema: [schema],
    defaultOptions: [
      {
        hoverInHandlers: DEFAULT_HOVER_IN_HANDLERS,
        hoverOutHandlers: DEFAULT_HOVER_OUT_HANDLERS,
      },
    ],
  },

  create: (context) => ({
    JSXOpeningElement: (node) => {
      const { name } = node.name;

      if (!dom.get(name)) {
        return;
      }

      const { options } = context;
      const { hoverInHandlers, hoverOutHandlers } = options[0];
      const { attributes } = node;

      // Check hover in / onfocus pairing
      const firstHoverInHandlerWithValue = hoverInHandlers.find((handler) => {
        const prop = getProp(attributes, handler);
        const propValue = getPropValue(prop);
        return propValue != null;
      });

      if (firstHoverInHandlerWithValue != null) {
        const hasOnFocus = getProp(attributes, 'onFocus');
        const onFocusValue = getPropValue(hasOnFocus);

        if (
          hasOnFocus === false ||
          onFocusValue === null ||
          onFocusValue === undefined
        ) {
          context.report({
            node: getProp(attributes, firstHoverInHandlerWithValue),
            message: `${firstHoverInHandlerWithValue} must be accompanied by onFocus for accessibility.`,
          });
        }
      }

      // Check hover out / onblur pairing
      const firstHoverOutHandlerWithValue = hoverOutHandlers.find((handler) => {
        const prop = getProp(attributes, handler);
        const propValue = getPropValue(prop);
        return propValue != null;
      });

      if (firstHoverOutHandlerWithValue != null) {
        const hasOnBlur = getProp(attributes, 'onBlur');
        const onBlurValue = getPropValue(hasOnBlur);

        if (
          hasOnBlur === false ||
          onBlurValue === null ||
          onBlurValue === undefined
        ) {
          context.report({
            node: getProp(attributes, firstHoverOutHandlerWithValue),
            message: `${firstHoverOutHandlerWithValue} must be accompanied by onBlur for accessibility.`,
          });
        }
      }
    },
  }),
};
