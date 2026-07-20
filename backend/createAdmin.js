require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/database");

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin123";
    const fullName = "Administrator";
    const email = "admin@monitoring.local";

    // cek apakah admin sudah ada
    const [rows] = await db.query(
      "SELECT id FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      console.log("Admin sudah ada.");
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert admin
    await db.query(
      `INSERT INTO admins
      (username,password,full_name,email)
      VALUES (?,?,?,?)`,
      [
        username,
        hashedPassword,
        fullName,
        email,
      ]
    );

    console.log("=================================");
    console.log("Admin berhasil dibuat!");
    console.log("Username :", username);
    console.log("Password :", password);
    console.log("=================================");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();