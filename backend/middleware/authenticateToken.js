import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token setelah 'Bearer'

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = user; // Menyimpan data user di request
    next(); // Lanjutkan ke route berikutnya
  });
};

export default authenticateToken;
