import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    await expect(resolveValue('test string')).resolves.toBe('test string');
    await expect(resolveValue(123)).resolves.toBe(123);
    await expect(resolveValue({ key: 'value' })).resolves.toEqual({
      key: 'value',
    });
    await expect(resolveValue(null)).resolves.toBeNull();
    await expect(resolveValue(undefined)).resolves.toBeUndefined();
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const customMessage = 'Custom error message';
    expect(() => throwError(customMessage)).toThrow(customMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });

  test('should throw MyAwesomeError instance', () => {
    try {
      throwCustomError();
      fail('Expected function to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);

      if (error instanceof Error) {
        expect(error.message).toBe('This is my awesome custom error!');
      }
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });

  test('should reject with MyAwesomeError instance', async () => {
    try {
      await rejectCustomError();
      fail('Expected promise to reject');
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
      if (error instanceof Error) {
        expect(error.message).toBe('This is my awesome custom error!');
      }
    }
  });
});
