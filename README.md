# Books AI

A Mastra.ai application for book discovery and information retrieval.

## Features

- **Text-based Book Search:** Find books based on queries or topics
- **Book Information Extraction:** Get detailed book metadata from Goodreads
- **Book Cover Detection:** Identify books in images (experimental)

## Prerequisites

- Node.js (v18 or later)
- npm or [pnpm](https://pnpm.io/) (recommended)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
# With npm
npm install

# With pnpm (recommended)
pnpm install
```

## Configuration

Create a `.env.local` file in the project root with the following API keys:

```
DATABASE_URL=your_postgresql_connection_string
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
VERCEL_TOKEN=your_vercel_token
```

### API Keys

- **OpenRouter API Key**: Required for LLM access. Get one at [OpenRouter](https://openrouter.ai/).
- **Firecrawl API Key**: Used for web search capabilities. Get one at [Firecrawl](https://firecrawl.dev/).
- **PostgreSQL Database URL**: For data persistence (optional for local development).
- **Vercel Token**: Required for deployment through the Vercel deployer.

## Running the Application

Start the development server:

```bash
# With npm
npm run dev

# With pnpm
pnpm dev
```

This will start the Mastra server, typically at http://localhost:3000.

## Project Structure

- `src/mastra/agents/` - AI agents for specific tasks
- `src/mastra/tools/` - Custom tools for web access and content extraction
- `src/mastra/workflows/` - Defined workflows for text and image processing
- `src/mastra/utils/` - Utility functions
- `src/mastra/index.ts` - Main application entry point

## Prompt Engineering

This project uses structured XML prompts for consistent agent behavior. 

Prompt files are located in each agent's directory:

- `src/mastra/agents/detect-book/instructions.xml`
- `src/mastra/agents/get-book/instructions.xml`
- `src/mastra/agents/search-books/instructions.xml`

### Prompt Structure

Prompts follow this standard structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<instructions>
  <metadata>
    <!-- Metadata about the prompt: id, version, purpose -->
  </metadata>
  
  <purpose>
    <!-- High-level description of the agent's purpose -->
  </purpose>
  
  <capabilities>
    <!-- List of agent capabilities -->
  </capabilities>
  
  <methodology>
    <!-- Step-by-step process the agent should follow -->
  </methodology>
  
  <guidelines>
    <!-- Specific rules or guidelines for the agent -->
  </guidelines>
  
  <response_format>
    <!-- Expected response format, typically JSON schema -->
  </response_format>
  
  <examples>
    <!-- Example inputs and expected outputs -->
  </examples>
</instructions>
```

### Loading Prompts

Prompts are loaded using the `loadPrompt` utility in `src/mastra/utils/loadPrompt.ts`:

```typescript
import { loadPrompt } from "../../utils/loadPrompt";

// Load a prompt by its relative path
const instructions = loadPrompt("agents/detect-book/prompt.xml");
```

### Prompt Engineering Guidelines

When modifying or creating new prompts:

1. Always include a clear purpose and response format
2. Provide detailed examples of expected inputs and outputs
3. Use XML structure to organize complex instructions
4. Include version information in metadata for tracking changes
5. Test prompts with different inputs to ensure consistent responses

## MCP Configuration

The application uses Mastra's Machine Communication Protocol (MCP) to integrate with external services like Firecrawl. MCP configurations are defined in TypeScript files with an instance of `MCPConfiguration`.

### `searchBooksMCP`

Located in `src/mastra/agents/search-books/mcp.ts`, this configuration sets up the Firecrawl server for web search:

```typescript
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
```

This configuration:
- Creates an MCP server with ID "search-books"
- Configures a Firecrawl server that:
  - Runs via `npx -y firecrawl-mcp` command
  - Passes the FIRECRAWL_API_KEY to the server process

### Tool Definitions

MCP tool definitions are stored in XML files in the `src/mastra/tools/mcp/` directory:

- `firecrawl.xml` - Defines the available Firecrawl tools, parameters, and examples

To add a new tool server, create a new MCP configuration and corresponding XML definition.

## Built With

- [Mastra](https://mastra.ai/) - AI agent framework
- [OpenRouter](https://openrouter.ai/) - LLM provider
- [Firecrawl](https://firecrawl.dev/) - Web search and extraction tools

## License

ISC 