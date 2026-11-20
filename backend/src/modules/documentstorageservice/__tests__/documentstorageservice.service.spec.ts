import { DocumentStorageServiceService } from './documentstorageservice.service';

describe('DocumentStorageServiceService', () => {
  let service: DocumentStorageServiceService;

  beforeEach(() => {
    service = new DocumentStorageServiceService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process request returning success status', async () => {
    const res = await service.process({ id: 'test-123' });
    expect(res.status).toBe('SUCCESS');
    expect(res.module).toBe('DocumentStorageService');
  });
});
