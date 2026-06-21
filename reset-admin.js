const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'src/data/db.json');

if (fs.existsSync(dbPath)) {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const salt = bcrypt.genSaltSync(12);
    db.admin.passwordHash = bcrypt.hashSync('enginusta34', salt);
    db.admin.mustChangePassword = false;
    db.admin.sessions = {}; // Clear active sessions
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log("------------------------------------------------");
    console.log("✅ Admin şifresi başarıyla 'enginusta34' olarak sıfırlandı!");
    console.log("------------------------------------------------");
  } catch (err) {
    console.error("Şifre sıfırlanırken hata oluştu:", err);
  }
} else {
  console.log("Hata: db.json dosyası bulunamadı.");
}
