import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 5, b: 3, action: Action.Add });
    expect(result).toBe(8);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 10, b: 2, action: Action.Subtract });
    expect(result).toBe(8);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 7, b: 6, action: Action.Multiply });
    expect(result).toBe(42);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 15, b: 3, action: Action.Divide });
    expect(result).toBe(5);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 3,
      action: Action.Exponentiate,
    });
    expect(result).toBe(8);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({
      a: 5,
      b: 3,
      action: 'InvalidAction' as Action,
    });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const invalidInput1 = { a: '5', b: 3, action: Action.Add };
    const invalidInput2 = { a: 5, b: '3', action: Action.Add };
    const invalidInput3 = { a: '5', b: '3', action: Action.Add };

    const result1 = simpleCalculator(invalidInput1);
    expect(result1).toBeNull();

    const result2 = simpleCalculator(invalidInput2);
    expect(result2).toBeNull();

    const result3 = simpleCalculator(invalidInput3);
    expect(result3).toBeNull();
  });
});
