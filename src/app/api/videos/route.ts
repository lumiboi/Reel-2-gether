// src/app/api/videos/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // 'public/havuz' klasörünün yolunu bul
  const poolDirectory = path.join(process.cwd(), 'public/havuz');

  try {
    // Klasördeki tüm dosyaların adlarını oku
    const filenames = fs.readdirSync(poolDirectory);

    // Sadece .mp4 ile biten dosyaları filtrele
    const videos = filenames.filter((file) => file.endsWith('.mp4'));

    // Video listesini JSON formatında geri gönder
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Havuz klasörü okunurken hata oluştu:", error);
    return NextResponse.json(
      { error: 'Videolar listelenemedi.' },
      { status: 500 }
    );
  }
}