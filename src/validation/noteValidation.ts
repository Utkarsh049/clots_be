import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Invalid image URL format").optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  content: z.string().min(1, "Content is required").optional(),
  imageUrl: z.string().url("Invalid image URL format").optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});
