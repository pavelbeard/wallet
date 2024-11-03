import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

vi.mock('next/server', () => {
  return {
    
  };
});

// global.process = {
//     env: {
//       NODE_ENV: 'test',
//       NEXT_PUBLIC_API_URL: 'http://localhost:3000',
//     },
//   } as any;
