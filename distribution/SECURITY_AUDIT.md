# Security Audit — distribution

## Vulnerabilities Found & Remediated (June 2026)

### npm Audit Baseline
- **Before**: 2 vulnerabilities (1 moderate, 1 high)
- **After**: 0 vulnerabilities

### 1. `crypto` — v1.0.1
| Field | Detail |
|-------|--------|
| **Risk** | Empty npm placeholder package that shadows Node.js built-in `crypto`. `src/md5.js` uses `require('crypto')` which would resolve to this empty package instead of Node's built-in crypto module, breaking MD5 hash generation. |
| **Action** | Removed from `dependencies`. `require('crypto')` now correctly resolves to Node.js built-in `crypto`. |

### 2. `glob` — ^8.0.3
| Field | Detail |
|-------|--------|
| **Risk** | Deprecated version with known memory leak (`inflight`) and unmaintained dependencies. |
| **Action** | Updated via `npm audit fix`. |
