import sanitizeHtml = require('sanitize-html');
const ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'strong',
  'em',
  'u',
  's',
  'ul',
  'ol',
  'li',
];

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
  });
}

export function stripHtmlTags(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
