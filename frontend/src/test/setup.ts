import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Setup global fetch mock
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true
})