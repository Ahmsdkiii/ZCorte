# [Nama Fitur]

| Metadata | Nilai |
|---|---|
| Slug | `[feature-slug]` |
| Status | `DRAFT` / `IN_PROGRESS` / `DONE` |
| Owner | `[nama/tim]` |
| Referensi PRD/FR | `[prd/xx.md, FR-xxx]` |
| Dibuat | `YYYY-MM-DD` |
| Diperbarui | `YYYY-MM-DD` |

## 1. Masalah dan Outcome

Jelaskan masalah pengguna/bisnis, outcome yang diharapkan, dan indikator bahwa fitur berhasil. Hindari mendeskripsikan solusi sebelum masalahnya jelas.

## 2. Scope

### In Scope

- [Perilaku atau deliverable yang termasuk]

### Out of Scope

- [Hal yang sengaja tidak dikerjakan]

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai `[role]`, saya ingin `[aksi]`, sehingga `[manfaat]`.

- [ ] Given `[kondisi]`, when `[aksi]`, then `[hasil yang dapat diamati]`.
- [ ] Error, empty, loading, dan unauthorized state terkait sudah didefinisikan.
- [ ] Perilaku mobile, keyboard, dan screen reader terkait sudah didefinisikan.

## 4. Alur Pengguna

Tuliskan happy path dan recovery path secara ringkas. Tambahkan Mermaid hanya jika relasi atau urutan sulit dipahami lewat teks.

## 5. Desain Teknis

### 5.1 Pemetaan Frontend MVVM

| Lapisan | File/Modul | Tanggung jawab |
|---|---|---|
| Model/DTO | `[path]` | `[domain type, rule, mapper]` |
| ViewModel | `[path]` | `[state, derived state, actions]` |
| View | `[path]` | `[render dan event binding]` |
| Server composition | `[path]` | `[initial data dan composition]` |

Jelaskan sumber state (server, URL, form, atau UI lokal) dan alasan setiap Client Component.

### 5.2 Komposisi Komponen

- Atomic level yang digunakan: `[atom/molecule/organism]`.
- Compound Components: `[ya/tidak]`.
- Jika ya, tuliskan API Root/Provider/subcomponent, context contract (`state/actions/meta`), dan accessibility invariant.
- Jika tidak, jelaskan mengapa props/children biasa sudah cukup.

### 5.3 Alur Backend

```text
[Server Action/Route Handler] → [Service] → [Repository] → Prisma → PostgreSQL
                                  └────────→ [Integration Adapter, bila ada]
```

- Boundary dan validator: `[path/schema]`.
- Service/use case: `[nama dan business rule]`.
- Authorization: `[role, ownership, resource check]`.
- Transaction boundary: `[operasi atomik dan alasan]`.
- Idempotency/concurrency: `[strategi atau N/A dengan alasan]`.
- Domain/audit event: `[event atau N/A]`.

### 5.4 Data dan Migration

- Model/field/constraint/index yang berubah: `[detail atau tidak ada]`.
- Migration/backfill: `[rencana atau tidak ada]`.
- Kompatibilitas data lama: `[dampak]`.
- Rollback atau forward-fix: `[strategi]`.
- Sumber data runtime: PostgreSQL melalui Prisma; tidak ada mock/seed fallback.

### 5.5 Kontrak API/Action

| Kontrak | Input | Output sukses | Error yang diharapkan |
|---|---|---|---|
| `[nama endpoint/action]` | `[schema]` | `[DTO]` | `[code/status]` |

Jangan memasukkan secret, token, atau data produksi ke dokumen.

## 6. Security dan Privacy

- Authentication dan authorization:
- Validasi/sanitasi input:
- Data sensitif dan redaction log:
- Rate limit/abuse prevention:
- Threat/negative case utama:

## 7. Performance, Cache, dan Reliability

- Query dan index yang relevan:
- Strategi cache serta invalidasi:
- Batas payload/pagination:
- Timeout/retry/deduplication:
- Risiko race condition dan mitigasi:

## 8. Error dan Edge Cases

- [Input tidak valid]
- [Belum login/role salah/resource bukan milik pengguna]
- [Data tidak ditemukan atau sudah berubah]
- [Stok habis/duplicate submit/concurrent update]
- [Database/provider gagal atau timeout]

## 9. Test Plan

### Unit

- [ ] `[business rule/view-model behavior]`

### Integration

- [ ] `[repository/service/transaction/authorization]`

### E2E dan UI

- [ ] `[happy path pengguna]`
- [ ] `[negative/recovery path]`
- [ ] Responsive, keyboard, focus, dan accessibility scan.

## 10. File Terdampak

- `[path]` — `[alasan perubahan]`

## 11. Hasil Validasi

Isi setelah implementasi. Jangan menandai command yang tidak benar-benar dijalankan.

| Pemeriksaan | Hasil | Catatan |
|---|---|---|
| `pnpm lint` | `[PASS/FAIL/NOT RUN]` | |
| `pnpm format:check` | `[PASS/FAIL/NOT RUN]` | |
| `pnpm typecheck` | `[PASS/FAIL/NOT RUN]` | |
| Test relevan | `[PASS/FAIL/NOT RUN]` | |
| `pnpm build` | `[PASS/FAIL/NOT RUN]` | |

## 12. Keputusan dan Risiko Tersisa

- Keputusan penting beserta alasan:
- Trade-off yang diterima:
- Risiko atau pekerjaan lanjutan:
