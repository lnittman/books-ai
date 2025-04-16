import { z } from "zod";

export const searchResultSchema = z.object({
  title: z.string(),
  author: z.string(),
  goodreadsUrl: z.string().url(),
});

export const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  goodreadsUrl: z.string().url(),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  pageCount: z.number().optional(),
  genres: z.array(z.string()).optional(),
  rating: z.number().optional(),
  topReviews: z.array(z.object({
      reviewer: z.string(),
      date: z.string(),
      text: z.string(),
      rating: z.number().optional()
  })).optional(),
  notableQuotes: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  relatedBooks: z.array(z.object({
      title: z.string(),
      author: z.string(),
      goodreadsUrl: z.string().url()
  })).optional(),
  shelves: z.array(z.string()).optional(),
  mediaLinks: z.array(z.object({
      type: z.string(),
      url: z.string()
  })).optional(),
  reviewCount: z.number().optional(),
  ratingCount: z.number().optional(),
  firstLine: z.string().optional(),
  languages: z.array(z.string()).optional()
});
