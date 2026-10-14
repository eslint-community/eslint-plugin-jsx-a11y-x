/**
 * @file Enforce label tags have an associated control.
 * @author Jesse Beach
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import { minimatch } from 'minimatch';
import getElementType from '../util/getElementType.js';
import mayContainChildComponent from '../util/mayContainChildComponent.js';
import mayHaveAccessibleLabel from '../util/mayHaveAccessibleLabel.js';

const { hasProp, getProp, getPropValue } = jsxAstUtils;

const errorMessages = {
  accessibleLabel: 'A form label must have accessible text.',
  htmlFor: 'A form label must have a valid htmlFor attribute.',
  nesting: 'A form label must have an associated control as a descendant.',
  either:
    'A form label must either have a valid htmlFor attribute or a control as a descendant.',
  both: 'A form label must have a valid htmlFor attribute and a control as a descendant.',
};

const schema = {
  type: 'object',
  properties: {
    labelComponents: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    labelAttributes: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    controlComponents: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    assert: {
      description:
        'Assert that the label has htmlFor, a nested label, both or either',
      type: 'string',
      enum: ['htmlFor', 'nesting', 'both', 'either'],
    },
    depth: {
      description: 'JSX tree depth limit to check for accessible label',
      type: 'integer',
      minimum: 0,
    },
  },
  additionalProperties: false,
};

const validateHtmlFor = (node, context) => {
  const { settings } = context;
  const htmlForAttributes = settings['jsx-a11y-x']?.attributes?.for ?? [
    'htmlFor',
  ];

  for (const attribute of htmlForAttributes) {
    if (hasProp(node.attributes, attribute)) {
      const htmlForAttr = getProp(node.attributes, attribute);
      const htmlForValue = getPropValue(htmlForAttr);

      return htmlForAttr !== false && !!htmlForValue;
    }
  }

  return false;
};

export default {
  meta: {
    docs: {
      description:
        'Enforce that a `label` tag has a text label and an associated control.',
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/label-has-associated-control.md',
    },
    schema: [schema],
    defaultOptions: [
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 2,
      },
    ],
  },

  create: (context) => {
    const options = context.options[0];
    const labelComponents = options.labelComponents;
    const assertType = options.assert;
    const labelComponentNames = ['label'].concat(labelComponents);
    const elementType = getElementType(context);

    const rule = (node) => {
      const isLabelComponent = labelComponentNames.some((name) =>
        minimatch(elementType(node.openingElement), name),
      );
      if (!isLabelComponent) {
        return;
      }

      const controlComponents = [
        'input',
        'meter',
        'output',
        'progress',
        'select',
        'textarea',
        ...options.controlComponents,
      ];
      // Prevent crazy recursion.
      const recursionDepth = Math.min(options.depth, 25);
      const hasHtmlFor = validateHtmlFor(node.openingElement, context);
      // Check for multiple control components.
      const hasNestedControl = controlComponents.some((name) =>
        mayContainChildComponent(node, name, recursionDepth, elementType),
      );
      const hasAccessibleLabel = mayHaveAccessibleLabel(
        node,
        recursionDepth,
        options.labelAttributes,
        elementType,
        controlComponents,
      );

      // Bail out immediately if we don't have an accessible label.
      if (!hasAccessibleLabel) {
        context.report({
          node: node.openingElement,
          message: errorMessages.accessibleLabel,
        });
        return;
      }
      switch (assertType) {
        case 'htmlFor':
          if (!hasHtmlFor) {
            context.report({
              node: node.openingElement,
              message: errorMessages.htmlFor,
            });
          }
          break;
        case 'nesting':
          if (!hasNestedControl) {
            context.report({
              node: node.openingElement,
              message: errorMessages.nesting,
            });
          }
          break;
        case 'both':
          if (!hasHtmlFor || !hasNestedControl) {
            context.report({
              node: node.openingElement,
              message: errorMessages.both,
            });
          }
          break;
        case 'either':
          if (!hasHtmlFor && !hasNestedControl) {
            context.report({
              node: node.openingElement,
              message: errorMessages.either,
            });
          }
          break;
        default:
          break;
      }
    };

    // Create visitor selectors.
    return {
      JSXElement: rule,
    };
  },
};
