import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import jsxAstUtils from 'jsx-ast-utils-x';

const { elementType, getProp, getLiteralPropValue } = jsxAstUtils;

interface PluginSettings {
  polymorphicPropName?: string;
  polymorphicAllowList?: string[];
  components?: Record<string, string>;
}

const getElementType = (context: Rule.RuleContext) => {
  const settings = context.settings['jsx-a11y-x'] as PluginSettings | undefined;
  const polymorphicPropName = settings?.polymorphicPropName;
  const polymorphicAllowList = settings?.polymorphicAllowList;

  const componentMap = settings?.components;

  return (node: JSXOpeningElement): string => {
    const polymorphicProp = polymorphicPropName
      ? getLiteralPropValue(getProp(node.attributes, polymorphicPropName))
      : undefined;

    let rawType = elementType(node);
    if (
      typeof polymorphicProp === 'string' &&
      polymorphicProp &&
      (!polymorphicAllowList || polymorphicAllowList.includes(rawType))
    ) {
      rawType = polymorphicProp;
    }

    if (!componentMap) {
      return rawType;
    }

    const mappedType = Object.hasOwn(componentMap, rawType)
      ? componentMap[rawType]
      : undefined;
    return mappedType ?? rawType;
  };
};

export default getElementType;
