# Cryptographic Hash Chain Design

## Mathematical Foundation

Each transaction $T_i$ is cryptographically linked to the previous transaction $T_{i-1}$ using SHA-256:

$$H_0 = \text{"0"}^{64}$$
$$H_i = \text{SHA256}(T_i.\text{id} \parallel T_i.\text{borrowerId} \parallel T_i.\text{lenderId} \parallel T_i.\text{amount} \parallel T_i.\text{type} \parallel T_i.\text{previousHash})$$

## Verification Invariant

When verifying a chain of length $N$:
1. $T_1.\text{previousHash} == 0^{64}$
2. $\forall i \in [2, N], T_i.\text{previousHash} == T_{i-1}.\text{currentHash}$
3. Recomputed $\text{SHA256}(T_i) == T_i.\text{currentHash}$

Any tampering with transaction amounts or identities invalidates the entire subsequent chain.
