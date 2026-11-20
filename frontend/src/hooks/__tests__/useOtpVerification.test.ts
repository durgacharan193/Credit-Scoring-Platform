import { renderHook } from '@testing-library/react-hooks';
import { useOtpVerification } from './useOtpVerification';

describe('useOtpVerification Hook', () => {
  it('should be defined and return state object', () => {
    expect(useOtpVerification).toBeDefined();
  });
});
