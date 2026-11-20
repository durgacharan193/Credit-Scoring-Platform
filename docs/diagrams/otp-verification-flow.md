```mermaid
sequenceDiagram
  Borrower->>Frontend: Enters Phone
  Frontend->>Backend: Request OTP
  Backend->>SMS: Send 6-digit Code
  Borrower->>Frontend: Submits OTP
  Frontend->>Backend: Verify OTP
  Backend->>Frontend: JWT Bearer Token
```
