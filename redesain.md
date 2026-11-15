# APEX WEBSITE — MAJOR VISUAL REDESIGN

Implementasi redesign sebelumnya sudah selesai, tetapi hasilnya masih terlalu mirip dengan desain awal. Perubahan visual yang dilakukan belum cukup signifikan.

Saya ingin kamu melakukan **major visual redesign**. Jangan hanya memperbaiki styling yang sudah ada. Evaluasi kembali keseluruhan tampilan dan berani mengubah pendekatan visual, komposisi, serta layout setiap halaman.

## 1. Tujuan Utama

Buat website APEX yang memiliki karakter visual kuat sebagai brand premium outdoor technical apparel.

Hasil akhirnya harus terasa seperti website yang benar-benar dirancang ulang, bukan versi lama yang hanya dipoles.

Prioritaskan perubahan pada:

- Layout dan komposisi setiap section.
- Proporsi dan penempatan elemen.
- Typography dan visual hierarchy.
- Penggunaan whitespace.
- Skala, cropping, dan presentasi fotografi.
- Product presentation dan product card.
- Header, navigasi, serta footer.
- Hubungan visual dan transisi antarseksi.

**Jangan mempertahankan layout lama hanya karena implementasinya sudah tersedia.** Jika suatu komposisi tidak lagi relevan dengan arah desain baru, bangun ulang.

## 2. Arah Art Direction

Eksplorasi visual premium outdoor technical apparel dengan pendekatan Swiss Editorial dan High-Altitude Technical Apparel.

Gunakan referensi berikut sebagai inspirasi prinsip desain:

- Arc'teryx: technical product presentation dan visual hierarchy.
- Goldwin 0: editorial composition, typography, dan art direction.
- Mammut Eiger Extreme: karakter technical outdoor apparel.
- Patagonia: photography dan storytelling.

Jangan menyalin desain mereka. Bangun identitas visual APEX sendiri.

## 3. Eksplorasi Visual

Jangan terpaku pada pola ecommerce konvensional.

Eksplorasi:

- Editorial layout yang asimetris dan dinamis.
- Komposisi gambar berukuran besar sebagai focal point.
- Typography yang kuat dan memiliki karakter.
- Variasi komposisi antarseksi agar tidak monoton.
- Product showcase yang lebih artistik dan premium.
- Perpaduan ruang kosong, teks, dan fotografi yang seimbang.
- Layout yang memiliki ritme visual dan storytelling.
- Detail visual yang mendukung identitas technical outdoor apparel.

Setiap section tidak harus menggunakan pola layout yang sama. Berikan karakter sesuai fungsi dan kontennya.

## 4. Pertahankan Konten dan Aset

Ini merupakan batasan wajib:

- Pertahankan seluruh teks dan konten yang sudah ada secara verbatim.
- Pertahankan seluruh gambar dan aset asli.
- Jangan menggunakan AI-generated images, stock images, atau gambar eksternal.
- Jangan menghapus informasi produk, harga, deskripsi, maupun promosi.
- Jangan membuat label, informasi, atau CTA baru yang tidak tersedia dalam konten asli.
- Perubahan cropping, rasio, ukuran, dan posisi gambar diperbolehkan selama tetap menggunakan aset asli.

## 5. Batasan Teknis

- Seluruh pekerjaan dilakukan pada branch `develop`.
- Jangan mengubah atau melakukan commit ke branch `master`.
- Pertahankan framework, library, arsitektur, dan struktur project yang masih relevan.
- Jangan mengubah API, business logic, database, integrasi, maupun fungsi yang sudah berjalan.
- Gunakan kembali design tokens, theme, constants, dan komponen yang tersedia jika masih sesuai.
- Hindari hardcoding nilai yang seharusnya menggunakan sistem desain.
- Jangan menambahkan dependency tanpa kebutuhan yang jelas.
- Hindari refactor besar yang tidak berhubungan dengan redesign.

Jika struktur komponen lama membatasi hasil visual, susun ulang presentasinya tanpa merusak fungsi yang sudah ada.

## 6. Hindari Hasil yang Generik

Jangan menghasilkan tampilan seperti template ecommerce biasa atau desain generik hasil AI.

Hindari:

- Card dengan bentuk dan komposisi yang terus berulang.
- Layout yang monoton.
- Terlalu banyak rounded card.
- Badge dan dekorasi yang tidak diperlukan.
- Gradient, shadow, dan animasi berlebihan.
- Elemen visual yang tidak memiliki tujuan.
- Penggunaan warna sebagai satu-satunya bentuk perubahan desain.

Jangan memaksakan satu pola desain untuk seluruh halaman.

## 7. Responsive Design

Pastikan pendekatan desain tetap konsisten dan dirancang dengan baik pada desktop, laptop, tablet, dan mobile.

Jangan hanya mengecilkan layout desktop untuk mobile. Atur ulang komposisi sesuai kebutuhan setiap ukuran layar.

## 8. Workflow Implementasi

Sebelum melakukan perubahan:

1. Periksa branch aktif dan pastikan berada di `develop`.
2. Evaluasi hasil implementasi redesign saat ini.
3. Identifikasi bagian yang masih terlalu mirip dengan desain awal.
4. Tentukan perubahan komposisi dan pendekatan visual yang diperlukan.
5. Periksa kembali konten, aset, dan fungsi yang harus dipertahankan.

Kemudian implementasikan redesign secara menyeluruh.

Jangan berhenti pada perubahan warna, spacing, atau typography saja. Lakukan perubahan layout dan komposisi yang benar-benar terlihat.

Setelah implementasi:

- Periksa seluruh halaman yang terdampak.
- Pastikan tidak ada konten atau aset yang hilang.
- Pastikan seluruh fungsi tetap berjalan.
- Periksa responsive layout.
- Jalankan lint, typecheck, dan build menggunakan script yang tersedia di project.

## TARGET AKHIR

Ketika website sebelum redesign dan hasil terbaru ditampilkan berdampingan, perbedaan visualnya harus langsung terlihat.

Saya ingin APEX memiliki art direction yang matang, komposisi editorial yang kuat, presentasi produk premium, serta identitas visual outdoor technical apparel yang konsisten.

**Jangan sekadar mempercantik desain lama. Rancang ulang pengalaman visualnya.**
