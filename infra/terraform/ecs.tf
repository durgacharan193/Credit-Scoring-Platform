# ── CloudWatch Log Groups ─────────────────────────────────────
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}/backend"
  retention_in_days = 30

  tags = {
    Service     = "backend"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "scoring_service" {
  name              = "/ecs/${var.project_name}/scoring-service"
  retention_in_days = 30

  tags = {
    Service     = "scoring-service"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.project_name}/frontend"
  retention_in_days = 30

  tags = {
    Service     = "frontend"
    Environment = var.environment
  }
}

# ── IAM: ECS Task Execution Role ─────────────────────────────
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-ecs-task-execution-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow reading SSM parameters for secrets
resource "aws_iam_role_policy" "ecs_ssm_policy" {
  name = "${var.project_name}-ecs-ssm-policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "secretsmanager:GetSecretValue",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })
}

# ── Task Definitions ──────────────────────────────────────────

## Backend
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"

      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV",        value = var.environment },
        { name = "PORT",            value = "3001" },
        { name = "DATABASE_URL",    value = "postgresql://credituser:${var.db_password}@${aws_db_instance.postgres.address}:5432/creditdb?schema=public" },
        { name = "REDIS_URL",       value = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379" },
        { name = "RABBITMQ_URL",    value = "amqp://credituser:${var.rabbitmq_password}@${trimprefix(aws_mq_broker.rabbitmq.instances[0].endpoints[0], "amqps://")}" },
        { name = "JWT_SECRET",      value = var.jwt_secret },
        { name = "JWT_EXPIRES_IN",  value = "7d" },
        { name = "OTP_TTL_SECONDS", value = "600" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      essential = true
    }
  ])

  tags = {
    Name        = "${var.project_name}-backend-task"
    Environment = var.environment
  }
}

## Scoring Service
resource "aws_ecs_task_definition" "scoring_service" {
  family                   = "${var.project_name}-scoring-service"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "scoring-service"
      image = "${aws_ecr_repository.scoring_service.repository_url}:latest"

      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "DATABASE_URL", value = "postgresql://credituser:${var.db_password}@${aws_db_instance.postgres.address}:5432/creditdb" },
        { name = "RABBITMQ_URL", value = "amqp://credituser:${var.rabbitmq_password}@${trimprefix(aws_mq_broker.rabbitmq.instances[0].endpoints[0], "amqps://")}" },
        { name = "PYTHONUNBUFFERED", value = "1" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.scoring_service.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      essential = true
    }
  ])

  tags = {
    Name        = "${var.project_name}-scoring-task"
    Environment = var.environment
  }
}

## Frontend
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = "${aws_ecr_repository.frontend.repository_url}:latest"

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV",              value = "production" },
        { name = "PORT",                  value = "3000" },
        { name = "NEXT_PUBLIC_API_URL",   value = "http://${aws_lb.main.dns_name}" },
        { name = "NEXT_TELEMETRY_DISABLED", value = "1" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      essential = true
    }
  ])

  tags = {
    Name        = "${var.project_name}-frontend-task"
    Environment = var.environment
  }
}

# ── ECS Services ──────────────────────────────────────────────

## Backend Service
resource "aws_ecs_service" "backend" {
  name            = "credit-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3001
  }

  depends_on = [aws_lb_listener.http]

  tags = {
    Name        = "credit-backend-service"
    Environment = var.environment
  }
}

## Scoring Service
resource "aws_ecs_service" "scoring_service" {
  name            = "credit-scoring-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.scoring_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  tags = {
    Name        = "credit-scoring-service"
    Environment = var.environment
  }
}

## Frontend Service
resource "aws_ecs_service" "frontend" {
  name            = "credit-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  tags = {
    Name        = "credit-frontend-service"
    Environment = var.environment
  }
}
