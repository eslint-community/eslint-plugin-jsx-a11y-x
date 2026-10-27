/**
 * Returns true if it can positively determine that the element lacks an
 * accessible label. If no determination is possible, it returns false. Treat
 * false as an unknown value. The element might still have an accessible label,
 * but this module cannot determine it positively.
 */

import jsxAstUtils from 'jsx-ast-utils-x';

const { elementType: rawElementType } = jsxAstUtils;

export default function mayContainChildComponent(
  root,
  isMatch,
  maxDepth = 1,
  elementType = rawElementType,
) {
  function traverseChildren(node, depth) {
    // Bail when maxDepth is exceeded.
    if (depth > maxDepth) {
      return false;
    }
    if (node.children) {
      for (const childNode of node.children) {
        // Assume an expression container renders a label. It is the best we can
        // do in this case.
        if (childNode.type === 'JSXExpressionContainer') {
          return true;
        }
        // Check for components with the provided name.
        if (
          childNode.type === 'JSXElement' &&
          childNode.openingElement &&
          isMatch(elementType(childNode.openingElement))
        ) {
          return true;
        }
        if (traverseChildren(childNode, depth + 1)) {
          return true;
        }
      }
    }
    return false;
  }
  return traverseChildren(root, 1);
}
