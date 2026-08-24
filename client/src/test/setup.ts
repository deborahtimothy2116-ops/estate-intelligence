import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Leaflet for testing environment
vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));
