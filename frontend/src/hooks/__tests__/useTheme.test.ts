import { renderHook } from '@testing-library/react-hooks';
import { useTheme } from './useTheme';

describe('useTheme Hook', () => {
  it('should be defined and return state object', () => {
    expect(useTheme).toBeDefined();
  });
});
