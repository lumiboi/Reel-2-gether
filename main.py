# main.py (Nihai ve Basitleştirilmiş Versiyon)

import os
import shutil
import time
import config # Artık aynı klasörde olduğu için sorunsuz bulacak
from instagrapi import Client
from rich import print

# --- BOT BAŞLANGICI ---

print("[cyan]Instagram Reel İndirme Botu Başlatılıyor...[/cyan]")

# Gerekli klasörlerin var olduğundan emin ol
if not os.path.exists(config.DOWNLOAD_FOLDER):
    os.makedirs(config.DOWNLOAD_FOLDER)
if not os.path.exists(config.FINAL_POOL_FOLDER):
    os.makedirs(config.FINAL_POOL_FOLDER)

api = Client()

# --- GİRİŞ ---
try:
    print(f"[yellow]'{config.INSTAGRAM_USERNAME}' olarak giriş yapılıyor...[/yellow]")
    
    # Session dosyası artık ana dizinde aranacak
    session_file = f"{config.INSTAGRAM_USERNAME}.json"
    if os.path.exists(session_file):
        api.load_settings(session_file)
        api.login(config.INSTAGRAM_USERNAME, config.INSTAGRAM_PASSWORD)
        api.get_timeline_feed()
    else:
        api.login(config.INSTAGRAM_USERNAME, config.INSTAGRAM_PASSWORD)
        api.dump_settings(session_file)
        
    print("[green]Giriş başarılı![/green]")
except Exception as e:
    print(f"[red]HATA: Giriş başarısız oldu. Sebep: {e}[/red]")
    exit()

# --- REELS ÇEKME VE İNDİRME ---
try:
    print(f"\n[cyan]'{config.TARGET_USERNAME}' hedefinden son {config.REELS_TO_DOWNLOAD} Reels çekiliyor...[/cyan]")
    
    target_user_id = api.user_id_from_username(config.TARGET_USERNAME)
    reels = api.user_clips(target_user_id, amount=config.REELS_TO_DOWNLOAD)
    
    if not reels:
        print(f"[yellow]'{config.TARGET_USERNAME}' kullanıcısının hiç Reels videosu bulunamadı.[/yellow]")
        exit()

    print(f"[green]Toplam {len(reels)} adet Reels bulundu. İndirme başlıyor...[/green]")

    indirilen_sayisi = 0
    for reel in reels:
        dosya_adi = f"{reel.code}.mp4"
        hedef_dosya_yolu = os.path.join(config.FINAL_POOL_FOLDER, dosya_adi)

        if os.path.exists(hedef_dosya_yolu):
            print(f"-> {dosya_adi} zaten havuzda mevcut, atlanıyor.")
            continue

        try:
            print(f"-> {reel.code} indiriliyor...")
            
            # Videoyu indir ve yolunu al
            indirilen_path = api.clip_download(reel.pk, folder=config.DOWNLOAD_FOLDER)
            
            # İndirilen videoyu bizim havuz klasörümüze, temiz bir adla taşı
            shutil.move(indirilen_path, hedef_dosya_yolu)
            
            print(f"   [green]✓ {dosya_adi} başarıyla havuz klasörüne taşındı.[/green]")
            indirilen_sayisi += 1
        except Exception as e:
            print(f"   [red]HATA: {reel.code} indirilirken: {e}[/red]")
        
        time.sleep(5)

    print(f"\n[bold green]İşlem tamamlandı! {indirilen_sayisi} adet yeni Reels havuza eklendi.[/bold green]")

    if os.path.exists(config.DOWNLOAD_FOLDER):
        shutil.rmtree(config.DOWNLOAD_FOLDER)
        print("[yellow]Geçici dosyalar temizlendi.[/yellow]")
except Exception as e:
    print(f"[bold red]BEKLENMEDİK BİR HATA OLUŞTU: {e}[/bold red]")