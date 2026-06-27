# LintasPay Tech Test

Dashboard Disbursement menggunakan Next.js 14 (Pages Router), TypeScript, TanStack Query, React Hook Form, Zod, Axios, JOSE, dan Tailwind CSS.

---

## Tech Stack

- Next.js 14 (Pages Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- React Hook Form
- Zod
- JOSE (JWT encode & decode)
- Radix UI

---

## Cara Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi akan berjalan di:

```
http://localhost:3000
```

---

## Environment Variable

Buat file `.env.local`

```env
NEXT_PUBLIC_API_URL=YOUR_API_URL
NEXT_PUBLIC_JWT_SECRET=YOUR_SECRET_KEY
```

---

## Kredensial Login

### Admin

```
Username : admin
Password : admin123
```

### Operator

```
Username : operator
Password : operator123
```

---

## Fitur yang Berhasil Diimplementasikan

### Authentication

- Login dengan validasi lokal
- JWT menggunakan JOSE
- JWT disimpan pada Cookie
- Redirect otomatis setelah login
- Redirect ke dashboard jika JWT masih valid
- Logout
- Protected Route
- Validasi JWT (missing, invalid, expired)
- Axios Interceptor untuk menangani response 401

### Dashboard Transaksi

- Server-side pagination
- Search berdasarkan sender name
- Filter berdasarkan status
- Informasi jumlah data yang ditampilkan
- Loading state
- Empty state
- Error state

### Create Transaction (Operator)

- Validasi menggunakan React Hook Form + Zod
- Perhitungan `admin_fee` otomatis di frontend
- Status otomatis `PENDING`
- Loading state saat submit
- Reset form setelah berhasil
- Toast success & error
- Query invalidation setelah create

### Update Status (Admin)

- Approve / Reject hanya dapat dilakukan oleh Admin
- Tombol hanya muncul untuk transaksi dengan status `PENDING`
- Dialog konfirmasi sebelum update
- Query invalidation setelah update
- Toast success & error

### Detail Transaksi

- Modal detail transaksi
- Menggunakan endpoint `GET /transactions/:id`
- Menampilkan seluruh informasi transaksi
- Menampilkan `-` apabila note kosong

### Role Based UI

- Operator tidak dapat melihat tombol Approve / Reject
- Admin tidak dapat melihat tombol Create Transaction

### Utilities

- Format Rupiah
- Format Tanggal

---

## Fitur Bonus

- Persist filter ke URL Query String sehingga filter tetap aktif setelah halaman di-refresh
- Skeleton Loading pada modal detail transaksi

---

## Struktur Project

```
components/
constant/
context/
data/
hooks/
lib/
pages/
schemas/
services/
types/
utils/
```

---

## Catatan Penggunaan AI

Selama proses pengerjaan, AI digunakan sebagai alat bantu untuk mempercepat pengembangan, eksplorasi solusi, dan melakukan review implementasi.

Beberapa area yang dibantu AI antara lain:

- Diskusi arsitektur project
- Penyusunan struktur folder
- Review implementasi TanStack Query
- Review Authentication Flow (JWT, Protected Route, Axios Interceptor)
- Review TypeScript typing
- Review React best practices
- Penyusunan beberapa boilerplate komponen

Seluruh kode yang dihasilkan AI telah ditinjau kembali, disesuaikan dengan kebutuhan project, diuji secara manual, serta dipahami sebelum digunakan.
