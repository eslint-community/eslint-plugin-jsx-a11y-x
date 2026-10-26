/**
 * @file Enforce lang attribute has a valid value.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import jsxAstUtils from 'jsx-ast-utils-x';
import tags from 'language-tags';
import getElementType from '../util/getElementType.js';

const { propName, getLiteralPropValue } = jsxAstUtils;

const errorMessage = 'lang attribute must have a valid value.';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/lang.md',
      description: 'Enforce lang attribute has a valid value.',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXAttribute: (node) => {
        const name = propName(node);
        if (name && name.toUpperCase() !== 'LANG') {
          return;
        }

        // A JSXAttribute's parent is always a JSXOpeningElement.
        const parent = node.parent as JSXOpeningElement;
        const type = elementType(parent);
        if (type && type !== 'html') {
          return;
        }

        const value = getLiteralPropValue(node);

        // Don't check identifiers
        if (value === null) {
          return;
        }
        if (value === undefined) {
          context.report({
            node,
            message: errorMessage,
          });

          return;
        }

        if (typeof value === 'string' && tags.check(value)) {
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

export default rule;
