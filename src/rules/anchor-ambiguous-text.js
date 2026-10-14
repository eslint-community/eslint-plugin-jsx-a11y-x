/**
 * @file Enforce anchor text to not exactly match 'click here', 'here', 'link',
 *   'learn more', and user-specified words.
 * @author Matt Wang
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import getAccessibleChildText from '../util/getAccessibleChildText.js';
import getElementType from '../util/getElementType.js';

const DEFAULT_AMBIGUOUS_WORDS = [
  'click here',
  'here',
  'link',
  'a link',
  'learn more',
];

const schema = {
  type: 'object',
  properties: {
    words: {
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
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/anchor-ambiguous-text.md',
      description:
        'Enforce `<a>` text to not exactly match "click here", "here", "link", or "a link".',
    },
    schema: [schema],
    defaultOptions: [{ words: DEFAULT_AMBIGUOUS_WORDS }],
  },

  create: (context) => {
    const elementType = getElementType(context);

    const typesToValidate = ['a'];

    const options = context.options[0];
    const { words } = options;
    const ambiguousWords = new Set(words);

    return {
      JSXOpeningElement: (node) => {
        const nodeType = elementType(node);

        // Only check anchor elements and custom types.
        if (typesToValidate.indexOf(nodeType) === -1) {
          return;
        }

        const nodeText = getAccessibleChildText(node.parent, elementType);

        if (!ambiguousWords.has(nodeText)) {
          // check the value
          return;
        }

        context.report({
          node,
          message:
            'Ambiguous text within anchor. Screen reader users rely on link text for context; the words "{{wordsList}}" are ambiguous and do not provide enough context.',
          data: {
            wordsList: words.join('", "'),
          },
        });
      },
    };
  },
};
