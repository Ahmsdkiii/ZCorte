# AGENTS.md — Aturan Engineering ZCorté

Dokumen ini berlaku untuk seluruh repository. Tujuannya adalah menghasilkan kode yang benar, aman, mudah dirawat, efisien, dan siap diuji—bukan sekadar terlihat selesai.

> **Mulai di Sini (Peta Cepat):**
>
> - Setup & gambaran umum: [README.md](README.md) · [docs/guides/00-start-here.md](docs/guides/00-start-here.md)
> - Resep membuat fitur end-to-end: [docs/guides/02-feature-recipe.md](docs/guides/02-feature-recipe.md)
> - Database & anti-konflik migration: [docs/guides/03-database-workflow.md](docs/guides/03-database-workflow.md)
> - Pembagian 3 lane & aturan PR: [docs/team/ownership.md](docs/team/ownership.md) · [CONTRIBUTING.md](CONTRIBUTING.md)

## 1. Urutan Sumber Kebenaran

1. Ikuti permintaan pengguna yang paling baru dan eksplisit.
2. Ikuti aturan pada `AGENTS.md` ini.
3. Ikuti PRD di `prd/`; mulai dari `prd/README.md`, lalu baca hanya dokumen yang relevan dengan tugas.
4. Ikuti kontrak, pola, penamaan, dan konfigurasi yang sudah ada di codebase — **kecuali pola prototype lama** yang melanggar arsitektur target (lihat tabel transisi di `docs/guides/00-start-here.md` §4).

Jika kode bertentangan dengan PRD, jangan diam-diam mempertahankan perilaku lama. Jelaskan konflik, lalu sesuaikan kode atau dokumentasi dalam scope tugas. Jangan mengarang keputusan produk yang berdampak besar.

## 2. Konteks Produk yang Wajib Dipertahankan

- Nama brand adalah **ZCorté** dan nama tim adalah **ZeroCode**.
- Aplikasi adalah e-commerce fashion satu brand dengan `OWNER`, `CUSTOMER`, dan Visitor tanpa akun.
- Stack utama: Next.js App Router, React, TypeScript strict, Tailwind CSS, PostgreSQL, dan Prisma ORM.
- PostgreSQL adalah sumber kebenaran semua data inti runtime.
- Produk, varian, harga, metadata/URL gambar, dan stok runtime wajib berasal dari PostgreSQL melalui Prisma. Berkas gambar dapat disimpan lewat storage adapter yang ditetapkan PRD.
- Dilarang memakai mock, JSON statis, hardcode, seed file, atau fallback in-memory sebagai sumber data produk runtime.
- Seed/bootstrap hanya boleh dipakai sebagai perintah eksplisit untuk `INSERT`/`UPSERT` data development atau demo. Jangan menjalankan seed otomatis saat build, startup, atau request. Setelah bootstrap selesai, aplikasi hanya membaca database.
- `localStorage` hanya boleh menyimpan bag Visitor dan preferensi UI non-sensitif; jangan menjadikannya sumber kebenaran katalog, stok, pesanan, pengguna, atau pembayaran.
- R0 memakai backend/database nyata. Hanya provider eksternal seperti payment, AI, dan Telegram yang boleh disimulasikan melalui adapter sesuai PRD.

## 3. Cara Kerja Agent

Untuk setiap perubahan kode:

0. Pastikan berada di branch fitur/fix yang sesuai (dibuat dari `develop`, bukan `main`/`master` atau `develop` langsung) dan periksa `docs/team/ownership.md` sebelum menyentuh modul milik lane lain atau file kontrak bersama. Jika sedang berada di branch PR milik rekan untuk keperluan review/audit, lakukan pemeriksaan secara _read-only_ dan jangan mengedit langsung di branch rekan kecuali diminta eksplisit; terapkan perbaikan pasca-merge melalui branch `fix/*` di atas `develop`.
1. Pahami tujuan, acceptance criteria, dan alur pengguna yang terpengaruh.
2. Untuk fitur baru atau perubahan fitur, buat/perbarui `docs/features/<feature-slug>.md` dari template sebelum implementasi dan jaga tetap sinkron sampai selesai.
3. Inspeksi file terkait, konfigurasi, dependency, serta PRD relevan sebelum mengubah kode.
4. Cari akar masalah. Jangan menutup gejala dengan workaround rapuh.
5. Buat perubahan sekecil mungkin tetapi lengkap end-to-end.
6. Ikuti pola repository yang masih sehat; jangan menyalin pola lama yang bertentangan dengan PRD atau aturan ini.
7. Jalankan validasi yang sebanding dengan risiko perubahan.
8. Periksa kembali diff untuk regresi, dead code, kebocoran data, dokumentasi yang kedaluwarsa, dan perubahan di luar scope.
9. Laporkan hasil, pengujian yang dijalankan, dan risiko tersisa secara jujur.

Jangan berhenti pada rencana jika pengguna meminta implementasi. Gunakan asumsi yang aman untuk detail kecil, tetapi tanyakan sebelum keputusan yang mengubah scope, kontrak publik, data pengguna, atau arsitektur secara material.

## 4. Standar Kualitas Umum

- Utamakan urutan: correctness, security, clarity, maintainability, lalu performance.
- Pilih solusi paling sederhana yang memenuhi requirement; hindari clever code dan premature abstraction.
- Terapkan DRY pada aturan bisnis, bukan dengan membuat abstraksi generik sebelum ada pola nyata.
- Setiap fungsi dan modul harus memiliki tanggung jawab yang jelas serta nama yang menjelaskan intent.
- Pertahankan fungsi kecil dan alur kontrol mudah dibaca. Gunakan early return untuk mengurangi nesting.
- Hindari side effect tersembunyi, mutable global state, magic number, dan magic string.
- Gunakan konstanta, enum/union, schema, atau configuration terpusat bila nilai memiliki makna domain.
- Jangan menambah dependency jika platform atau dependency yang ada sudah cukup. Jika perlu dependency baru, jelaskan manfaat, risiko, ukuran, lisensi, dan maintenance-nya.
- Jangan meninggalkan debug log, commented-out code, placeholder palsu, atau `TODO` tanpa format yang dapat ditindaklanjuti: `TODO(<owner>): <konteks/alasan> [<FR-ID atau issue>]`.
- Jangan mengubah file yang tidak relevan atau menimpa pekerjaan pengguna.
- Jangan melakukan refactor besar bersamaan dengan feature/bugfix kecuali memang diperlukan untuk correctness.
- Semua file teks harus terformat konsisten dan lolos pemeriksaan repository.

## 5. TypeScript

- Pertahankan `strict: true`. Jangan melemahkan TypeScript atau ESLint untuk membuat error hilang.
- Jangan gunakan `any`. Gunakan tipe konkret, generic yang terikat, atau `unknown` lalu lakukan narrowing/validasi.
- Hindari type assertion (`as`) dan non-null assertion (`!`) kecuali invariant sudah dibuktikan dan alasannya jelas.
- Modelkan state dengan discriminated union bila mencegah kombinasi state yang tidak valid.
- Bedakan tipe domain, tipe persistence Prisma, DTO API, dan props UI. Mapping dilakukan eksplisit di boundary.
- Jangan mengirim object Prisma mentah ke client jika mengandung field internal atau sensitif.
- Tangani `null`/`undefined` secara eksplisit. Jangan bergantung pada coercion yang ambigu.
- Export hanya API modul yang memang diperlukan.

## 6. Arsitektur dan Arah Dependensi

Gunakan monolit modular sesuai `prd/08-architecture.md`. Frontend memakai MVVM pragmatis dan komposisi React; backend memakai Service–Repository dengan adapter untuk layanan eksternal.

```text
Server Component/Page ────────────────┐
                                      ▼
Client View ⇄ ViewModel ──► Action/Handler ──► Service ──► Repository ──► Prisma ──► PostgreSQL
                    Model/DTO ▲              └──────────► Integration Adapter
```

Aturan arah dependensi:

- `components/views → hooks/view-models → models + actions/API client`.
- `app/actions/route handlers → validators + services`.
- `services → repositories + integrations + models`.
- `repositories → db/Prisma`; `integrations → provider SDK/API`.
- `models` berisi domain type/rule/mapper murni dan tidak boleh mengimpor React, Next.js, Prisma Client, atau transport HTTP.
- Modul server tidak boleh diimpor oleh Client Component. Tandai modul sensitif dengan `server-only` bila relevan.
- Dependency hanya bergerak ke dalam sesuai alur tersebut; hindari circular dependency dan import lintas layer yang melewati kontrak publik.

## 7. Arsitektur Frontend — MVVM dan Composition

### 7.1 Kontrak MVVM

MVVM di proyek ini adalah pemisahan tanggung jawab, bukan alasan membuat class atau abstraksi tambahan.

| Lapisan                | Lokasi utama                                         | Tanggung jawab                                                                                       | Dilarang                                                                                    |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Model**              | `src/models/`, pure `src/lib/`, DTO dari server      | Domain type, rule murni, mapper, formatter deterministik, dan representasi data                      | React hook/JSX, browser state, fetch tersembunyi, Prisma Client                             |
| **ViewModel**          | `src/hooks/use<Feature>ViewModel.ts`, provider fitur | State interaksi, derived UI state, event handler, koordinasi Action/API, dan API semantik untuk View | JSX, query Prisma, secret, authoritative business rule, duplikasi state server tanpa alasan |
| **View**               | `src/components/`, halaman interaktif                | Render props/state, semantic HTML, meneruskan event ke ViewModel, dan komposisi layout               | Business rule, fetch database, kalkulasi harga final, authorization                         |
| **Server composition** | Server Component di `src/app/`                       | Memanggil service untuk initial data, memetakan DTO serializable, menyusun View, metadata            | Menjadi ViewModel client, query Prisma langsung, business rule                              |

Aturan implementasi MVVM:

- View yang memiliki interaksi non-trivial memakai satu ViewModel dengan nama `use<Feature>ViewModel`; komponen presentasional sederhana tidak perlu ViewModel.
- ViewModel tidak merender JSX. Ia mengembalikan nilai dan action bernama berdasarkan intent, misalnya `isSubmitDisabled`, `selectVariant`, atau `submitCheckout`, bukan detail setter acak.
- ViewModel boleh melakukan validasi UX cepat, tetapi Server Action/service wajib memvalidasi dan menghitung ulang data otoritatif.
- Data awal datang dari Server Component sebagai DTO serializable. Jangan melakukan client refetch hanya untuk mengambil data yang sudah tersedia di server.
- State server, state URL, state form, dan state UI lokal harus dibedakan. Jangan menyalin props ke state tanpa kebutuhan sinkronisasi yang nyata.
- Derived state dihitung saat render/ViewModel. Jangan memakai `useEffect` untuk menyinkronkan state yang sebenarnya dapat diturunkan.
- Model dan rule murni harus dapat diuji tanpa React. ViewModel diuji sebagai perilaku state/interaksi; View diuji dari output dan aksi pengguna.
- Jika ViewModel mulai terlalu besar, pecah berdasarkan use case/domain, bukan berdasarkan satu hook untuk setiap field.

### 7.2 Atomic Design dan Batas Komponen

- `atoms/`: primitive visual terkecil seperti Button, Badge, Icon, Price; tidak mengetahui fitur bisnis.
- `molecules/`: kombinasi kecil atom untuk satu tugas UI seperti selector atau form field.
- `organisms/`: bagian halaman/fitur yang utuh dan boleh mengonsumsi ViewModel, misalnya ProductGrid atau CheckoutForm.
- `compound/`: keluarga komponen kompleks dengan API komposisional dan shared context; ini pola komposisi, bukan level Atomic Design.
- `providers/`: React context provider tingkat fitur/aplikasi (mis. `CartProvider`).
- `admin/`: komponen khusus area Owner (`/admin`), mis. `DataTable`, `StatCard`, `SalesChart`.
- `ui/`: primitif UI aksesibel (shadcn/Radix) yang dibungkus mengikuti design token.
- Page/layout menyusun organism dan Server Component; hindari markup fitur besar langsung di page.
- Jangan memecah komponen hanya demi jumlah baris. Ekstrak ketika ada tanggung jawab, reuse, state boundary, accessibility boundary, atau testing boundary yang jelas.
- Satu file komponen tidak boleh mencampur data access server, business rule, state orchestration, dan markup kompleks sekaligus.

### 7.3 Aturan Compound Components

Gunakan Compound Components hanya ketika komponen memiliki beberapa bagian yang:

- berbagi state/action yang sama;
- perlu disusun ulang atau dipilih oleh consumer;
- mengalami prop drilling; atau
- mulai memiliki banyak boolean prop/render prop untuk mengatur variasi.

Kontrak implementasinya:

- Sediakan Root/Provider dan subcomponent bernama jelas, misalnya `ProductCard.Root`, `ProductCard.Image`, `ProductCard.Actions`.
- Root/Provider adalah satu-satunya lapisan yang mengetahui implementasi state. Subcomponent hanya bergantung pada context interface.
- Tipe context dipisah menjadi `state`, `actions`, dan `meta` bila kompleks. Jangan mengekspos setter internal yang tidak diperlukan consumer.
- Custom context hook wajib gagal cepat dengan pesan jelas bila dipakai di luar Provider.
- Lift state ke Provider ketika sibling atau komponen di luar frame visual perlu mengakses state/action; jangan menyinkronkan state ke parent memakai `useEffect`.
- Utamakan `children` untuk komposisi struktur. Gunakan render prop hanya ketika parent memang harus mengirim data ke child.
- Hindari proliferasi boolean prop seperti `isCompact`, `isCheckout`, `showFooter`, dan kombinasi mode lain. Buat variant eksplisit yang menyusun subcomponent yang diperlukan.
- Jangan memakai Compound Components untuk Button, Badge, atau komponen sederhana yang cukup dengan props biasa.
- Provider tidak boleh menjadi global tanpa kebutuhan. Tempatkan boundary sedekat mungkin dengan consumer untuk membatasi render ulang.
- Context value harus stabil bila perlu; pisahkan context state/action jika perubahan state menyebabkan rerender luas yang terukur.
- Pertahankan semantics, keyboard behavior, focus management, dan ARIA pada Root/subcomponent agar consumer tidak dapat merusak aksesibilitas dasar.
- Untuk React 19, kode baru menerima `ref` sebagai prop tanpa `forwardRef`; gunakan API React 19 secara konsisten pada komponen yang disentuh tanpa melakukan refactor massal di luar scope.

### 7.4 Server/Client, UX, dan Performance

- Gunakan Server Component secara default. Tambahkan `"use client"` hanya jika komponen memerlukan state, effect, event browser, context, atau Web API.
- Ambil data sedekat mungkin dengan Server Component yang membutuhkannya dan hindari request waterfall; paralelkan operasi independen.
- Simpan state seminimal mungkin. Filter/sort/pagination yang perlu dibagikan atau di-refresh direpresentasikan di URL.
- Setiap halaman async wajib memiliki state loading, empty, error, dan success yang jelas.
- Error message harus membantu pengguna tanpa membocorkan stack trace, query, secret, atau detail internal.
- Gunakan semantic HTML terlebih dahulu; ARIA hanya melengkapi semantics yang belum tersedia. Target aksesibilitas proyek ini adalah **WCAG 2.2 AA** (kontras ≥ 4,5:1, fokus terlihat, `aria-live` untuk status/chat, dan `prefers-reduced-motion`).
- Semua interaksi wajib dapat digunakan dengan keyboard, memiliki focus state terlihat, label jelas, dan target sentuh memadai.
- Pertahankan urutan fokus dan pulihkan fokus setelah dialog/drawer ditutup.
- UI harus responsif minimal pada lebar 320, 390, 768, 1024, dan 1440 px tanpa overflow horizontal.
- Ikuti design token dan art direction yang sudah ada. Jangan menambah warna, spacing, shadow, atau typography arbitrer jika token yang tepat tersedia.
- Gunakan `next/image` dengan dimensi/`sizes` benar. Prioritaskan hanya aset above-the-fold yang benar-benar kritis.
- Gunakan `next/font`, metadata, canonical URL, JSON-LD, sitemap, dan robots secara konsisten untuk halaman publik terkait.
- Hindari dependency client besar, barrel import yang memperbesar bundle, render ulang tanpa kebutuhan, dan data berlebih di client.
- Jangan mengorbankan aksesibilitas demi animasi. Hormati `prefers-reduced-motion` dan hindari layout shift.

### 7.5 Konvensi Penamaan dan Bahasa

- **Bahasa:** Identifier kode (nama file, tipe, fungsi, variabel) memakai **bahasa Inggris**; dokumentasi (`prd/`, `docs/`, catatan teknis) memakai **bahasa Indonesia**; copy antarmuka pengguna (UI) untuk R0 memakai **bahasa Inggris** mengikuti D-03 melalui kamus/konstanta terpusat (`src/content/copy.ts` atau `src/lib/constants.ts`).
- **Penamaan file:** Komponen React memakai `PascalCase.tsx`; ViewModel hook memakai `use<Feature>ViewModel.ts`; modul server dan boundary memakai sufiks peran (`<domain>.service.ts`, `<domain>.repository.ts`, `<domain>.actions.ts`, `<domain>.schema.ts`, `<domain>.mapper.ts`). Ikuti panduan langkah per langkah di `docs/guides/02-feature-recipe.md`.

## 8. Arsitektur Backend, Database, dan Prisma

### 8.1 Tanggung Jawab Modul

- `src/actions/`: boundary mutasi UI; auth, parse, validasi Zod, panggil satu use case service, map hasil, lalu revalidate cache terkait.
- `src/app/api/**/route.ts`: boundary HTTP untuk webhook, cron, stream, search, dan integrasi; tidak menyimpan business rule.
- `src/validators/`: schema input/output boundary dan normalisasi dasar; tidak melakukan query database.
- `src/server/services/`: seluruh business rule, authorization resource, transaction boundary, idempotency, dan domain event.
- `src/server/repositories/`: query Prisma yang eksplisit per use case; tidak melakukan authorization atau keputusan bisnis.
- `src/server/integrations/`: implementasi adapter AI, Telegram, payment, shipping, dan storage; tidak dipanggil langsung dari UI.
- `src/server/db/`: Prisma client singleton dan utilitas transaction; tidak berisi use case.
- `src/server/lib/`: typed error, logger, rate limit, idempotency helper, dan utilitas server lintas domain.
- `src/models/`: domain type, rule murni, dan mapper; tidak bergantung pada framework atau database client.

Jangan membuat generic base repository/service yang menyembunyikan query atau business rule. Gunakan method berbasis use case seperti `findPublishedBySlug`, `reserveStock`, atau `createOrder`, bukan wrapper CRUD generik.

### 8.2 Alur Wajib Setiap Request/Mutation

1. Boundary memperoleh session/identity dari server; jangan menerima identitas otoritatif dari payload client.
2. Parse dan validasi input dengan Zod, termasuk limit, enum, format, dan field tak dikenal.
3. Panggil service dengan input terketik dan `AuthContext` minimum yang diperlukan.
4. Service memeriksa role/ownership, mengambil data, menerapkan business rule, dan membuka transaction jika operasi harus atomik.
5. Repository menjalankan query melalui Prisma/`Prisma.TransactionClient` yang diberikan service.
6. Service menghasilkan domain result/DTO aman dan mencatat domain/audit event setelah state bisnis valid.
7. Boundary memetakan `AppError` ke response/action state konsisten dan melakukan cache revalidation yang tepat.

Boundary tidak boleh memanggil repository atau Prisma langsung. Service tidak boleh mengetahui `Request`, `Response`, React, redirect, cookie UI, atau status HTTP.

### 8.3 Transaction, Query, dan Konsistensi Data

- Transaction dimiliki service/use case. Repository harus menerima transaction client agar semua query terkait berada dalam transaction yang sama.
- Jangan membuka transaction terpisah di repository ketika dipanggil dari transaction service.
- Gunakan transaction untuk checkout, reservasi/pengurangan stok, Order/OrderItem/Payment, perubahan status, dan audit/event yang harus atomik.
- Lindungi stok dari race condition dengan conditional update/locking yang didukung strategi Prisma/PostgreSQL; kegagalan satu langkah harus rollback.
- Endpoint/action yang dapat diulang wajib idempotent, terutama checkout, payment, webhook, cron, dan notifikasi.
- Gunakan unique/check/foreign-key constraint sebagai pertahanan terakhir, bukan hanya pemeriksaan aplikasi.
- Setiap perubahan schema wajib memiliki migration yang dapat direview, rencana backfill bila perlu, dan rollback/forward-fix yang dijelaskan di feature doc.
- Pilih field yang diperlukan dengan `select`; cegah N+1 dan hindari over-fetching/serialisasi relasi besar.
- Semua daftar yang dapat membesar wajib memiliki pagination, limit maksimum, sorting deterministik, serta filter tervalidasi.
- Tambahkan index berdasarkan pola query nyata dan dokumentasikan alasannya; pertimbangkan biaya write dan ukuran index.
- Hitung harga, diskon, ongkir, total, dan stok ulang di server dari data PostgreSQL. Jangan percaya nilai dari client.
- Gunakan `Decimal`/minor unit yang konsisten untuk uang dan definisikan aturan pembulatan.
- Jangan membuat fallback ke mock ketika database gagal. Kembalikan error terkontrol dan observable.

### 8.4 Integrasi, Cache, dan Reliability

- Integrasi eksternal berada di balik interface yang dimiliki aplikasi, bukan tipe SDK provider.
- Adapter wajib memiliki timeout, typed error mapping, retry terbatas dengan backoff hanya untuk operasi aman, dan deduplication bila relevan.
- Kegagalan notifikasi/Telegram setelah transaksi tidak boleh membatalkan order yang sudah commit; simpan status untuk retry.
- Gunakan `src/proxy.ts` (konvensi Next.js 16 pengganti `middleware.ts`) hanya sebagai lapisan awal redirect autentikasi (`/admin`, `/account`); otorisasi sesungguhnya wajib di service layer.
- Cache hanya data yang aman dan pahami invalidasinya. Pada Next.js 16, gunakan `updateTag(tag)` di **Server Actions** agar mutasi langsung terlihat (_read-your-own-writes_), dan `revalidateTag(tag, "max")` di **Route Handlers**/webhook.
- Tangani error database secara spesifik dan map ke error domain/API aman; jangan menelan error.
- Gunakan structured logging dengan `requestId`/correlation ID dan redaction; jangan log payload sensitif.

## 9. API dan Error Handling

- Gunakan kontrak response yang konsisten sesuai `prd/11-api-spec.md`.
- Gunakan status HTTP sesuai makna; jangan mengembalikan `200` untuk kegagalan bisnis.
- Pisahkan error validasi, unauthorized, forbidden, not found, conflict, rate limit, dan internal error.
- Pesan untuk client harus stabil dan aman; detail teknis masuk ke structured log server.
- Jangan mengekspos stack trace, SQL, token, password hash, environment variable, atau data pribadi.
- Perubahan kontrak API harus backward-compatible bila memungkinkan dan disertai pembaruan tipe, dokumentasi, serta test.

## 10. Security dan Privacy

- Terapkan secure-by-default dan least privilege.
- Secret hanya berada di environment server dan tidak boleh memakai prefix publik.
- Password wajib di-hash dengan algoritma yang sesuai PRD; jangan pernah disimpan atau dicatat dalam bentuk plaintext.
- Gunakan cookie session yang `HttpOnly`, `Secure` pada production, dan `SameSite` yang sesuai.
- Lindungi mutasi dari CSRF: Server Actions mengandalkan pemeriksaan `Origin` bawaan Next.js (jangan dinonaktifkan); Route Handler yang menerima mutasi berbasis sesi cookie wajib memeriksa header `Origin`/`Host` terhadap origin yang diizinkan.
- Terapkan rate limiting pada login, registrasi, assistant, search sensitif, webhook, dan endpoint abuse-prone.
- Verifikasi signature webhook dan lindungi terhadap replay sebelum memproses payload.
- Sanitize/escape konten pengguna sesuai output context untuk mencegah XSS; jangan memakai `dangerouslySetInnerHTML` tanpa sanitizer dan alasan kuat.
- Jangan membuat query dari string mentah. Gunakan Prisma parameterized query; raw query hanya bila perlu dan tetap terparameterisasi.
- Structured log tidak boleh berisi password, token, cookie, authorization header, payment detail sensitif, atau PII yang tidak dibutuhkan.
- Catat audit event untuk aksi Owner dan perubahan status penting sesuai PRD.

## 11. Performance dan Reliability

- Ukur sebelum melakukan optimasi kompleks. Jangan menukar correctness dengan mikro-optimasi.
- Kurangi jumlah query, payload, JavaScript client, dan pekerjaan render sebelum menambah cache.
- Gunakan concurrency hanya untuk pekerjaan yang independen; jangan membuat race condition.
- Operasi jaringan/database harus memiliki batas waktu dan kegagalan yang dapat ditangani.
- Pastikan loading tidak menggantung dan tombol submit mencegah pengiriman ganda tanpa menghilangkan idempotency server.
- Gunakan lazy loading/code splitting untuk fitur berat non-kritis.
- Pertahankan deterministic behavior pada sorting, pagination, money calculation, time zone, dan locale.
- Gunakan integer minor unit atau `Decimal` yang tepat untuk uang; jangan memakai floating-point biasa untuk perhitungan finansial.

## 12. Testing

- Setiap bugfix harus memiliki regression test bila memungkinkan.
- Uji business rule murni dengan unit test yang cepat dan deterministik.
- Uji repository, migration, constraint, dan transaction terhadap PostgreSQL test database, bukan mock yang menyembunyikan perilaku database.
- Uji integration boundary untuk auth, authorization, validation, error mapping, idempotency, serta adapter eksternal.
- Uji alur kritis dengan Playwright: browse produk dari DB, auth, bag, checkout, stok, order, dan Owner flow.
- Sertakan negative test: input tidak valid, belum login, role salah, resource milik pengguna lain, stok habis, duplicate submit, dan provider gagal.
- Untuk perubahan UI, uji keyboard, focus, responsive layout, loading/error/empty state, dan accessibility scan.
- Test harus menguji perilaku yang terlihat, bukan detail implementasi rapuh.
- Dilarang menghapus, skip, atau melemahkan test hanya agar pipeline hijau tanpa menjelaskan akar masalah.

## 13. Quality Gates

Jalankan pemeriksaan yang sudah aktif sebelum menyatakan selesai:

```bash
pnpm check    # menjalankan pnpm lint && pnpm format:check && pnpm typecheck
pnpm build
```

Status tooling saat ini:

| Pemeriksaan                                                                    | Status        | Keterangan                                   |
| ------------------------------------------------------------------------------ | ------------- | -------------------------------------------- |
| `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm check`, `pnpm build` | **Aktif**     | Wajib lulus di setiap PR                     |
| `pnpm test` (Vitest unit + integrasi), `pnpm test:e2e` (Playwright + axe)      | **Target P1** | Aktif setelah harness Foundation P1 dipasang |
| `pnpm jscpd`, `pnpm knip`, `pnpm db:migrate`, `pnpm db:seed`                   | **Target P1** | Aktif setelah tooling Foundation P1 dipasang |

Untuk perubahan berisiko tinggi atau lintas lapisan, jalankan seluruh quality gate yang tersedia. Jika sebuah command belum tersedia atau tidak dapat dijalankan, jelaskan penyebab dan apa yang belum terverifikasi secara jujur.

## 14. Definition of Done

Sumber kebenaran tunggal Definition of Done adalah **`prd/16-roadmap-risk.md` §Y**, ditambah kewajiban dokumentasi fitur pada §16 di bawah ini:

- Seluruh Acceptance Criteria FR terkait terpenuhi end-to-end (happy path, negative/error state, otorisasi, dan tidak ada mock/seed sebagai fallback runtime).
- Seluruh quality gate yang aktif (`pnpm check`, `pnpm build`, serta test terkait setelah P1) lulus tanpa error/warning baru dan tanpa explicit `any`.
- Perubahan database memiliki migration dan strategi data yang aman sesuai `docs/guides/03-database-workflow.md`.
- `docs/features/<feature-slug>.md` dibuat/diperbarui memakai slug resmi dari `docs/features/README.md`, statusnya akurat, dan hanya mencatat hasil validasi yang benar-benar dijalankan.
- PRD diperbarui bila keputusan produk atau kontrak sumber kebenaran berubah; tidak ada pekerjaan wajib yang disembunyikan sebagai placeholder.

## 15. Larangan Keras

- Jangan gunakan mock data atau seed sebagai runtime fallback.
- Jangan query database langsung dari Client Component, page, Route Handler, atau Server Action.
- Jangan menaruh business logic atau authorization hanya di UI.
- Jangan mempercayai total harga, role, user ID, atau status dari client.
- Jangan menonaktifkan type checking, lint rule, security control, atau test untuk mempercepat penyelesaian.
- Jangan hardcode secret, credential, URL environment-specific, atau data sensitif.
- Jangan melakukan destructive database/file operation tanpa konfirmasi dan target yang terverifikasi.
- Jangan mengklaim sudah diuji bila command atau skenario tersebut belum benar-benar dijalankan.

## 16. Dokumentasi Wajib per Fitur

Setiap fitur baru dan setiap perubahan perilaku fitur wajib memiliki satu dokumen hidup di `docs/features/<feature-slug>.md`. Gunakan `docs/features/_template.md` dan ikuti indeks serta aturan pada `docs/features/README.md`.

### 16.1 Lifecycle Dokumen

1. Sebelum coding, buat dokumen dengan status `DRAFT`, referensi PRD/FR, masalah, scope, non-scope, user story, dan acceptance criteria.
2. Sebelum memilih arsitektur, isi pemetaan MVVM, keputusan Compound Components, alur backend, kontrak API/Action, serta dampak database.
3. Selama implementasi, perbarui file terdampak, keputusan, trade-off, risiko, edge case, dan test plan. Jangan biarkan dokumen menjadi rencana lama yang tidak cocok dengan kode.
4. Setelah implementasi, catat hasil command/test yang benar-benar dijalankan dan risiko tersisa.
5. Ubah status ke `DONE` hanya jika Definition of Done terpenuhi. Gunakan `IN_PROGRESS` jika masih ada implementasi atau verifikasi wajib.

### 16.2 Isi Minimum

Feature doc minimal harus menjawab:

- Masalah apa yang diselesaikan dan outcome apa yang diharapkan?
- Apa yang masuk dan tidak masuk scope?
- Acceptance criteria apa yang dapat diuji?
- Bagaimana pemetaan Model, ViewModel, View, Server Component, dan component composition?
- Apakah Compound Components diperlukan? Jika ya, apa kontrak Provider/context/subcomponent-nya?
- Bagaimana alur Action/Handler → Service → Repository → Prisma → PostgreSQL?
- Di mana authentication, authorization, validation, transaction, idempotency, dan audit diterapkan?
- Apa perubahan schema, migration, constraint, index, backfill, serta strategi rollback/forward-fix?
- Apa kontrak input/output/error API atau Server Action?
- Apa risiko security, privacy, performance, caching, concurrency, dan external provider?
- Test apa yang membuktikan happy path, negative path, accessibility, dan tidak ada regresi?
- Validasi apa yang benar-benar dijalankan dan apa yang belum terverifikasi?

### 16.3 Menjaga Sumber Kebenaran

- PRD tetap menjadi sumber kebenaran kebutuhan dan keputusan produk.
- Feature doc adalah sumber kebenaran desain serta bukti implementasi fitur tertentu.
- Kode dan migration adalah sumber kebenaran perilaku teknis yang berjalan; bila berbeda dari feature doc, selesaikan ketidaksesuaiannya dalam perubahan yang sama.
- Jangan menyalin seluruh PRD ke feature doc. Tautkan bagian terkait dan dokumentasikan hanya detail implementasi serta keputusan spesifik fitur.
- Jangan memasukkan secret, token, credential, data pelanggan, atau payload produksi ke dokumentasi.
- Perubahan typo/formatting murni tidak membutuhkan feature doc baru. Bugfix memperbarui feature doc terkait jika mengubah perilaku, kontrak, risiko, atau skenario pengujian.

## 17. Kolaborasi Tim Multi-Developer

Project ini dikerjakan oleh **3 developer** secara paralel setelah Foundation P1. Ikuti aturan lengkap di [CONTRIBUTING.md](CONTRIBUTING.md), [docs/team/ownership.md](docs/team/ownership.md), dan [docs/guides/03-database-workflow.md](docs/guides/03-database-workflow.md):

1. **Hormati batas lane:** Bekerjalah hanya pada branch fitur dan folder lane Anda; tag pemilik lane terkait jika terpaksa menyentuh modul lain.
2. **Jangan ubah kontrak bersama di PR fitur:** Perubahan `prisma/schema.prisma`, `ErrorCode`/`ActionResult`, `AuthContext`, `env.ts`, atau design token wajib melalui PR terpisah berlabel `contract` setelah disepakati tim.
3. **Patuhi protokol Prisma migration:** Satu PR maksimal satu migration baru, wajib rebase terhadap `origin/develop` sebelum menjalankan `prisma migrate dev`, dan dilarang keras mengedit migration yang sudah di-merge (termasuk lewat `git stash apply`). Gunakan _forward migration_ baru untuk koreksi skema pasca-merge.
4. **Gunakan registry slug resmi:** Selalu pakai slug pada `docs/features/README.md` agar tidak tercipta dua dokumen fitur untuk satu kebutuhan yang sama.
5. **SOP Review Branch Rekan:** Saat me-review branch PR rekan, jangan mengedit atau meng-commit langsung di branch rekan tanpa izin, dan jangan me-merge PR di GitHub sebelum status check CI (`Quality Gate`) hijau. Perbaikan pasca-merge wajib dilakukan di branch `fix/*` yang dibuat dari `develop` terbaru.
