import { Step } from "@mastra/core/workflows";
import { z } from "zod";

import { bookSchema, searchResultSchema } from "./schemas";
import { mastra } from '../../../../index';

export const getBookStep = new Step({
  id: `getBook`,
  inputSchema: searchResultSchema,
  outputSchema: bookSchema,
  description: `Extracts structured book data using the get-book agent`,
  execute: async ({ context }) => {
    const { goodreadsUrl } = context.inputData;

    const response = await mastra.getAgent('getBook').generate(
      goodreadsUrl,
      {
        output: bookSchema,
      }
    );

    return response.object as z.infer<typeof bookSchema>;
  }
});
