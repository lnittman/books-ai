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
    console.log('getBookStep - context: ', context);

    const { goodreadsUrl } = context.triggerData;
    console.log('getBookStep - goodreadsUrl: ', goodreadsUrl);

    const response = await mastra.getAgent('getBook').generate(
      [{ role: "user", content: goodreadsUrl }],
      {
        output: bookSchema,
      }
    );

    console.log('getBookStep - response: ', response.object);
    return response.object as z.infer<typeof bookSchema>;
  }
});
