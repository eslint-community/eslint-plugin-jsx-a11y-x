/**
 * @file Enforce heading (h1, h2, etc) elements contain accessible content.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import getElementType from '../util/getElementType.js';
import hasAccessibleChild from '../util/hasAccessibleChild.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';

const errorMessage =
  'Headings must have content and the content must be accessible by a screen reader.';

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/heading-has-content.md',
      description:
        'Enforce heading (`h1`, `h2`, etc) elements contain accessible content.',
    },
    schema: [schema],
    defaultOptions: [{ components: [] }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const options = context.options[0];
        const componentOptions = options.components;
        const typeCheck = headings.concat(componentOptions);
        const nodeType = elementType(node);

        // Only check 'h*' elements and custom types.
        if (typeCheck.indexOf(nodeType) === -1) {
          return;
        }
        if (hasAccessibleChild(node.parent, elementType)) {
          return;
        }
        if (isHiddenFromScreenReader(nodeType, node.attributes)) {
          return;
        }

        context.report({
          node,
          message: errorMessage,
        });
      },
    };
  },
};
