import bcrypt from "bcryptjs";
import { DB, connectDB, disconnectDB } from "../config/db.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await connectDB();
    const userExists = await DB.query(
      `select count(*) from users where email=$1`,
      [email],
    );
    if (userExists.rows[0].count != 0) {
      return res.status(404).json({ error: "User Exists Try Loggin In!" });
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
    res.json({
      status: "success",
      user: {
        id: i_id,
        name: i_name,
        email: i_email,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error!" });
  } finally {
    await disconnectDB();
  }
};

export { register };
