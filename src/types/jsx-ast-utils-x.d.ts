declare module 'jsx-ast-utils-x' {
  import type {
    JSXAttribute,
    JSXOpeningElement,
    JSXSpreadAttribute,
  } from 'estree-jsx';

  const jsxAstUtils: {
    elementType: (node: JSXOpeningElement) => string;
    getProp: (
      props: (JSXAttribute | JSXSpreadAttribute)[],
      prop?: string,
      options?: { ignoreCase?: boolean },
    ) => JSXAttribute | undefined;
    propName: (prop: JSXAttribute) => string;
    getLiteralPropValue: (prop: JSXAttribute | undefined) => unknown;
  };

  export = jsxAstUtils;
}
