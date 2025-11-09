import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const values = [1, 2, 3];
    const expectedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(values);
    expect(result).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const values = ['a', 'b', 'c'];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });

  test('should generate empty linked list for empty array', () => {
    const result = generateLinkedList([]);
    const expected = { value: null, next: null };

    expect(result).toStrictEqual(expected);
  });

  test('should generate linked list with single element', () => {
    const values = [42];
    const result = generateLinkedList(values);
    const expected = {
      value: 42,
      next: {
        value: null,
        next: null,
      },
    };

    expect(result).toStrictEqual(expected);
  });

  test('should handle null values in array', () => {
    const values = [1, null, 3];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });
});
