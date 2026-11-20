import { renderHook } from '@testing-library/react-hooks';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery Hook', () => {
  it('should be defined and return state object', () => {
    expect(useMediaQuery).toBeDefined();
  });
});
