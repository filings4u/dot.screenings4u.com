# Managed Blog / Article Viewer

- `blog.html` loads its published article list from the Supabase `dot_blog` table through the `dot-blog-public` Edge Function.
- `article.html?slug=...` is the single article viewer.
- Individual static `blog-*.html` article pages were removed.
- Existing article content was migrated to `dot_blog`.
- Staff can manage title, excerpt, content HTML, featured image, status, author, publish date, SEO title, SEO description, keywords, canonical URL, and metadata from the DOT management portal.
- The viewer applies article SEO fields to document title, meta description, canonical, Open Graph, Twitter tags, and Article JSON-LD.
- `_redirects` preserves the six legacy article URLs on hosting providers that support redirect rules.
