import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";

import { getBookStep } from "../get-book";
import { bookSchema, searchResultSchema } from "../get-book/schemas";

import { mastra } from "../../../../index";

type Book = z.infer<typeof bookSchema>;

export const getBooksStep = new Step({
  id: "getBooks",
  inputSchema: z.object({
    searchResults: z.array(searchResultSchema),
  }),
  outputSchema: z.object({
    books: z.array(bookSchema),
  }),
  execute: async ({ context }) => {
    const { results } = context.steps.searchBooks.output;
    console.log('getBooksStep - searchResults: ', results);

    const books: Book[] = [];

    for (const result of results) {
      console.log('getBooksStep - processing result: ', result);

      const dynamicWorkflow = new Workflow({
        name: 'getBook',
        mastra,
        triggerSchema: z.object({
          title: z.string(),
          author: z.string(),
          goodreadsUrl: z.string().url(),
        }),
      });

      dynamicWorkflow.step(getBookStep).commit();

      const run = dynamicWorkflow.createRun();
      console.log('getBooksStep - starting dynamic workflow run: ', run);

      const res = await run.start({
        triggerData: {
          title: result.title,
          author: result.author,
          goodreadsUrl: result.goodreadsUrl,
        },
      });

      // Defensive: check status and output
      const stepResult = res.results[getBookStep.id];
      console.log('getBooksStep - stepResult: ', stepResult);

      if (stepResult && stepResult.status === "success" && stepResult.output) {
        books.push(stepResult.output as Book);
      } else {
        console.error(`Failed to get book for ${result.title} by ${result.author}`);
      }
    }

    return { books };
  },
}); 