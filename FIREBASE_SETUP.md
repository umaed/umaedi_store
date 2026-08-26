# Firebase Realtime Database

Integrasi realtime menyimpan order pada path `orders/{anonymous-user-id}/{order-id}`.
Status dapat diubah dari Firebase Console dan akan tampil otomatis di halaman `pages/riwayat.html`.

## Aktivasi

1. Buka Firebase Console untuk project `umadigi-store`.
2. Aktifkan **Realtime Database**.
3. Di **Authentication > Sign-in method**, aktifkan provider **Anonymous**.
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
      }
    }
  }
}
```

5. Setelah order dikirim, ubah field `status` menjadi `Pending`, `Diproses`, atau `Selesai`.

Jika Firebase belum aktif atau koneksi gagal, order tetap tampil dari `localStorage`. Bukti pembayaran tetap dikirim melalui WhatsApp; file bukti tidak diunggah ke Firebase pada versi ini.