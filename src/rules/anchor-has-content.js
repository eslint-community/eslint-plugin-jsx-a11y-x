/**
 * @file Enforce anchor elements to contain accessible content.
 * @author Lisa Ring & Niklas Holmberg
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';

import getElementType from '../util/getElementType.js';
import hasAccessibleChild from '../util/hasAccessibleChild.js';

const { hasAnyProp } = jsxAstUtils;

const errorMessage =
  'Anchors must have content and the content must be accessible by a screen reader.';

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
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/anchor-has-content.md',
      description: 'Enforce all anchors to contain accessible content.',
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
        const typeCheck = ['a'].concat(componentOptions);
        const nodeType = elementType(node);

        // Only check anchor elements and custom types.
        if (typeCheck.indexOf(nodeType) === -1) {
          return;
        }
        if (hasAccessibleChild(node.parent, elementType)) {
          return;
        }
        if (hasAnyProp(node.attributes, ['title', 'aria-label'])) {
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
