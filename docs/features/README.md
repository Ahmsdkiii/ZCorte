# Dokumentasi Fitur ZCorté

Folder ini menyimpan catatan implementasi per fitur. Dokumen fitur menjembatani PRD dengan kode: PRD tetap menjadi sumber kebenaran produk, sedangkan file di sini menjelaskan scope teknis, keputusan arsitektur, kontrak, dan bukti validasi implementasinya.

## Aturan Penggunaan

1. Untuk setiap fitur baru atau perubahan perilaku fitur, salin `_template.md` menjadi `<feature-slug>.md` dengan nama `kebab-case`.
2. Buat dokumen berstatus `DRAFT` sebelum implementasi agar scope dan acceptance criteria jelas.
3. Cantumkan referensi PRD/FR yang relevan. Feature doc tidak boleh mengubah keputusan produk secara diam-diam.
4. Perbarui dokumen dalam perubahan yang sama ketika kontrak, schema, flow, risiko, atau test berubah.
5. Satu fitur memiliki satu dokumen utama. Perluasan fitur memperbarui dokumen yang sama; jangan membuat dokumen duplikat dengan nama berbeda.
6. Ubah status menjadi `DONE` hanya setelah acceptance criteria dan quality gates relevan telah diverifikasi.

## Kapan Wajib Dibuat

Feature doc wajib untuk:

- fitur baru frontend, backend, atau end-to-end;
- perubahan perilaku pengguna atau aturan bisnis;
- endpoint/Server Action baru atau perubahan kontrak;
- perubahan schema, migration, transaction, authorization, atau integrasi eksternal;
- refactor arsitektur yang mengubah dependency atau tanggung jawab layer.

Perbaikan typo, formatting, atau housekeeping murni tidak memerlukan dokumen baru. Bugfix harus memperbarui feature doc terkait jika mengubah perilaku, kontrak, risiko, atau skenario pengujian.

## Alur Kerja

```text
PRD/FR → Feature Doc (DRAFT) → Implementasi → Test/Validasi → Feature Doc (DONE)
```

Gunakan [`_template.md`](_template.md) dan hapus instruksi placeholder yang tidak relevan setelah dokumen diisi.

## Indeks Fitur

Tambahkan setiap dokumen fitur ke tabel berikut.

| Fitur | Status | Referensi PRD | Terakhir diperbarui |
|---|---|---|---|
| Belum ada | — | — | — |
