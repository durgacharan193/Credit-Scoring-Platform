#!/usr/bin/env bash
set -e

echo "=== Deploying Platform to Kubernetes Cluster ==="

kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/redis.yaml
kubectl apply -f infra/k8s/rabbitmq.yaml
kubectl apply -f infra/k8s/backend-deployment.yaml
kubectl apply -f infra/k8s/scoring-deployment.yaml
kubectl apply -f infra/k8s/frontend-deployment.yaml
kubectl apply -f infra/k8s/ingress.yaml

echo "Waiting for deployments rollout..."
kubectl rollout status deployment/backend -n credit-scoring
kubectl rollout status deployment/scoring-service -n credit-scoring
kubectl rollout status deployment/frontend -n credit-scoring

echo "=== Deployment Succeeded ==="
