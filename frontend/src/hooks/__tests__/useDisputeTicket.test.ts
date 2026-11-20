import { renderHook } from '@testing-library/react-hooks';
import { useDisputeTicket } from './useDisputeTicket';

describe('useDisputeTicket Hook', () => {
  it('should be defined and return state object', () => {
    expect(useDisputeTicket).toBeDefined();
  });
});
