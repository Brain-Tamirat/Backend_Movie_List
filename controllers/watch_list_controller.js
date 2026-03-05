import { DB } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, note } = req.body;

  try {
    //Verify Movie Exists
    const movie = await DB.query(`select * from movies where id=$1`, [movieId]);

    if (movie.rowCount == 0) {
      return res.status(401).json({ status: 0, error: "Movie Not Found!" });
    }

    const user_id = movie.rows[0].created_by;

    const watched_before = await DB.query(
      `select * from watchlists where movieid=$1 and userid=$2`,
      [movieId, user_id],
    );

    if (watched_before.rowCount != 0) {
      return res
        .status(400)
        .json({ status: 0, error: "Movie Already Exists!" });
    }

    const watched = await DB.query(
      `insert into watchlists (userid,movieid,status,rating,notes) values
      ($1,$2,$3,$4,$5)
      returning id,userid,movieid,status,rating,notes`,
      [user_id, movieId, status || "planned", rating, note],
    );

    const {
      id: gi,
      userid: gu,
      movieid: gm,
      status: gs,
      rating: gr,
      notes: gn,
    } = watched.rows[0];

    console.log(watched.rows[0]);

    res.status(201).json({
      status: 1,
      data: {
        user: {
          id: gi,
          user: gu,
          movie: gm,
          status: gs,
          rating: gr,
          notes: gn,
        },
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: 0, error: "Server isn't Working Come Back Later!" });
  }
};

export { addToWatchList };
