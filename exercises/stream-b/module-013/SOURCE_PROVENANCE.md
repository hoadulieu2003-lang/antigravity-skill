# SOURCE PROVENANCE — MODULE 13

## Chain of custody

| Nguồn | Vai trò | Trạng thái |
|---|---|---|
| `design_training_012_submission_r03.zip` | Nguồn candidate thiết kế | Design accepted; technical audit fail-closed |
| `baseline/index.html` | Bản sao candidate Hướng A để khởi tạo study | Read-only |
| `assets/` | 14 authored SVG và manifest | Read-only |
| `CANONICAL_FIXTURE.json` | Dữ liệu nghiệp vụ khóa cứng | Read-only |
| `governance/DESIGN_TRAINING_012_FINAL_REVIEW_008.md` | Phán quyết Controller | Immutable record |
| `governance/DESIGN_TRAINING_012_OWNER_WAIVER_006.md` | Quyết định Owner mở Module 13 | Immutable record |
| `governance/DESIGN_TRAINING_012_OWNER_WAIVER_ACCEPTANCE_009.md` | Biên bản Controller tiếp nhận và khép Module 12 | Immutable record |

## Forbidden evidence inheritance

Không file nào trong snapshot cho phép suy ra rằng verification Module 12 đã PASS. `verify_module_012.js`, `VERIFICATION.json` và tuyên bố `79/79` bị loại khỏi snapshot có chủ ý. Module 13 phải tạo runner, measurements và evidence chain độc lập.

## Baseline identity

```yaml
baseline_candidate_sha256: de7661c03dfb152d5a0c95c88f7ecdf5cb8ea21698e711105f8a2bbb46f51814
canonical_fixture_sha256: 3186f6a4dca0c5b92ad5470115b619ec0c468cfda5768d8db04c0d8d9dec8957
review_008_sha256: ac198df215fdb3a54bdf9db57bcd99f5a3c4e1ff30a84445d9b8162a95a177aa
owner_waiver_006_sha256: cc050ae2c2dec2cec791c436ac6cdb8384edf28cdb71f5cd0d09865857ce0afc
controller_acceptance_009_sha256: 717cdd66750c25de784ffcfdae62bb357a906d37f17c3ba63dde5096e0be00c6
```
