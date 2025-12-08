# Kubernetes Deployment Guide

This guide explains how to deploy FOCUS platform to Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (v1.19+)
- kubectl configured
- Docker registry access
- PostgreSQL and Redis databases

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focus
   ```

2. **Build and push Docker image**
   ```bash
   docker build -t your-registry/focus:latest .
   docker push your-registry/focus:latest
   ```

3. **Apply Kubernetes manifests**
   ```bash
   kubectl apply -f k8s/
   ```

4. **Configure secrets**
   ```bash
   kubectl create secret generic focus-secrets \
     --from-literal=database-url="postgresql://..." \
     --from-literal=jwt-secret="your-jwt-secret" \
     --from-literal=redis-url="redis://..."
   ```

## Architecture

The deployment includes:
- **Deployment**: Main application with rolling updates
- **Service**: Load balancer for the application
- **ConfigMap**: Environment configuration
- **Secrets**: Sensitive configuration

## Monitoring

### Prometheus Metrics

The application exposes metrics at `/api/metrics` endpoint.

To integrate with Prometheus:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: focus-monitor
spec:
  selector:
    matchLabels:
      app: focus
  endpoints:
  - port: http
    path: /api/metrics
    interval: 30s
```

### Health Checks

- **Liveness Probe**: `/api/health` - restarts container if unhealthy
- **Readiness Probe**: `/api/health` - removes from service if not ready

## Scaling

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: focus-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: focus-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Security

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: focus-network-policy
spec:
  podSelector:
    matchLabels:
      app: focus
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
```

### Security Context

The deployment includes:
- Non-root user execution
- Read-only root filesystem
- Dropped capabilities
- Resource limits

## Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**
   - Check logs: `kubectl logs -f deployment/focus-app`
   - Verify environment variables and secrets

2. **Service Unavailable**
   - Check endpoints: `kubectl get endpoints`
   - Verify service selector matches deployment labels

3. **Database Connection Issues**
   - Check database connectivity from pod
   - Verify secrets are correctly mounted

### Logs

```bash
# Application logs
kubectl logs -f deployment/focus-app

# Audit logs (if enabled)
kubectl exec -it deployment/focus-app -- cat /app/logs/audit.log
```

## Backup and Recovery

### Database Backup

```bash
# PostgreSQL backup
kubectl exec -it postgres-pod -- pg_dump -U user focus > backup.sql

# Redis backup
kubectl exec -it redis-pod -- redis-cli save
```

### Rolling Back

```bash
# Rollback deployment
kubectl rollout undo deployment/focus-app

# Check rollout status
kubectl rollout status deployment/focus-app
```

## Performance Tuning

### Resource Limits

Adjust based on your workload:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Database Connection Pooling

Configure connection pooling in your application for high traffic.

## CI/CD Integration

The platform includes GitHub Actions workflows for automated deployment:

- **Staging**: Automatic deployment on develop branch push
- **Production**: Manual approval required for main branch

See `.github/workflows/` for workflow configurations.