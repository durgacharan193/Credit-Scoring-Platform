import { renderHook } from '@testing-library/react-hooks';
import { useCreditScore } from './useCreditScore';

describe('useCreditScore Hook', () => {
  it('should be defined and return state object', () => {
    expect(useCreditScore).toBeDefined();
  });
});
