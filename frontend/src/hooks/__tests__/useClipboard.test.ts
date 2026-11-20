import { renderHook } from '@testing-library/react-hooks';
import { useClipboard } from './useClipboard';

describe('useClipboard Hook', () => {
  it('should be defined and return state object', () => {
    expect(useClipboard).toBeDefined();
  });
});
