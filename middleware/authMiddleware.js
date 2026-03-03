import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      result: "fail",
      message: "Token tidak ada",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const time_iat = decoded.iat;
    // const time_now = Math.floor(Date.now() / 1000);
    // if (time_now - time_iat > 1) {
    //   throw("token expired.");
    // }

    // Simpan data user ke request
    req.user = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({
      result: "fail",
      message: err.message ? err.message : "Token tidak valid"
    });
  }


};