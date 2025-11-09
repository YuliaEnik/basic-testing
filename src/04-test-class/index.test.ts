import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockedRandom = jest.mocked(random);

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(500);
    expect(() => account.withdraw(600)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(600)).toThrow(
      'Insufficient funds: cannot withdraw more than 500',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(500);
    const account2 = getBankAccount(100);
    expect(() => account1.transfer(600, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(1000);
    expect(() => account.transfer(100, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(100, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);
    account.deposit(500);
    expect(account.getBalance()).toBe(1500);

    account.deposit(100).deposit(200);
    expect(account.getBalance()).toBe(1800);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);
    account.withdraw(300);
    expect(account.getBalance()).toBe(700);

    account.withdraw(100).withdraw(200);
    expect(account.getBalance()).toBe(400);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(1000);
    const account2 = getBankAccount(500);

    account1.transfer(300, account2);

    expect(account1.getBalance()).toBe(700);
    expect(account2.getBalance()).toBe(800);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(1000);

    mockedRandom.mockReturnValue(50);

    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(1000);

    mockedRandom.mockReturnValue(750);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(750);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(1000);

    mockedRandom.mockReturnValue(0);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });

  test('fetchBalance should return null when request failed', async () => {
    const account = getBankAccount(1000);

    mockedRandom.mockReturnValue(0);

    const result = await account.fetchBalance();
    expect(result).toBeNull();
  });
});
