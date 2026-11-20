resource "aws_db_instance" "postgres" {
  identifier             = "credit-scoring-db"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t4g.medium"
  allocated_storage      = 50
  multi_az               = true
}
