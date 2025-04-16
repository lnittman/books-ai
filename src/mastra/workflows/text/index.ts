import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";

import { getBooksStep } from "./steps/get-books";
import { searchBooksStep } from "./steps/search-books";

/**
 * TextWorkflow handles the process of:
 * 1. Searching Goodreads for relevant books
 * 2. Returning a list of structured book data for each book found
 */
export const textWorkflow = new Workflow({
  name: "text",
  triggerSchema: z.object({
    prompt: z.string().describe("An open-ended user prompt used to search for books")
  }),
});

textWorkflow
  .step(searchBooksStep)
  .then(getBooksStep)
  .commit();

export default textWorkflow; 