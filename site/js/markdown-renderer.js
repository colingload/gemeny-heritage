/**
 * Gemeny Heritage — Markdown Renderer
 *
 * Lightweight markdown-to-HTML converter. Handles the subset of markdown
 * used in the content/ files: headings, paragraphs, bold, italic, links,
 * lists, blockquotes, and horizontal rules.
 *
 * No external dependencies.
 */

const MarkdownRenderer = {
  render(text) {
    if (!text) return '';

    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Block-level elements
    const lines = html.split('\n');
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        blocks.push(`<h${level}>${this._inline(headingMatch[2])}</h${level}>`);
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(---|\*\*\*|___)/.test(line.trim())) {
        blocks.push('<hr>');
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('&gt;') || line.startsWith('> ')) {
        let quote = '';
        while (i < lines.length && (lines[i].startsWith('&gt;') || lines[i].startsWith('> '))) {
          quote += lines[i].replace(/^(&gt;|>)\s?/, '') + '\n';
          i++;
        }
        blocks.push(`<blockquote>${this._inline(quote.trim())}</blockquote>`);
        continue;
      }

      // Unordered list
      if (/^[\-\*]\s+/.test(line)) {
        let items = '';
        while (i < lines.length && /^[\-\*]\s+/.test(lines[i])) {
          items += `<li>${this._inline(lines[i].replace(/^[\-\*]\s+/, ''))}</li>`;
          i++;
        }
        blocks.push(`<ul>${items}</ul>`);
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        let items = '';
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items += `<li>${this._inline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`;
          i++;
        }
        blocks.push(`<ol>${items}</ol>`);
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph (collect consecutive non-empty lines)
      let para = '';
      while (i < lines.length && lines[i].trim() !== '' && !/^#{1,6}\s/.test(lines[i]) && !/^[\-\*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i])) {
        para += (para ? ' ' : '') + lines[i];
        i++;
      }
      blocks.push(`<p>${this._inline(para)}</p>`);
    }

    return blocks.join('\n');
  },

  /** Process inline formatting: bold, italic, links, code. */
  _inline(text) {
    return text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/  \n/g, '<br>');
  }
};
