import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './msw/server';
import { cleanup } from '@testing-library/react';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Polyfills for Radix UI / shadcn compatibility in jsdom
if (typeof window !== 'undefined') {
  // Mock PointerEvent
  class MockPointerEvent extends Event {
    button: number;
    ctrlKey: boolean;
    pointerId: number;
    pointerType: string;

    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.button = props.button || 0;
      this.ctrlKey = props.ctrlKey || false;
      this.pointerId = props.pointerId || 0;
      this.pointerType = props.pointerType || 'mouse';
    }
  }

  window.PointerEvent = MockPointerEvent as any;

  // Mock Pointer Capture APIs
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();

  // Mock ResizeObserver
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
