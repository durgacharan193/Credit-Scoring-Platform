variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix used for all resources"
  type        = string
  default     = "credit-scoring"
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "db_password" {
  description = "Master password for the RDS PostgreSQL instance"
  type        = string
  sensitive   = true
}

variable "rabbitmq_password" {
  description = "Password for the Amazon MQ RabbitMQ broker user"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key used to sign JWT tokens (min 64 chars)"
  type        = string
  sensitive   = true
}
