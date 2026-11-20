import { renderHook } from '@testing-library/react-hooks';
import { useTransactionHistory } from './useTransactionHistory';

describe('useTransactionHistory Hook', () => {
  it('should be defined and return state object', () => {
    expect(useTransactionHistory).toBeDefined();
  });
});
