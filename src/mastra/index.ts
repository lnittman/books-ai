import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';
import { VercelDeployer } from '@mastra/deployer-vercel';

import { detectBookAgent } from './agents/detect-book';
import { getBookAgent } from './agents/get-book';
import { searchBooksAgent } from './agents/search-books';
import { imageWorkflow } from './workflows/image';
import { textWorkflow } from './workflows/text';

// Create a logger with less verbose level to reduce output
const logger = createLogger({
  name: 'mastra',
  level: 'info'
});

// Create the Mastra instance with our components
export const mastra = new Mastra({
  agents: {
    detectBook: detectBookAgent,
    getBook: getBookAgent,
    searchBooks: searchBooksAgent,
  },
  deployer: new VercelDeployer({
    projectName: 'books-ai',
    teamSlug: 'luke-labs',
    token: process.env.VERCEL_TOKEN || '',
  }),
  logger,
  workflows: {
    image: imageWorkflow,
    text: textWorkflow,
  },
});