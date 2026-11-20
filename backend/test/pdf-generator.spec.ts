import { Test, TestingModule } from '@nestjs/testing';
import { PdfGeneratorService } from '../src/modules/credit-report/pdf-generator.service';

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfGeneratorService],
    }).compile();

    service = module.get<PdfGeneratorService>(PdfGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate certificate payload with cryptographic sha256 signature', () => {
    const sampleData = {
      reportId: 'rep-1',
      borrowerName: 'Alice Kumar',
      borrowerId: 'borrower-uuid-1234',
      score: 720,
      tier: 'LOW',
      generatedAt: new Date().toISOString(),
      chainIntegrityValid: true,
      totalTransactions: 15,
      verifiedLenders: 4,
      officerName: 'Officer Sharma',
    };

    const result = service.generateCertificatePayload(sampleData);

    expect(result.certificateId).toContain('CERT-');
    expect(result.signature).toHaveLength(64);
    expect(result.htmlContent).toContain('Alice Kumar');
    expect(result.htmlContent).toContain('720');
    expect(result.htmlContent).toContain('SHA-256 Validated');
  });
});
