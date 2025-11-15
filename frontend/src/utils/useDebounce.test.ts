import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));

    expect(result.current).toBe("test");
  });

  it("delays updating the debounced value", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Update the value
    rerender({ value: "updated", delay: 500 });

    // Value should still be old immediately after update
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe("updated");
  });

  it("cancels previous timeout when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 500 } }
    );

    expect(result.current).toBe("first");

    // Change value
    rerender({ value: "second", delay: 500 });

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Change value again before timeout
    rerender({ value: "third", delay: 500 });

    // Advance to original timeout
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Should still be 'first' because we haven't waited full 500ms since 'third'
    expect(result.current).toBe("first");

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Now should be 'third'
    expect(result.current).toBe("third");
  });

  it("works with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 1000 } }
    );

    rerender({ value: "updated", delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current).toBe("test");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("works with different types", () => {
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    );

    numberRerender({ value: 42, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(numberResult.current).toBe(42);

    const { result: boolResult, rerender: boolRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: false, delay: 100 } }
    );

    boolRerender({ value: true, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(boolResult.current).toBe(true);
  });

  it("cleans up timeout on unmount", () => {
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 500 } }
    );

    rerender({ value: "updated", delay: 500 });
    unmount();

    // Should not throw error
    act(() => {
      jest.advanceTimersByTime(500);
    });
  });

  it("handles zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 0 } }
    );

    rerender({ value: "updated", delay: 0 });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });
});
