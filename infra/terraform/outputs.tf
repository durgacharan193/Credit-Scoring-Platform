output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "Connection endpoint for the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  description = "Connection endpoint for the ElastiCache Redis cluster"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "mq_endpoint" {
  description = "AMQP endpoint for the Amazon MQ RabbitMQ broker"
  value       = aws_mq_broker.rabbitmq.instances[0].endpoints[0]
}

output "ecr_backend_url" {
  description = "ECR repository URL for the backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  description = "ECR repository URL for the frontend image"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_scoring_url" {
  description = "ECR repository URL for the scoring-service image"
  value       = aws_ecr_repository.scoring_service.repository_url
}

output "kms_key_id" {
  description = "ID of the KMS key used for encryption"
  value       = aws_kms_key.main.key_id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}
