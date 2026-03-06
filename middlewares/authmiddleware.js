import jwt from "jsonwebtoken";
import { DB } from "../config/db.js";

export const authmiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(404)
      .json({ status: 0, error: "Not authorized, to gain access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    const result = await DB.query(`select * from users where id=$1`, [
      decoded.id,
    ]);

    if (result.rowCount === 0) {
      res.status(401).json({ status: 0, error: "User no longer exist." });
    }

    const user = result.rows[0];
    delete user.password;
    req.user = user;
    next();
  } catch (e) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ status: 0, error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ status: 0, error: "Token expired." });
    }

    console.error("Auth middleware error:", error);
    res
      .status(500)
      .json({ status: 0, error: "Server error, please try again later." });
  }
};
