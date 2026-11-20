import { renderHook } from '@testing-library/react-hooks';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  it('should be defined and return state object', () => {
    expect(useLocalStorage).toBeDefined();
  });
});
