import { renderHook, act } from "@testing-library/react";
import { useStaggeredAnimation, useScrollPosition } from "../animations";

describe("useStaggeredAnimation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should return empty array initially", () => {
    const { result } = renderHook(() => useStaggeredAnimation(3, 100));
    expect(result.current).toEqual([]);
  });

  test("should add items to array with staggered timing", () => {
    const { result } = renderHook(() => useStaggeredAnimation(3, 100));

    // Advance timers and check the array grows
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).toEqual([]);

    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(result.current).toEqual([0]);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toEqual([0, 1]);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toEqual([0, 1, 2]);
  });
});

describe("useScrollPosition", () => {
  test("should initialize with scrollY 0 and direction none", () => {
    const { result } = renderHook(() => useScrollPosition());
    
    expect(result.current).toEqual({
      scrollY: 0,
      direction: "none",
    });
  });

  test("should update on scroll events", () => {
    const { result } = renderHook(() => useScrollPosition());
    
    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
    });
    
    // Simulate scroll event
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    
    expect(result.current.scrollY).toBe(100);
    expect(result.current.direction).toBe("down");
    
    // Mock scrolling up
    Object.defineProperty(window, "scrollY", { value: 50 });
    
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    
    expect(result.current.scrollY).toBe(50);
    expect(result.current.direction).toBe("up");
  });
});
