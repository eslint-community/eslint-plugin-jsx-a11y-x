import { roleElements } from 'aria-query';
import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { getProp, getPropValue } = jsxAstUtils;

const errorMessage =
  'Use {{tag}} instead of the "{{role}}" role to ensure accessibility across all devices.';

const formatTag = (tag) => {
  if (!tag.attributes) {
    return `<${tag.name}>`;
  }

  const [attribute] = tag.attributes;
  const value = attribute.value ? `"${attribute.value}"` : '...';

  return `<${tag.name} ${attribute.name}=${value}>`;
};

const getLastPropValue = (rawProp) => {
  const propValue = getPropValue(rawProp);
  if (!propValue) {
    return propValue;
  }

  const lastSpaceIndex = propValue.lastIndexOf(' ');

  return lastSpaceIndex === -1
    ? propValue
    : propValue.substring(lastSpaceIndex + 1);
};

export default {
  meta: {
    docs: {
      description:
        'Enforces using semantic DOM elements over the ARIA `role` property.',
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/prefer-tag-over-role.md',
    },
    schema: [],
  },

  create: (context) => {
    const elementType = getElementType(context);

    return {
      JSXOpeningElement: (node) => {
        const role = getLastPropValue(getProp(node.attributes, 'role'));
        if (!role) {
          return;
        }

        const matchedTagsSet = roleElements.get(role);
        if (!matchedTagsSet) {
          return;
        }

        const matchedTags = Array.from(matchedTagsSet);
        if (
          matchedTags.some(
            (matchedTag) => matchedTag.name === elementType(node),
          )
        ) {
          return;
        }

        context.report({
          data: {
            tag:
              matchedTags.length === 1
                ? formatTag(matchedTags[0])
                : [
                    matchedTags
                      .slice(0, matchedTags.length - 1)
                      .map(formatTag)
                      .join(', '),
                    formatTag(matchedTags[matchedTags.length - 1]),
                  ].join(', or '),
            role,
          },
          node,
          message: errorMessage,
        });
      },
    };
  },
};
