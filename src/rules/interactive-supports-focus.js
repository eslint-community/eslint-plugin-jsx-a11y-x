/**
 * @file Enforce that elements with onClick handlers must be tabbable.
 * @author Ethan Cohen
 */

import { dom, roles } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isDisabledElement from '../util/isDisabledElement.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';
import isNonInteractiveElement from '../util/isNonInteractiveElement.js';
import isNonInteractiveRole from '../util/isNonInteractiveRole.js';
import isPresentationRole from '../util/isPresentationRole.js';
import getTabIndex from '../util/getTabIndex.js';

const { getProp, eventHandlersByType, getLiteralPropValue, hasAnyProp } =
  jsxAstUtils;

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

const schema = {
  type: 'object',
  properties: {
    tabbable: {
      type: 'array',
      items: {
        type: 'string',
        enum: roles
          .keys()
          .filter(
            (name) =>
              !roles.get(name).abstract &&
              roles
                .get(name)
                .superClass.some((klasses) => klasses.includes('widget')),
          ),
      },
      uniqueItems: true,
      additionalItems: false,
      minItems: 0,
    },
  },
  additionalProperties: false,
};

const interactiveProps = [
  ...eventHandlersByType.mouse,
  ...eventHandlersByType.keyboard,
];

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/interactive-supports-focus.md',
      description:
        'Enforce that elements with interactive handlers like `onClick` must be focusable.',
    },
    hasSuggestions: true,
    messages: {
      'tabIndex=0':
        'Add `tabIndex={0}` to make the element focusable in sequential keyboard navigation.',
      'tabIndex=-1':
        'Add `tabIndex={-1}` to make the element focusable but not reachable via sequential keyboard navigation.',
    },
    schema: [schema],
    defaultOptions: [{ tabbable: [] }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const { tabbable } = context.options[0];
        const { attributes } = node;
        const type = elementType(node);
        const hasInteractiveProps = hasAnyProp(attributes, interactiveProps);
        const hasTabindex =
          getTabIndex(getProp(attributes, 'tabIndex')) !== undefined;

        if (!dom.has(type)) {
          // Do not test higher level JSX components, as we do not know what
          // low-level DOM element this maps to.
          return;
        }
        if (
          !hasInteractiveProps ||
          isDisabledElement(attributes) ||
          isHiddenFromScreenReader(type, attributes) ||
          isPresentationRole(type, attributes)
        ) {
          // Presentation is an intentional signal from the author that this
          // element is not meant to be perceivable. For example, a click screen
          // to close a dialog .
          return;
        }

        if (
          hasInteractiveProps &&
          isInteractiveRole(type, attributes) &&
          !isInteractiveElement(type, attributes) &&
          !isNonInteractiveElement(type, attributes) &&
          !isNonInteractiveRole(type, attributes) &&
          !hasTabindex
        ) {
          const role = getLiteralPropValue(getProp(attributes, 'role'));
          if (tabbable.includes(role)) {
            // Always tabbable, tabIndex = 0
            context.report({
              node,
              message: `Elements with the '${role}' interactive role must be tabbable.`,
              suggest: [
                {
                  messageId: 'tabIndex=0',
                  fix(fixer) {
                    return fixer.insertTextAfter(node.name, ' tabIndex={0}');
                  },
                },
              ],
            });
          } else {
            // Focusable, tabIndex = -1 or 0
            context.report({
              node,
              message: `Elements with the '${role}' interactive role must be focusable.`,
              suggest: [
                {
                  messageId: 'tabIndex=0',
                  fix(fixer) {
                    return fixer.insertTextAfter(node.name, ' tabIndex={0}');
                  },
                },
                {
                  messageId: 'tabIndex=-1',
                  fix(fixer) {
                    return fixer.insertTextAfter(node.name, ' tabIndex={-1}');
                  },
                },
              ],
            });
          }
        }
      },
    };
  },
};
