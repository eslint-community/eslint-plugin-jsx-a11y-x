/**
 * @file Enforce img alt attribute does not have the word image, picture, or
 *   photo.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';

const { getProp, getLiteralPropValue } = jsxAstUtils;

const REDUNDANT_WORDS = ['image', 'photo', 'picture'];

const errorMessage =
  'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt prop.';

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    words: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
};

const ASCII_REGEXP = /[\x20-\x7F]+/;

function containsRedundantWord(value, redundantWords) {
  const lowercaseRedundantWords = redundantWords.map((redundantWord) =>
    redundantWord.toLowerCase(),
  );

  if (ASCII_REGEXP.test(value)) {
    return value
      .split(/\s+/)
      .some((valueWord) =>
        lowercaseRedundantWords.includes(valueWord.toLowerCase()),
      );
  }
  return lowercaseRedundantWords.some((redundantWord) =>
    value.toLowerCase().includes(redundantWord),
  );
}

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/img-redundant-alt.md',
      description:
        'Enforce `<img>` alt prop does not contain the word "image", "picture", or "photo".',
    },
    schema: [schema],
    defaultOptions: [{ components: [], words: [] }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const options = context.options[0];
        const componentOptions = options.components;
        const typesToValidate = ['img'].concat(componentOptions);
        const nodeType = elementType(node);

        // Only check 'label' elements and custom types.
        if (typesToValidate.indexOf(nodeType) === -1) {
          return;
        }

        const altProp = getProp(node.attributes, 'alt');
        // Return if alt prop is not present.
        if (altProp === undefined) {
          return;
        }

        const value = getLiteralPropValue(altProp);
        const isVisible =
          isHiddenFromScreenReader(nodeType, node.attributes) === false;

        const { words } = options;
        const redundantWords = REDUNDANT_WORDS.concat(words);

        if (typeof value === 'string' && isVisible) {
          const hasRedundancy = containsRedundantWord(value, redundantWords);

          if (hasRedundancy === true) {
            context.report({
              node,
              message: errorMessage,
            });
          }
        }
      },
    };
  },
};
