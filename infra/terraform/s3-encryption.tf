resource "aws_s3_bucket_server_side_encryption_configuration" "kyc_enc" {
  bucket = aws_s3_bucket.kyc_docs.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
