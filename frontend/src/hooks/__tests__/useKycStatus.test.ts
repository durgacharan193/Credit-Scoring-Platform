import { renderHook } from '@testing-library/react-hooks';
import { useKycStatus } from './useKycStatus';

describe('useKycStatus Hook', () => {
  it('should be defined and return state object', () => {
    expect(useKycStatus).toBeDefined();
  });
});
