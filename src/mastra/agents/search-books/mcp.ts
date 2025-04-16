import { MCPConfiguration } from "@mastra/mcp";

// Set up MCP configuration with Firecrawl and GitHub servers
export const searchBooksMCP = new MCPConfiguration({
    id: "search-books",
    servers: {
      firecrawl: {
        command: "npx",
        args: ["-y", "firecrawl-mcp"],
        env: {
          FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || "",
        },
      },
    },
});
