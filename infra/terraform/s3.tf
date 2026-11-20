resource "aws_s3_bucket" "kyc_docs" {
  bucket = "credit-scoring-kyc-documents-secure"
  tags = {
    Environment = "production"
  }
}
