import { Action, simpleCalculator } from '02-table-tests';

describe('simpleCalculator', () => {
  test.each([
    [1, 2, Action.Add, 3],
    [5, 3, Action.Subtract, 2],
    [3, 4, Action.Multiply, 12],
    [15, 3, Action.Divide, 5],
    [2, 3, Action.Exponentiate, 8],
  ])('should calculate %i %s %i = %i', (a, b, action, expected) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBe(expected);
  });
});
