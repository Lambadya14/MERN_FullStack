import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  // Ambil token dari header Authorization (Bearer <token>)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Jika token kadaluarsa atau tidak valid
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }

    req.user = user; // Menyimpan data user di request
    next(); // Lanjutkan ke route berikutnya
  });
};

export default authenticateToken;
