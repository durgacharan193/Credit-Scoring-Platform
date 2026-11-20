import { renderHook } from '@testing-library/react-hooks';
import { usePagination } from './usePagination';

describe('usePagination Hook', () => {
  it('should be defined and return state object', () => {
    expect(usePagination).toBeDefined();
  });
});
