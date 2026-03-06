import z from "zod";

const addToWatchListSchema = z.object({
  movieId: z.string().uuid(),
  status: z
    .enum(["planned", "watching", "completed", "dropped"], {
      message: "Status must be one of: planned, watching, completed, dropped",
    })
    .optional(),
  rate: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),
  note: z.string().optional(),
});

export { addToWatchListSchema };
