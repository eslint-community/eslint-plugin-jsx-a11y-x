/**
 * @file Enforce distracting elements are not used.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import getElementType from '../util/getElementType.js';

const errorMessage = (element) =>
  `Do not use <${element}> elements as they can create visual accessibility issues and are deprecated.`;

const DEFAULT_ELEMENTS = ['marquee', 'blink'];

const schema = {
  type: 'object',
  properties: {
    elements: {
      type: 'array',
      items: { type: 'string', enum: DEFAULT_ELEMENTS },
      uniqueItems: true,
      additionalItems: false,
      minItems: 0,
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-distracting-elements.md',
      description: 'Enforce distracting elements are not used.',
    },
    schema: [schema],
    defaultOptions: [{ elements: DEFAULT_ELEMENTS }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const options = context.options[0];
        const elementOptions = options.elements;
        const type = elementType(node);
        const distractingElement = elementOptions.find(
          (element) => type === element,
        );

        if (distractingElement) {
          context.report({
            node,
            message: errorMessage(distractingElement),
          });
        }
      },
    };
  },
};
