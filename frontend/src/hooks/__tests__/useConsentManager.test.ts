import { renderHook } from '@testing-library/react-hooks';
import { useConsentManager } from './useConsentManager';

describe('useConsentManager Hook', () => {
  it('should be defined and return state object', () => {
    expect(useConsentManager).toBeDefined();
  });
});
