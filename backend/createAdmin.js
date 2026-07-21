require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/database");

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin123";
    const fullName = "Administrator";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hapus admin lama jika ada
    await db.query(
      "DELETE FROM admins WHERE username = ?",
      [username]
    );

    // Insert admin baru
    await db.query(
      `
      INSERT INTO admins
      (username, password, full_name)
      VALUES (?, ?, ?)
      `,
      [
        username,
        hashedPassword,
        fullName,
      ]
    );

    console.log("==================================");
    console.log("Admin berhasil dibuat");
    console.log("Username :", username);
    console.log("Password :", password);
    console.log("==================================");

    process.exit(0);
  } catch (err) {
    console.error("Gagal membuat admin");
    console.error(err);
    process.exit(1);
  }
}

createAdmin();