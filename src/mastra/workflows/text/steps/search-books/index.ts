import { Step } from "@mastra/core/workflows";
import { z } from "zod";

import { mastra } from '../../../../index';

const searchResultSchema = z.object({
    title: z.string(),
    author: z.string(),
    goodreadsUrl: z.string().url(),
});

/**
 * Step: Search Books
 * Uses the search-books agent to find relevant books for a given prompt.
 */
export const searchBooksStep = new Step({
    id: "searchBooks",
    description: "Searches for relevant books using the search-books agent.",
    inputSchema: z.object({
        prompt: z.string().describe("A user prompt describing a book or books to search for")
    }),
    outputSchema: z.object({
        results: z.array(searchResultSchema),
        error: z.string().optional()
    }),
    execute: async ({ context }) => {
        try {
            const prompt = context.triggerData.prompt;

            const response = await mastra.getAgent('searchBooks').generate(
                [{ role: "user", content: prompt }],
                {
                    output: z.array(searchResultSchema)
                }
            );

            return { results: response.object };
        } catch (error) {
            return {
                results: [],
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
});
