import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ end: "Movies", count: 221 });
});

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  res.json({ end: "Movie", name: `Movie ${id}` });
});

router.get("/:id/:year", (req, res) => {
  console.log(req.params.id, req.query.search);
  res.json({ movies: "Not-Included Yet!" });
});

export default router;
