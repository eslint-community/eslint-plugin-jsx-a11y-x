/**
 * @file Enforce controls are associated with a text label.
 * @author Jesse Beach
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';
import isDOMElement from '../util/isDOMElement.js';
import isHiddenFromScreenReader from '../util/isHiddenFromScreenReader.js';
import isInteractiveElement from '../util/isInteractiveElement.js';
import isInteractiveRole from '../util/isInteractiveRole.js';
import mayHaveAccessibleLabel from '../util/mayHaveAccessibleLabel.js';

const { getProp, getLiteralPropValue } = jsxAstUtils;

const errorMessage = 'A control must be associated with a text label.';

const ignoreList = ['link'];

const schema = {
  type: 'object',
  properties: {
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
    ignoreElements: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    ignoreRoles: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    depth: {
      description: 'JSX tree depth limit to check for accessible label',
      type: 'integer',
      minimum: 0,
    },
  },
  additionalProperties: false,
};

export default {
  meta: {
    docs: {
      description:
        'Enforce that a control (an interactive element) has a text label.',
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/control-has-associated-label.md',
    },
    schema: [schema],
    defaultOptions: [
      {
        labelAttributes: [],
        controlComponents: [],
        ignoreElements: [],
        ignoreRoles: [],
      },
    ],
  },

  create: (context) => {
    const elementType = getElementType(context);
    const options = context.options[0];
    const { labelAttributes, controlComponents, ignoreElements, ignoreRoles } =
      options;

    const newIgnoreElements = new Set([...ignoreElements, ...ignoreList]);

    const rule = (node) => {
      const tag = elementType(node.openingElement);
      const role = getLiteralPropValue(
        getProp(node.openingElement.attributes, 'role'),
      );
      // Ignore interactive elements that might get their label from a source
      // that cannot be discerned from static analysis, like
      // <label><input />Save</label>
      if (newIgnoreElements.has(tag)) {
        return;
      }
      // Ignore roles that are "interactive" but should not require a label.
      if (ignoreRoles.includes(role)) {
        return;
      }
      const props = node.openingElement.attributes;
      const nodeIsDOMElement = isDOMElement(tag);
      const nodeIsHiddenFromScreenReader = isHiddenFromScreenReader(tag, props);
      const nodeIsInteractiveElement = isInteractiveElement(tag, props);
      const nodeIsInteractiveRole = isInteractiveRole(tag, props);
      const nodeIsControlComponent = controlComponents.indexOf(tag) > -1;

      if (nodeIsHiddenFromScreenReader) {
        return;
      }

      let hasAccessibleLabel = true;
      if (
        nodeIsInteractiveElement ||
        (nodeIsDOMElement && nodeIsInteractiveRole) ||
        nodeIsControlComponent
      ) {
        // Prevent crazy recursion.
        const recursionDepth = Math.min(
          options.depth === undefined ? 2 : options.depth,
          25,
        );
        hasAccessibleLabel = mayHaveAccessibleLabel(
          node,
          recursionDepth,
          labelAttributes,
          elementType,
          controlComponents,
        );
      }

      if (!hasAccessibleLabel) {
        context.report({
          node: node.openingElement,
          message: errorMessage,
        });
      }
    };

    // Create visitor selectors.
    return {
      JSXElement: rule,
    };
  },
};
