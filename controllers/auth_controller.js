import bcrypt from "bcryptjs";
import { DB } from "../config/db.js";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await DB.query(
      `select count(*) from users where email=$1`,
      [email],
    );
    if (userExists.rows[0].count != 0) {
      return res.status(403).json({ error: "User Exists Try Loggin In!" });
    }
    const salt = await bcrypt.genSalt(8);
    const hashed_password = await bcrypt.hash(password, salt);
    const user = await DB.query(
      `
      insert into users (name,email,password) values
      ($1,$2,$3)
      returning (id,name,email)`,
      [name, email, hashed_password],
    );

    const [i_id, i_name, i_email] = user.rows[0].row.slice(1, -1).split(",");

    //Generate JWT
    const token = generateToken(i_id, res);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: i_id,
          name: i_name,
          email: i_email,
        },
      },
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error trying reloading!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await DB.query(`select * from users where email=$1`, [email]);

    if (user.rowCount == 0) {
      return res
        .status(401)
        .json({ status: 0, error: "Some credentials are wrong!" });
    }

    const {
      id: g_id,
      name: g_name,
      email: g_email,
      password: g_password,
    } = user.rows[0];
    const password_check = await bcrypt.compare(password, g_password);

    if (!password_check) {
      return res
        .status(401)
        .json({ status: 0, error: "Some credentials are wrong!" });
    }

    //Generate JWT
    const token = generateToken(g_id, res);

    res.status(200).json({
      status: 1,
      data: {
        user: {
          id: g_id,
          name: g_name,
          email: g_email,
        },
      },
      token,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: -1, error: "Server error trying reloading!" });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    msg: "Succussfully Logged Out User.",
  });
};

export { register, login, logout };
