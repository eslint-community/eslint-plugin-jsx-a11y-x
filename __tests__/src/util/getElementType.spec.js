import { describe, expect, test } from 'vitest';
import getElementType from '../../../src/util/getElementType.js';
import JSXElementMock from '../../../__mocks__/JSXElementMock.js';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock.js';

describe('getElementType', () => {
  test('no settings in context', () => {
    const elementType = getElementType({ settings: {} });

    expect(elementType(JSXElementMock('input').openingElement)).toBe(
      'input',
      'returns the exact tag name for a DOM element',
    );

    expect(elementType(JSXElementMock('CustomInput').openingElement)).toBe(
      'CustomInput',
      'returns the exact tag name for a custom element',
    );

    expect(elementType(JSXElementMock('toString').openingElement)).toBe(
      'toString',
      'returns the exact tag name for names that are in Object.prototype',
    );

    expect(
      elementType(
        JSXElementMock('span', [JSXAttributeMock('as', 'h1')]).openingElement,
      ),
    ).toBe('span', 'returns the default tag name provided');
  });

  test('components settings in context', () => {
    const elementType = getElementType({
      settings: {
        'jsx-a11y-x': {
          components: {
            CustomInput: 'input',
          },
        },
      },
    });

    expect(elementType(JSXElementMock('input').openingElement)).toBe(
      'input',
      'returns the exact tag name for a DOM element',
    );

    expect(elementType(JSXElementMock('CustomInput').openingElement)).toBe(
      'input',
      'returns the mapped tag name for a custom element',
    );

    expect(elementType(JSXElementMock('CityInput').openingElement)).toBe(
      'CityInput',
      'returns the exact tag name for a custom element not in the components map',
    );

    expect(
      elementType(
        JSXElementMock('span', [JSXAttributeMock('as', 'h1')]).openingElement,
      ),
    ).toBe(
      'span',
      'return the default tag name since not polymorphicPropName was provided',
    );
  });

  test('polymorphicPropName settings in context', () => {
    const elementType = getElementType({
      settings: {
        'jsx-a11y-x': {
          polymorphicPropName: 'asChild',
          components: {
            CustomButton: 'button',
          },
        },
      },
    });

    expect(
      elementType(
        JSXElementMock('span', [JSXAttributeMock('asChild', 'h1')])
          .openingElement,
      ),
    ).toBe(
      'h1',
      'returns the tag name provided by the polymorphic prop, "asChild", defined in the settings',
    );

    expect(
      elementType(
        JSXElementMock('CustomButton', [JSXAttributeMock('asChild', 'a')])
          .openingElement,
      ),
    ).toBe(
      'a',
      'returns the tag name provided by the polymorphic prop, "asChild", defined in the settings instead of the component mapping tag',
    );

    expect(
      elementType(
        JSXElementMock('CustomButton', [JSXAttributeMock('as', 'a')])
          .openingElement,
      ),
    ).toBe(
      'button',
      'returns the tag name provided by the componnet mapping if the polymorphic prop, "asChild", defined in the settings is not set',
    );

    expect(
      elementType(
        JSXElementMock('span', [JSXAttributeMock('asChild', true)])
          .openingElement,
      ),
    ).toBe('span', 'ignores the polymorphic prop if its value is not a string');
  });

  test('polymorphicPropName settings and explicitly defined polymorphicAllowList in context', () => {
    const elementType = getElementType({
      settings: {
        'jsx-a11y-x': {
          polymorphicPropName: 'asChild',
          polymorphicAllowList: ['Box', 'Icon'],
          components: {
            Box: 'div',
            Icon: 'svg',
          },
        },
      },
    });

    expect(
      elementType(
        JSXElementMock('Spinner', [JSXAttributeMock('asChild', 'img')])
          .openingElement,
      ),
    ).toBe(
      'Spinner',
      'does not use the polymorphic prop if polymorphicAllowList is defined, but element is not part of polymorphicAllowList',
    );

    expect(
      elementType(
        JSXElementMock('Icon', [JSXAttributeMock('asChild', 'img')])
          .openingElement,
      ),
    ).toBe(
      'img',
      'uses the polymorphic prop if it is in explicitly defined polymorphicAllowList',
    );

    expect(
      elementType(
        JSXElementMock('Box', [JSXAttributeMock('asChild', 'span')])
          .openingElement,
      ),
    ).toBe(
      'span',
      'returns the tag name provided by the polymorphic prop, "asChild", defined in the settings instead of the component mapping tag',
    );

    expect(
      elementType(
        JSXElementMock('Box', [JSXAttributeMock('as', 'a')]).openingElement,
      ),
    ).toBe(
      'div',
      'returns the tag name provided by the component mapping if the polymorphic prop, "asChild", defined in the settings is not set',
    );
  });
});
