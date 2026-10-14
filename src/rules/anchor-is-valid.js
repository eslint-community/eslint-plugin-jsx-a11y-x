/**
 * @file Performs validity check on anchor hrefs. Warns when anchors are used as
 *   buttons.
 * @author Almero Steyn
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { getProp, getPropValue } = jsxAstUtils;

const allAspects = ['noHref', 'invalidHref', 'preferButton'];

const preferButtonErrorMessage =
  'Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md';

const noHrefErrorMessage =
  'The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md';

const invalidHrefErrorMessage =
  'The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/blob/HEAD/docs/rules/anchor-is-valid.md';

const schema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    specialLink: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    aspects: {
      type: 'array',
      items: { type: 'string', enum: allAspects },
      uniqueItems: true,
      additionalItems: false,
      minItems: 1,
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/anchor-is-valid.md',
      description: 'Enforce all anchors are valid, navigable elements.',
    },
    schema: [schema],
    defaultOptions: [{ components: [], specialLink: [], aspects: allAspects }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    const jsHrefRegexp = /^\W*?javascript:/;

    return {
      JSXOpeningElement: (node) => {
        const { attributes } = node;
        const options = context.options[0];
        const componentOptions = options.components;
        const typeCheck = ['a'].concat(componentOptions);
        const nodeType = elementType(node);

        // Only check anchor elements and custom types.
        if (typeCheck.indexOf(nodeType) === -1) {
          return;
        }

        // Set up the rule aspects to check.
        const aspects = options.aspects;

        // Create active aspect flag object. Failing checks will only report
        // if the related flag is set to true.
        const activeAspects = {};
        allAspects.forEach((aspect) => {
          activeAspects[aspect] = aspects.indexOf(aspect) !== -1;
        });

        const propOptions = options.specialLink;
        const propsToValidate = ['href'].concat(propOptions);
        const values = propsToValidate.map((prop) =>
          getPropValue(getProp(node.attributes, prop)),
        );
        // Checks if any actual or custom href prop is provided.
        const hasAnyHref = values.some((value) => value != null);
        // Need to check for spread operator as props can be spread onto the element
        // leading to an incorrect validation error.
        const hasSpreadOperator = attributes.some(
          (prop) => prop.type === 'JSXSpreadAttribute',
        );
        const onClick = getProp(attributes, 'onClick');

        // When there is no href at all, specific scenarios apply:
        if (!hasAnyHref) {
          // If no spread operator is found and no onClick event is present
          // it is a link without href.
          if (
            !hasSpreadOperator &&
            activeAspects.noHref &&
            (!onClick || (onClick && !activeAspects.preferButton))
          ) {
            context.report({
              node,
              message: noHrefErrorMessage,
            });
          }
          // If no spread operator is found but an onClick is preset it should be a button.
          if (!hasSpreadOperator && onClick && activeAspects.preferButton) {
            context.report({
              node,
              message: preferButtonErrorMessage,
            });
          }
          return;
        }

        // Hrefs have been found, now check for validity.
        const invalidHrefValues = values.filter(
          (value) =>
            value != null &&
            typeof value === 'string' &&
            (!value.length || value === '#' || jsHrefRegexp.test(value)),
        );
        if (invalidHrefValues.length !== 0) {
          // If an onClick is found it should be a button, otherwise it is an invalid link.
          if (onClick && activeAspects.preferButton) {
            context.report({
              node,
              message: preferButtonErrorMessage,
            });
          } else if (activeAspects.invalidHref) {
            context.report({
              node,
              message: invalidHrefErrorMessage,
            });
          }
        }
      },
    };
  },
};
