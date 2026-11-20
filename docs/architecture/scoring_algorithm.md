# Credit Scoring Engine Formulation

## Score Range

The credit score ranges from **300 to 900**.

## Calculation Components

1. **Base Score**: 300 points (starting value).
2. **Lender Diversity Factor**: Rewards borrowers dealing with multiple distinct lenders.
3. **Repayment Velocity Factor**: Rewards timely cash repayments.
4. **Loan Volume Factor**: Measures total credit throughput.
5. **Anti-Collusion Penalty**: Penalizes high-frequency circular cash movements with single counterparties.

$$\text{Score} = \min\left(900, 300 + (N_{\text{lenders}} \times 60) + (N_{\text{repayments}} \times 70) + (N_{\text{loans}} \times 20) - P_{\text{collusion}}\right)$$
