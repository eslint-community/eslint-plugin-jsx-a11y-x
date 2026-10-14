/**
 * @file Enforce a clickable non-interactive element has at least 1 keyboard
 *   event listener.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isPresentationRole from '../util/isPresentationRole.js';

const { getProp, hasAnyProp } = jsxAstUtils;

const errorMessage =
  'Visible, non-interactive elements with click handlers must have at least one keyboard listener.';

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/click-events-have-key-events.md',
      description:
        'Enforce a clickable non-interactive element has at least one keyboard event listener.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const props = node.attributes;
        if (getProp(props, 'onclick') === undefined) {
          return;
        }

        const type = elementType(node);
        const requiredProps = ['onkeydown', 'onkeyup', 'onkeypress'];

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        if (
          isHiddenFromScreenReader(type, props) ||
          isPresentationRole(type, props)
        ) {
          return;
        }
        if (isInteractiveElement(type, props)) {
          return;
        }
        if (hasAnyProp(props, requiredProps)) {
          return;
        }

        // Visible, non-interactive elements with click handlers require one keyboard event listener.
        context.report({
          node,
          message: errorMessage,
        });
      },
    };
  },
};
