import { describe, expect, it } from 'vitest';
import { commentMatches } from '@/lib/matcher';

describe('keyword trigger', () => {
  const keyword = {
    type: 'COMMENT_KEYWORD' as const,
    keywords: ['guide'],
    match_type: 'CONTAINS' as const,
  };

  it('matches a whole keyword and ignores case', () => {
    expect(commentMatches('AI GUIDE', keyword)).toBe(true);
    expect(commentMatches('send me the guide', keyword)).toBe(true);
  });

  it('does not match a longer word', () => {
    expect(commentMatches('guidance', keyword)).toBe(false);
  });

  it('matches any comment', () => {
    expect(commentMatches('hello', { type: 'ANY_COMMENT' })).toBe(true);
  });

  it('matches exact and starts-with modes', () => {
    expect(commentMatches('Guide', { ...keyword, match_type: 'EXACT' })).toBe(true);
    expect(commentMatches('guide please', { ...keyword, match_type: 'EXACT' })).toBe(false);
    expect(commentMatches('guide please', { ...keyword, match_type: 'STARTS_WITH' })).toBe(true);
  });
});
