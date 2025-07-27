import { renderHook, act, waitFor } from "@testing-library/react";
import useApi from "../useApi";

describe("useApi", () => {
  const mockData = { id: 1, name: "Test" };
  const mockApiSuccess = jest.fn().mockResolvedValue(mockData);
  const mockApiError = jest.fn().mockRejectedValue(new Error("API Error"));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useApi(mockApiSuccess));

    expect(result.current[0]).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  test("should execute API call and update state correctly on success", async () => {
    const { result } = renderHook(() => useApi(mockApiSuccess));

    await act(async () => {
      result.current[1]();
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({
        data: mockData,
        loading: false,
        error: null,
      });
    });

    expect(mockApiSuccess).toHaveBeenCalledTimes(1);
  });

  test("should handle error correctly", async () => {
    const { result } = renderHook(() => useApi(mockApiError));

    await act(async () => {
      try {
        await result.current[1]();
      } catch (error) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(result.current[0].loading).toBe(false);
      expect(result.current[0].error).toBeInstanceOf(Error);
      expect(result.current[0].error?.message).toBe("API Error");
    });

    expect(mockApiError).toHaveBeenCalledTimes(1);
  });

  test("should reset state when reset function is called", async () => {
    const { result } = renderHook(() => useApi(mockApiSuccess));

    await act(async () => {
      await result.current[1]();
    });

    await waitFor(() => {
      expect(result.current[0].data).toEqual(mockData);
    });

    act(() => {
      result.current[2](); // Call reset function
    });

    expect(result.current[0]).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  test("should make immediate API call when immediate flag is true", async () => {
    renderHook(() => useApi(mockApiSuccess, true, "param1", "param2"));

    await waitFor(() => {
      expect(mockApiSuccess).toHaveBeenCalledTimes(1);
      expect(mockApiSuccess).toHaveBeenCalledWith("param1", "param2");
    });
  });
});
