import { Step } from "@mastra/core/workflows";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";

import { mastra } from "../../../..";
import { loadPrompt } from "../../../../utils/loadPrompt";

/**
 * Step 1: Book Detection
 * 
 * Takes an image (base64 or URL) and determines if it contains a book
 * Uses an agent specialized in book detection
 */
export const bookDetectionStep = new Step({
  id: "bookDetection",
  description: "Detects if the image contains a book",
  outputSchema: z.object({
    isBookDetected: z.boolean().describe("Whether a book was detected in the image"),
    confidence: z.number().describe("Confidence score of book detection (0-1)"),
    croppedImage: z.string().optional().describe("Base64 encoded cropped image of the book")
  }),
  execute: async ({ context }) => {
    try {
      const { image, options = {} } = context.triggerData;
      const { confidenceThreshold = 0.7 } = options;
      
      // Get the book detection agent from Mastra
      const bookDetectAgent = mastra.getAgent('bookDetect') as Agent<any, any>;
      
      if (!bookDetectAgent) {
        throw new Error("Book detection agent not available");
      }
      
      console.log("Processing image with book detection agent...");
      
      // Load the prompt template
      const promptTemplate = loadPrompt("workflows/camera/steps/book-detection/prompt.xml", "");
      
      // Replace template variables
      // For image data, we truncate to avoid massive prompts
      const imgPreview = image.substring(0, 30) + "...(image data truncated)";
      const filledPrompt = promptTemplate.replace("{{image}}", imgPreview);
      
      // Use the agent's generate method to analyze the image
      const response = await bookDetectAgent.generate(filledPrompt, {
        output: z.object({
          isBookDetected: z.boolean(),
          confidence: z.number()
        })
      });
      
      // Extract the structured output from the agent's response
      const bookDetection = response.object;
      
      // Apply confidence threshold check
      const isBookDetected = bookDetection.isBookDetected && 
                            bookDetection.confidence >= confidenceThreshold;
      
      return {
        isBookDetected,
        confidence: bookDetection.confidence,
        // In a real implementation, you would crop the image here if a book was detected
        croppedImage: isBookDetected ? image : undefined
      };
    } catch (error) {
      console.error("Book detection error:", error);
      return {
        isBookDetected: false,
        confidence: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
});
