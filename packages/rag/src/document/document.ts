import { Document as Chunk } from './schema';

import { MarkdownHeaderTransformer, MarkdownTransformer } from './transformers/markdown';
import type {
  ChunkParams,
  ChunkStrategy,
  ExtractParams,
  HTMLChunkOptions,
  RecursiveChunkOptions,
  CharacterChunkOptions,
  TokenChunkOptions,
  MarkdownChunkOptions,
  SemanticMarkdownChunkOptions,
  JsonChunkOptions,
  LatexChunkOptions,
  SentenceChunkOptions,
  StrategyOptions,
} from './types';
import { validateChunkParams } from './validation';

export class MDocument {
  private chunks: Chunk[];
  private type: string; // e.g., 'text', 'html', 'markdown', 'json'

  constructor({ docs, type }: { docs: { text: string; metadata?: Record<string, any> }[]; type: string }) {
    this.chunks = docs.map(d => {
      return new Chunk({ text: d.text, metadata: d.metadata });
    });
    this.type = type;
  }

  async extractMetadata(_params: ExtractParams): Promise<MDocument> {
    throw new Error(
      'MDocument.extractMetadata is not available in this vendored runtime-safe build of @mastra/rag.',
    );
  }

  static fromText(text: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text,
          metadata,
        },
      ],
      type: 'text',
    });
  }

  static fromHTML(html: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: html,
          metadata,
        },
      ],
      type: 'html',
    });
  }

  static fromMarkdown(markdown: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: markdown,
          metadata,
        },
      ],
      type: 'markdown',
    });
  }

  static fromJSON(jsonString: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: jsonString,
          metadata,
        },
      ],
      type: 'json',
    });
  }

  private defaultStrategy(): ChunkStrategy {
    switch (this.type) {
      case 'html':
        return 'html';
      case 'markdown':
        return 'markdown';
      case 'json':
        return 'json';
      case 'latex':
        return 'latex';
      default:
        return 'recursive';
    }
  }

  private _strategyMap?: { [S in ChunkStrategy]: (options?: StrategyOptions[S]) => Promise<void> };

  private get strategyMap() {
    if (!this._strategyMap) {
      this._strategyMap = {
        recursive: options => this.chunkRecursive(options),
        character: options => this.chunkCharacter(options),
        token: options => this.chunkToken(options),
        markdown: options => this.chunkMarkdown(options),
        html: options => this.chunkHTML(options),
        json: options => this.chunkJSON(options),
        latex: options => this.chunkLatex(options),
        sentence: options => this.chunkSentence(options),
        'semantic-markdown': options => this.chunkSemanticMarkdown(options),
      };
    }
    return this._strategyMap;
  }

  private async chunkBy<K extends ChunkStrategy>(strategy: K, options?: StrategyOptions[K]): Promise<void> {
    const chunkingFunc = this.strategyMap[strategy];
    if (chunkingFunc) {
      await chunkingFunc(options);
    } else {
      throw new Error(`Unknown strategy: ${strategy}`);
    }
  }

  async chunkRecursive(options?: RecursiveChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkRecursive is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkCharacter(options?: CharacterChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkCharacter is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkHTML(options?: HTMLChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkHTML is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkJSON(options?: JsonChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkJSON is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkLatex(options?: LatexChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkLatex is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkToken(options?: TokenChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkToken is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkMarkdown(options?: MarkdownChunkOptions): Promise<void> {
    if (options?.headers) {
      const rt = new MarkdownHeaderTransformer(options.headers, options?.returnEachLine, options?.stripHeaders);
      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }

    const rt = new MarkdownTransformer(options);
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunkSentence(options?: SentenceChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkSentence is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunkSemanticMarkdown(options?: SemanticMarkdownChunkOptions): Promise<void> {
    throw new Error(
      `MDocument.chunkSemanticMarkdown is not available in this vendored runtime-safe build of @mastra/rag. Received options: ${JSON.stringify(
        options ?? {},
      )}`,
    );
  }

  async chunk(params?: ChunkParams): Promise<Chunk[]> {
    const { strategy: passedStrategy, extract, ...chunkOptions } = params || {};
    // Determine the default strategy based on type if not specified
    const strategy = passedStrategy || this.defaultStrategy();

    validateChunkParams(strategy, chunkOptions);

    // Apply the appropriate chunking strategy
    await this.chunkBy(strategy, chunkOptions);

    if (extract) {
      await this.extractMetadata(extract);
    }

    return this.chunks;
  }

  getDocs(): Chunk[] {
    return this.chunks;
  }

  getText(): string[] {
    return this.chunks.map(doc => doc.text);
  }

  getMetadata(): Record<string, any>[] {
    return this.chunks.map(doc => doc.metadata);
  }
}
