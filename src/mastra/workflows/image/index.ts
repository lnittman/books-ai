import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";

import { bookDetectionStep } from "./steps/book-detection/index";

/**
 * ImageWorkflow handles the process of:
 * 1. Detecting a book in an image
 * 2. Extracting text (title/author) from the detected book
 * 3. Looking up the book on Goodreads
 * 4. Returning structured book information
 */
export const imageWorkflow = new Workflow({
  name: "image",
  triggerSchema: z.object({
    // Base64 encoded image or URL to the image
    image: z.string().describe("Base64 encoded image or URL to the image"),
    // Optional parameters for processing
    options: z.object({
      confidenceThreshold: z.number().min(0).max(1).default(0.7).optional()
        .describe("Minimum confidence threshold for book detection (0-1)"),
      returnRawData: z.boolean().default(false).optional()
        .describe("Whether to include raw data in the response")
    }).optional()
  }),
});

// Connect all the workflow steps in sequence with proper error handling
imageWorkflow
  .step(bookDetectionStep)
  .if(async ({ context }) => {
    const bookDetectionStepResult = context.getStepResult<{ isBookDetected: boolean }>('bookDetection');
    return bookDetectionStepResult?.isBookDetected ?? false;
  })
  .else()
  .commit();

export default imageWorkflow;
