#!/bin/bash

# Emira Motors Production Safe Update Script
echo "----------------------------------------------"
echo "🚀 Emira Motors Canlı Sürüm Güncellemesi Başlatıldı..."
echo "----------------------------------------------"

# 1. Veri tabanını (db.json) yedekle (Çakışmada silinmesini veya sıfırlanmasını önlemek için)
if [ -f "src/data/db.json" ]; then
    echo "💾 Canlı veri tabanı geçici belleğe yedekleniyor..."
    cp src/data/db.json /tmp/emira_motors_db_live.json
    HAS_DB_BACKUP=true
else
    echo "⚠️ Canlı veri tabanı dosyası bulunamadı, yedekleme atlanıyor."
    HAS_DB_BACKUP=false
fi

# 2. Sunucudaki tüm kod çakışmalarını ve yerel değişiklikleri sıfırla
echo "🧹 Sunucudaki kod değişiklikleri ve yedek çakışmaları sıfırlanıyor..."
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
    rm /tmp/emira_motors_db_live.json
fi

# 5. Bağımlılıkları kontrol et ve projeyi production için derle
echo "📦 Bağımlılıklar yükleniyor ve proje derleniyor..."
npm install
npm run build

# 6. PM2 ile uygulamayı güvenle yeniden başlat
echo "🔄 PM2 sunucusu yeniden başlatılıyor..."
pm2 restart all

echo "----------------------------------------------"
echo "✅ Güncelleme tamamlandı ve site canlıya alındı!"
echo "----------------------------------------------"
