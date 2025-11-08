import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

const mockedExistsSync = jest.mocked(existsSync);
const mockedReadFile = jest.mocked(readFile);
const mockedJoin = jest.mocked(join);

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    
    doStuffByTimeout(callback, timeout);
    
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    
    doStuffByTimeout(callback, timeout);
    
    expect(callback).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(timeout);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;
    
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    
    doStuffByInterval(callback, interval);
    
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    
    doStuffByInterval(callback, interval);
    
    expect(callback).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
    
    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    const expectedFullPath = '/full/path/to/file';
    
    mockedJoin.mockReturnValue(expectedFullPath);
    mockedExistsSync.mockReturnValue(false);
    
    await readFileAsynchronously(pathToFile);
    
    expect(mockedJoin).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    
    mockedJoin.mockReturnValue('/some/path');
    mockedExistsSync.mockReturnValue(false);
    
    const result = await readFileAsynchronously(pathToFile);
    
    expect(result).toBeNull();
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'Hello, World!';
    const fullPath = '/full/path/to/file';
    
    mockedJoin.mockReturnValue(fullPath);
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(Buffer.from(fileContent));
    
    const result = await readFileAsynchronously(pathToFile);
    
    expect(result).toBe(fileContent);
    expect(mockedExistsSync).toHaveBeenCalledWith(fullPath);
    expect(mockedReadFile).toHaveBeenCalledWith(fullPath);
  });
});
