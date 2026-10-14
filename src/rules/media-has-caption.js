/**
 * @file <audio> and <video> elements must have a <track> for captions.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import jsxAstUtils from 'jsx-ast-utils-x';
import getElementType from '../util/getElementType.js';

const { getProp, getLiteralPropValue } = jsxAstUtils;

const errorMessage =
  'Media elements such as <audio> and <video> must have a <track> for captions.';

const MEDIA_TYPES = ['audio', 'video'];

const schema = {
  type: 'object',
  properties: {
    audio: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    video: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
    track: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      additionalItems: false,
    },
  },
  additionalProperties: false,
};

const isMediaType = (context, type) => {
  const options = context.options[0];
  return MEDIA_TYPES.concat(
    MEDIA_TYPES.flatMap((mediaType) => options[mediaType]),
  ).some((typeToCheck) => typeToCheck === type);
};

const isTrackType = (context, type) => {
  const options = context.options[0];
  return ['track']
    .concat(options.track)
    .some((typeToCheck) => typeToCheck === type);
};

export default {
  meta: {
    docs: {
      url: 'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/media-has-caption.md',
      description:
        'Enforces that `<audio>` and `<video>` elements must have a `<track>` for captions.',
    },
    schema: [schema],
    defaultOptions: [{ audio: [], video: [], track: [] }],
  },

  create: (context) => {
    const elementType = getElementType(context);
    return {
      JSXElement: (node) => {
        const element = node.openingElement;
        const type = elementType(element);
        if (!isMediaType(context, type)) {
          return;
        }
        const mutedProp = getProp(element.attributes, 'muted');
        const mutedPropVal = getLiteralPropValue(mutedProp);
        if (mutedPropVal === true) {
          return;
        }

        const trackChildren = node.children.filter((child) => {
          if (child.type !== 'JSXElement') {
            return false;
          }

          return isTrackType(context, elementType(child.openingElement));
        });

        if (trackChildren.length === 0) {
          context.report({
            node: element,
            message: errorMessage,
          });
          return;
        }

        const hasCaption = trackChildren.some((track) => {
          const kindProp = getProp(track.openingElement.attributes, 'kind');
          const kindPropValue = getLiteralPropValue(kindProp) || '';
          return kindPropValue.toLowerCase() === 'captions';
        });

        if (!hasCaption) {
          context.report({
            node: element,
            message: errorMessage,
          });
        }
      },
    };
  },
};
