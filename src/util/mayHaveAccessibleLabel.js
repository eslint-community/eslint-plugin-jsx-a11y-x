/**
 * Returns true if a labelling element is found or if it cannot determine if a
 * label is present because of expression containers or spread attributes. A
 * false return value means that the node definitely does not have a label, but
 * a true return return value means that the node may or may not have a label.
 */

import jsxAstUtils from 'jsx-ast-utils-x';

const { getPropValue, propName, elementType: rawElementType } = jsxAstUtils;

function tryTrim(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function hasLabellingProp(openingElement, additionalLabellingProps = []) {
  const labellingProps = [
    'alt', // Assume alt is used correctly on an image
    'aria-label',
    'aria-labelledby',
    ...additionalLabellingProps,
  ];
  return openingElement.attributes.some((attribute) => {
    // We must assume that a spread value contains a labelling prop.
    if (attribute.type !== 'JSXAttribute') {
      return true;
    }
    // Attribute matches.
    if (
      labellingProps.includes(propName(attribute)) &&
      !!tryTrim(getPropValue(attribute))
    ) {
      return true;
    }
    return false;
  });
}

export default function mayHaveAccessibleLabel(
  root,
  maxDepth = 1,
  additionalLabellingProps = [],
  getElementType = rawElementType,
  isControlComponent = () => false,
) {
  function checkElement(node, depth) {
    // Bail when maxDepth is exceeded.
    if (depth > maxDepth) {
      return false;
    }
    // Check for literal text.
    if (node.type === 'Literal' && !!tryTrim(node.value)) {
      return true;
    }
    // Assume an expression container renders a label. It is the best we can
    // do in this case.
    if (node.type === 'JSXExpressionContainer') {
      return true;
    }
    // Check for JSXText.
    if (node.type === 'JSXText' && !!tryTrim(node.value)) {
      return true;
    }
    // Check for labelling props.
    if (
      node.openingElement &&
      hasLabellingProp(node.openingElement, additionalLabellingProps)
    ) {
      return true;
    }

    if (
      node.type === 'JSXElement' &&
      node.children.length === 0 &&
      node.openingElement
    ) {
      const name = getElementType(node.openingElement);
      const isReactComponent =
        name.length > 0 && name[0] === name[0].toUpperCase();

      if (isReactComponent && !isControlComponent(name)) {
        return true;
      }
    }

    // Recurse into the child element nodes.
    if (node.children) {
      for (const childNode of node.children) {
        if (checkElement(childNode, depth + 1)) {
          return true;
        }
      }
    }
    return false;
  }
  return checkElement(root, 0);
}
