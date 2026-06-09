# Security Audit — SAMP-Mobile-Launcher-RN

## Vulnerabilities Found & Remediated (June 2026)

### npm Audit Baseline
- **Before**: 85 vulnerabilities (8 low, 46 moderate, 24 high, 7 critical)
- **After**: 0 vulnerabilities

---

### 1. `crypto` — v1.0.1
| Field | Detail |
|-------|--------|
| **Risk** | Empty npm placeholder package with no code. Shadows Node.js built-in `crypto` module. If imported, would silently do nothing instead of providing cryptographic functions. Any code relying on it would be non-functional. |
| **Action** | Removed from `dependencies` in `package.json`. The imported `require('crypto')` in `distribution/src/md5.js` now resolves to Node.js built-in `crypto`. |

### 2. `add` — v2.0.6
| Field | Detail |
|-------|--------|
| **Risk** | Numerically-stable float summation library (legitimate). However, it was unused in any source file and served no purpose in a React Native mobile app. Removing reduces attack surface. |
| **Action** | Removed from `dependencies` in `package.json`. |

### 3. `axios` — ^1.6.7 → ^1.17.0
| Field | Detail |
|-------|--------|
| **Risk** | 25 known CVEs including: SSRF, credential leakage via absolute URL, header injection via prototype pollution, cloud metadata exfiltration, proxy authorization credential leak, denial of service, ReDoS, and multiple prototype pollution gadget chains. The March 2026 supply-chain attack (versions 1.14.1/0.30.4 injected `plain-crypto-js` RAT) was not in our version range, but all other CVEs were. |
| **Action** | Updated to `^1.17.0` (latest safe). |

### 4. `react-native` — 0.70.3 → 0.86.0
| Field | Detail |
|-------|--------|
| **Risk** | transitive dependency `ip` (SSRF improper categorization, no fix in old range). Also outdated CLI tooling with multiple high-severity vulns (`braces`, `cross-spawn`, `semver`). |
| **Action** | Updated to `^0.86.0` via `npm audit fix --force`. Note: Jest preset changed to `@react-native/jest-preset` (installed separately). |

### 5. `@react-native-firebase/*` — 15.7.0 → 24.1.0
| Field | Detail |
|-------|--------|
| **Risk** | Transitive dependency `opencollective-postinstall` (phones home during install — considered adware). Also `@xmldom/xmldom` (XML injection, DoS). |
| **Action** | Updated `app`, `crashlytics`, `messaging` to `^24.1.0`. |

### 6. `jest` / `babel-jest` — 26.6.3 → 30.4.2
| Field | Detail |
|-------|--------|
| **Risk** | `braces` (uncontrolled resource consumption, high), `cross-spawn` (ReDoS, high), `form-data` (unsafe random, critical), `jsdom` chain. |
| **Action** | Updated to `^30.4.2` via `npm audit fix --force`. |

### 7. `react-native-rename` — ^2.9.0
| Field | Detail |
|-------|--------|
| **Risk** | `underscore` (arbitrary code execution, critical), `nth-check` (ReDoS, high), `lodash.pick` (prototype pollution, high). This is a one-time CLI tool used only during project initialization — not referenced in any source code. |
| **Action** | Removed from `dependencies` in `package.json`. |

### 8. TypeScript Errors — 45 → 0
| Fix | Files Changed |
|-----|-------------|
| SVG module declarations | Created `src/declarations.d.ts` |
| `@env` module types | Merged into `src/declarations.d.ts`, removed `src/helpers/env.type.ts` |
| Type assertions (`as unknown as`) | `src/thunks/settingsThunks.ts` (8 casts) |
| Navigation typing | `src/components/AlertScreen/AlertUserName.tsx` |
| Width type | `src/components/ButtonLauncher/ButtonLauncher.tsx` |
| Index signatures | `DonateItem.tsx`, `MonitoringItem.tsx`, `SheetServer.tsx` |
| Ref type guard | `MonitoringItem.tsx` |
| UdpSocket + type fixes | `src/helpers/sampQuery.ts` |
| Void truthiness | `src/screens/SettingsScreen.tsx` |
| Implicit any | `src/thunks/notificationThunks.ts` |
| Snowflake component types | `src/declarations.d.ts` |

---

### `.npmrc` Hardening
Added `audit-level=high` to reject `npm install` if high/critical vulnerabilities are present.
