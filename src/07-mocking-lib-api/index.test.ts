import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: { id: 1, name: 'Test' } })),
  })),
}));

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const mockedAxios = jest.mocked(axios);

describe('throttledGetDataFromApi', () => {
  const mockData = { id: 1, name: 'Test' };
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGet = jest.fn().mockResolvedValue({ data: mockData });

    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as never);
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts/1';

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/users/1';

    await throttledGetDataFromApi(relativePath);

    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts/1';

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toBe(mockData);
  });
});
