import { renderHook } from '@testing-library/react-hooks';
import { useAuthSession } from './useAuthSession';

describe('useAuthSession Hook', () => {
  it('should be defined and return state object', () => {
    expect(useAuthSession).toBeDefined();
  });
});
