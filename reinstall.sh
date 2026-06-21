#!/bin/bash

# Emira Motors Production Clean Reinstall Script
echo "--------------------------------------------------------"
echo "♻️ Emira Motors Sıfırdan Temiz Kurulum Başlatıldı..."
echo "--------------------------------------------------------"

# 1. Veri tabanını (db.json) yedekle
if [ -f "src/data/db.json" ]; then
    echo "💾 Canlı veri tabanı geçici belleğe yedekleniyor..."
    cp src/data/db.json /tmp/emira_motors_db_live.json
    HAS_DB_BACKUP=true
else
    echo "⚠️ Canlı veri tabanı dosyası bulunamadı, yedekleme atlanıyor."
    HAS_DB_BACKUP=false
fi

# 2. Yerel git değişikliklerini ve çakışmaları sıfırla
echo "🧹 Yerel git çakışmaları temizleniyor..."
git reset --hard HEAD
git clean -fd

# 3. GitHub'dan en güncel kodları çek
echo "📥 Güncel kodlar GitHub'dan çekiliyor..."
git pull origin main

# 4. Veri tabanını yedekten geri yükle
if [ "$HAS_DB_BACKUP" = true ]; then
    echo "♻️ Canlı veri tabanı yedekten geri yükleniyor..."
    mkdir -p src/data
    cp /tmp/emira_motors_db_live.json src/data/db.json
    chmod 666 src/data/db.json
    rm /tmp/emira_motors_db_live.json
fi

# 5. node_modules ve .next klasörlerini tamamen sil
echo "🗑️ Eski kütüphaneler (node_modules) ve derleme klasörü (.next) siliniyor..."
rm -rf node_modules
rm -rf .next

# 6. Bağımlılıkları temiz bir şekilde kur
echo "📦 Kütüphaneler sıfırdan kuruluyor..."
npm install

# 7. Projeyi production için derle
echo "🛠️ Proje derleniyor (Next.js Build)..."
npm run build

# 8. PM2 sürecini sil ve sıfırdan ayağa kaldır (Önbellekleme sorununu tamamen çözer)
echo "🔄 PM2 süreci temizlenip sıfırdan başlatılıyor..."
pm2 delete all 2>/dev/null
pm2 start npm --name "emira-motors" -- start

echo "--------------------------------------------------------"
echo "✅ Sıfırdan temiz kurulum tamamlandı ve site yayında!"
echo "--------------------------------------------------------"
