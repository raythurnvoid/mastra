# @mastra/rag

## Local runtime fork

This workspace uses the TypeScript source directly for Markdown chunking in Convex.
Use `MDocument.fromMarkdown(text).chunk({ strategy: 'markdown', ...options })`.
Other chunk strategies, metadata extraction, tracing, and retrieval tools are not supported here.
The fork keeps Node APIs out of the runtime and uses the app's published `@mastra/core` dependency for types.

The upstream blank-line fix is included. No local separator patch is needed.
After updating upstream, preserve these limits and run the app's Markdown chunking and file-read tests.

The sections below describe the full upstream package.

`@mastra/rag` provides document chunking, reranking, and graph-based retrieval utilities for retrieval-augmented generation. Use it to prepare source material for embedding and select the most relevant context before an agent generates a response.

## Installation

```bash
npm install @mastra/rag
```

## Usage

Create a document and split it into chunks before embedding or indexing the content.

```typescript
import { MDocument } from '@mastra/rag';

const document = MDocument.fromText(`
# Product guide

Mastra provides agents, workflows, memory, and retrieval tools.
`);

const chunks = await document.chunk({
  strategy: 'recursive',
  maxSize: 512,
  overlap: 50,
});
```

## Documentation

- [@mastra/rag documentation](https://mastra.ai/reference/rag/overview)

## Changelog

See the [package changelog](https://github.com/mastra-ai/mastra/blob/main/packages/rag/CHANGELOG.md) for version history and release notes.

## Support

We have an [open community Discord](https://discord.gg/mastra-ai). Come and say hello and let us know if you have any questions or need any help getting things running.
