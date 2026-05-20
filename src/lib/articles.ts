import { parse } from 'path';

const DEFAULT_PRICE = 0.1;
const articleModules = import.meta.glob<string>('../content/articles/*.{md,mdx}', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export interface ArticleFrontmatter {
  id: string;
  title: string;
  author: string;
  date: string;
  price: number;
  tags: string[];
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  price: number;
  preview: string;
  content: string;
  tags: string[];
}

function normalizePrice(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_PRICE;
}

function parseFrontmatter(content: string): { frontmatter: ArticleFrontmatter; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {
        id: '',
        title: '',
        author: '',
        date: '',
        price: DEFAULT_PRICE,
        tags: [],
      },
      body: content,
    };
  }

  const frontmatterText = match[1];
  const body = match[2].trim();

  const frontmatter: Partial<ArticleFrontmatter> = {};
  
  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1);
        (frontmatter as Record<string, unknown>)[key] = value.split(',').map(v => 
          v.trim().replace(/^["']|["']$/g, '')
        );
      } else if (key === 'price') {
        const parsedPrice = Number(value);
        (frontmatter as Record<string, unknown>)[key] = Number.isFinite(parsedPrice) && parsedPrice > 0
          ? parsedPrice
          : DEFAULT_PRICE;
      } else {
        (frontmatter as Record<string, unknown>)[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return {
    frontmatter: {
      id: frontmatter.id || '',
      title: frontmatter.title || '',
      author: frontmatter.author || '',
      date: frontmatter.date || '',
      price: normalizePrice(frontmatter.price),
      tags: frontmatter.tags || [],
    },
    body,
  };
}

function generatePreview(body: string, maxLength: number = 200): string {
  let text = body
    .replace(/^#+\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  const lastSpace = text.lastIndexOf(' ', maxLength);
  return text.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

function loadArticleFromContent(filepath: string, content: string): Article {
  const { frontmatter, body } = parseFrontmatter(content);
  const filename = parse(filepath).name;

  return {
    id: frontmatter.id || filename,
    title: frontmatter.title || 'Untitled',
    author: frontmatter.author || 'Unknown',
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    price: normalizePrice(frontmatter.price),
    preview: generatePreview(body),
    content: body,
    tags: frontmatter.tags || [],
  };
}

export function loadAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const [filepath, content] of Object.entries(articleModules).sort(([a], [b]) => a.localeCompare(b))) {
    try {
      articles.push(loadArticleFromContent(filepath, content));
    } catch (error) {
      console.error(`Failed to load article ${filepath}:`, error);
    }
  }

  return articles;
}

export function getArticleById(id: string): Article | null {
  const articles = loadAllArticles();
  return articles.find(article => article.id === id) || null;
}
