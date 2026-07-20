export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: string[]; // string array mapping parsed tags
  seoTitle?: string;
  seoDescription?: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
