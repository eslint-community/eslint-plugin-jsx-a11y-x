/**
 * @file Ensure autocomplete attribute is correct.
 * @author Wilco Fiers
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------
import axe from 'axe-core';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { runVirtualRule } = axe;
const { getLiteralPropValue, getProp } = jsxAstUtils;

const schema = {
  type: 'object',
  properties: {
    inputComponents: {
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
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/autocomplete-valid.md',
      description: 'Enforce that autocomplete attributes are used correctly.',
    },
    schema: [schema],
    defaultOptions: [{ inputComponents: [] }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXOpeningElement: (node) => {
        const options = context.options[0];
        const { inputComponents } = options;
        const inputTypes = ['input'].concat(inputComponents);

        const elType = elementType(node);
        const autocomplete = getLiteralPropValue(
          getProp(node.attributes, 'autocomplete'),
        );

        if (typeof autocomplete !== 'string' || !inputTypes.includes(elType)) {
          return;
        }

        const type = getLiteralPropValue(getProp(node.attributes, 'type'));
        const { violations } = runVirtualRule('autocomplete-valid', {
          nodeName: 'input',
          attributes: {
            autocomplete,
            // Which autocomplete is valid depends on the input type
            type: type === null ? undefined : type,
          },
        });

        if (violations.length === 0) {
          return;
        }
        // Since we only test one rule, with one node, return the message from first (and only) instance of each
        context.report({
          node,
          message: violations[0].nodes[0].all[0].message,
        });
      },
    };
  },
};
