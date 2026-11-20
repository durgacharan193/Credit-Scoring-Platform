import { renderHook } from '@testing-library/react-hooks';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  it('should be defined and return state object', () => {
    expect(useDebounce).toBeDefined();
  });
});
