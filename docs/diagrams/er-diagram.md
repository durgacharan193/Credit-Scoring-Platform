```mermaid
erDiagram
  USER ||--o{ TRANSACTION : creates
  USER ||--o{ CONSENT : grants
  USER ||--|| CREDIT_SCORE : possesses
  TRANSACTION }|--|| AUDIT_BLOCK : committed_in
```
