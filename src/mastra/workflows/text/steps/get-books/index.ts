import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";

import { getBookStep } from "../get-book";
import { bookSchema, searchResultSchema } from "../get-book/schemas";

import { mastra } from "../../../../index";

type Book = z.infer<typeof bookSchema>;
type SearchResult = z.infer<typeof searchResultSchema>;

export const getBooksStep = new Step({
  id: "getBooks",
  inputSchema: z.object({
    searchResults: z.array(searchResultSchema),
  }),
  outputSchema: z.object({
    books: z.array(bookSchema),
  }),
  execute: async ({ context }) => {
    const searchBooksStep = context.steps.searchBooks;
    const results = searchBooksStep?.status === "success"
      ? searchBooksStep.output.results
      : [];

    // Create an array of promises for parallel execution
    const bookPromises = results.map(async (result: SearchResult) => {
      const dynamicWorkflow = new Workflow({
        name: 'getBook',
        mastra,
        triggerSchema: z.object({
          title: z.string(),
          author: z.string(),
          goodreadsUrl: z.string().url(),
        }),
      });

      // Commit the step to the workflow, create and start a run
      dynamicWorkflow.step(getBookStep).commit();
      const res = await dynamicWorkflow.createRun().start({
        triggerData: {
          title: result.title,
          author: result.author,
          goodreadsUrl: result.goodreadsUrl,
        },
      });

      const stepResult = res.results[getBookStep.id];
      if (stepResult && stepResult.status === "success" && stepResult.output) {
        return stepResult.output as Book;
      } else {
        console.error(`Failed to get book for ${result.title} by ${result.author}`);
        return null;
      }
    });

    // Wait for all promises to resolve in parallel and filter out null results
    return { books: (await Promise.all(bookPromises)).filter(Boolean) as Book[] };
  },
}); 