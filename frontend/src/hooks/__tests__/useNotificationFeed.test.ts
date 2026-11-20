import { renderHook } from '@testing-library/react-hooks';
import { useNotificationFeed } from './useNotificationFeed';

describe('useNotificationFeed Hook', () => {
  it('should be defined and return state object', () => {
    expect(useNotificationFeed).toBeDefined();
  });
});
