# Firebase Realtime Database

Integrasi realtime menyimpan profil pada `users/{user-id}` dan order pada `orders/{user-id}/{order-id}`.
Keunikan username dijamin oleh Firebase Authentication melalui email internal `username@accounts.umadigi.store`.
Status dapat diubah dari Firebase Console dan akan tampil otomatis di halaman `pages/riwayat.html`.

## Aktivasi

1. Buka Firebase Console untuk project `umadigi-store`.
2. Aktifkan **Realtime Database**.
3. Di **Authentication > Sign-in method**, aktifkan provider **Email/Password**. Pengguna tetap tidak memasukkan email; aplikasi memakai email internal berdasarkan username (`username@accounts.umadigi.store`).
4. Di **Realtime Database > Rules**, gunakan rules berikut:

```json
{
  "rules": {
    "orders": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$orderId": {
          ".write": "auth != null && auth.uid === $uid"
        }
      },
      ".indexOn": ["username"]
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

5. Setelah order dikirim, ubah field `status` menjadi `Pending`, `Diproses`, atau `Selesai`.

Jika Firebase belum aktif atau koneksi gagal, order tetap tampil dari `localStorage`. Bukti pembayaran tetap dikirim melalui WhatsApp; file bukti tidak diunggah ke Firebase pada versi ini.