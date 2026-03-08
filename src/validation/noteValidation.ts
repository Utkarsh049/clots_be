import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable(),
});
