const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const [rows] = await db.query(
      `SELECT *
       FROM admins
       WHERE username = ?
       AND is_active = 1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    const admin = rows[0];

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Update waktu login terakhir
    await db.query(
      "UPDATE admins SET last_login = NOW() WHERE id = ?",
      [admin.id]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

// =========================
// GET PROFILE ADMIN
// =========================
exports.me = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
          id,
          username,
          full_name,
          email,
          last_login,
          created_at
       FROM admins
       WHERE id = ?`,
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      admin: rows[0],
    });
  } catch (err) {
    console.error("Get Profile Error:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};