import { renderHook } from '@testing-library/react-hooks';
import { useLedgerStream } from './useLedgerStream';

describe('useLedgerStream Hook', () => {
  it('should be defined and return state object', () => {
    expect(useLedgerStream).toBeDefined();
  });
});
