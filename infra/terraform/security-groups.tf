resource "aws_security_group" "db_sg" {
  name        = "credit-scoring-db-sg"
  description = "Allow inbound postgres traffic from backend"
  vpc_id      = aws_vpc.main.id
}
