# TEST MATRIX DRAFT — MODULE 13

Trạng thái ban đầu: `PLANNED / NOT_RUN`.

| Test | Chủ đề | Assertions | Runtime bắt buộc | Trạng thái |
|---|---|---:|---|---|
| T01 | Package, stream, immutable source | 6 | Node + filesystem | NOT_RUN |
| T02 | Canonical and visual invariants | 6 | Chromium | NOT_RUN |
| T03 | Contract and token usage | 7 | Node + Chromium | NOT_RUN |
| T04 | Study divergence and selection | 5 | Chromium | NOT_RUN |
| T05 | P1 disclosure lifecycle | 7 | Chromium input | NOT_RUN |
| T06 | P2 action FSM | 9 | Chromium input | NOT_RUN |
| T07 | P3 attention safety | 5 | Chromium animation | NOT_RUN |
| T08 | Duration/easing fidelity | 6 | Web Animations API | NOT_RUN |
| T09 | Interruption/reversal stress | 7 | Chromium input | NOT_RUN |
| T10 | Reduced-motion equivalence | 8 | Media emulation | NOT_RUN |
| T11 | Keyboard/focus/announcements | 7 | Native keyboard | NOT_RUN |
| T12 | Responsive containment | 6 | 3 viewports × 2 modes | NOT_RUN |
| T13 | Performance/layout stability | 6 | PerformanceObserver | NOT_RUN |
| T14 | Safety boundary | 4 | DOM/computed audit | NOT_RUN |
| T15 | Critique scope | 4 | Parser + diff | NOT_RUN |
| T16 | Evidence/package parity | 7 | Clean unpack | NOT_RUN |
| **Tổng** |  | **96** |  | **NOT_RUN** |

Mỗi assertion phải ghi primitive measurement, expected value, actual value và evidence pointer. Không dùng self-declared boolean làm bằng chứng duy nhất.

