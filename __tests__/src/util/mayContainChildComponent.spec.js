import { describe, expect, test } from 'vitest';
import mayContainChildComponent from '../../../src/util/mayContainChildComponent.js';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock.js';
import JSXElementMock from '../../../__mocks__/JSXElementMock.js';
import JSXExpressionContainerMock from '../../../__mocks__/JSXExpressionContainerMock.js';

describe('mayContainChildComponent', () => {
  expect(
    mayContainChildComponent(
      JSXElementMock(
        'div',
        [],
        [
          JSXElementMock(
            'div',
            [],
            [
              JSXElementMock('span', [], []),
              JSXElementMock(
                'span',
                [],
                [
                  JSXElementMock('span', [], []),
                  JSXElementMock('span', [], [JSXElementMock('span', [], [])]),
                ],
              ),
            ],
          ),
          JSXElementMock('span', [], []),
          JSXElementMock('img', [JSXAttributeMock('src', 'some/path')]),
        ],
      ),
      (name) => name === 'FancyComponent',
      5,
    ),
  ).toBe(false);

  test('contains an indicated component', () => {
    expect(
      mayContainChildComponent(
        JSXElementMock('div', [], [JSXElementMock('input')]),
        (name) => name === 'input',
      ),
    ).toBe(true, 'returns true');

    expect(
      mayContainChildComponent(
        JSXElementMock('div', [], [JSXElementMock('FancyComponent')]),
        (name) => name === 'FancyComponent',
      ),
    ).toBe(true, 'returns true');

    expect(
      mayContainChildComponent(
        JSXElementMock(
          'div',
          [],
          [JSXElementMock('div', [], [JSXElementMock('FancyComponent')])],
        ),
        (name) => name === 'FancyComponent',
      ),
    ).toBe(
      false,
      'FancyComponent is outside of default depth, should return false',
    );

    expect(
      mayContainChildComponent(
        JSXElementMock(
          'div',
          [],
          [JSXElementMock('div', [], [JSXElementMock('FancyComponent')])],
        ),
        (name) => name === 'FancyComponent',
        2,
      ),
    ).toBe(
      true,
      'FancyComponent is inside of custom depth, should return true',
    );

    expect(
      mayContainChildComponent(
        JSXElementMock(
          'div',
          [],
          [
            JSXElementMock(
              'div',
              [],
              [
                JSXElementMock('span', [], []),
                JSXElementMock(
                  'span',
                  [],
                  [
                    JSXElementMock('span', [], []),
                    JSXElementMock(
                      'span',
                      [],
                      [
                        JSXElementMock(
                          'span',
                          [],
                          [
                            JSXElementMock(
                              'span',
                              [],
                              [JSXElementMock('FancyComponent')],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            JSXElementMock('span', [], []),
            JSXElementMock('img', [JSXAttributeMock('src', 'some/path')]),
          ],
        ),
        (name) => name === 'FancyComponent',
        6,
      ),
    ).toBe(true, 'deep nesting, returns true');
  });

  expect(
    mayContainChildComponent(
      JSXElementMock('div', [], [JSXExpressionContainerMock('mysteryBox')]),
      (name) => name === 'FancyComponent',
    ),
  ).toBe(true);

  test('using a custom elementType function', () => {
    expect(
      mayContainChildComponent(
        JSXElementMock('div', [], [JSXElementMock('CustomInput')]),
        (name) => name === 'input',
        2,
        () => 'input',
      ),
    ).toBe(
      true,
      'returns true when the custom elementType returns the proper name',
    );

    expect(
      mayContainChildComponent(
        JSXElementMock('div', [], [JSXElementMock('CustomInput')]),
        (name) => name === 'input',
        2,
        () => 'button',
      ),
    ).toBe(
      false,
      'returns false when the custom elementType returns a wrong name',
    );
  });
});
