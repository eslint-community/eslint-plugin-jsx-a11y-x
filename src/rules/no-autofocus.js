/**
 * @file Enforce autoFocus prop is not used.
 * @author Ethan Cohen <@evcohen>
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import { dom } from 'aria-query';
import getElementType from '../util/getElementType.js';

const { propName, getPropValue } = jsxAstUtils;

const errorMessage =
  'The autoFocus prop should not be enabled, as it can reduce usability and accessibility for users.';

const schema = {
  type: 'object',
  properties: {
    ignoreNonDOM: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/no-autofocus.md',
      description: 'Enforce autoFocus prop is not enabled.',
    },
    schema: [schema],
    defaultOptions: [{ ignoreNonDOM: false }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXAttribute: (attribute) => {
        // Determine if ignoreNonDOM is set to true
        // If true, then do not run rule.
        const options = context.options[0];
        const ignoreNonDOM = options.ignoreNonDOM;

        if (ignoreNonDOM) {
          const type = elementType(attribute.parent);
          if (!dom.get(type)) {
            return;
          }
        }

        // Fail if autoFocus is used and the value is anything other than false (either via an expression or string literal).
        if (
          propName(attribute) === 'autoFocus' &&
          getPropValue(attribute) !== false &&
          getPropValue(attribute) !== 'false'
        ) {
          context.report({
            node: attribute,
            message: errorMessage,
          });
        }
      },
    };
  },
};
