/**
 * @file Enforce all aria-* properties are valid.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { aria } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getSuggestion from '../util/getSuggestion.js';

const { propName } = jsxAstUtils;

const ariaAttributes = aria.keys();

const errorMessage = (name) => {
  const suggestions = getSuggestion(name, ariaAttributes);
  const message = `${name}: This attribute is an invalid ARIA attribute.`;

  if (suggestions.length > 0) {
    return `${message} Did you mean to use ${suggestions}?`;
  }

  return message;
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/aria-props.md',
      description: 'Enforce all `aria-*` props are valid.',
    },
    schema: [],
  },

  create: (context) => ({
    JSXAttribute: (attribute) => {
      const name = propName(attribute);

      // `aria` needs to be prefix of property.
      if (name.indexOf('aria-') !== 0) {
        return;
      }

      const isValid = aria.has(name);

      if (isValid === false) {
        context.report({
          node: attribute,
          message: errorMessage(name),
        });
      }
    },
  }),
};
