import type { AutomationTrigger, MatchType } from '@/types/automation';

const MAX_PATTERN_LENGTH = 200;
const MAX_TEXT_LENGTH = 2200;

/** Mirrors app/automation/matcher.py so test mode matches the engine. */
export function commentMatches(text: string, trigger: AutomationTrigger): boolean {
  if (trigger.type === 'ANY_COMMENT') return true;
  return trigger.keywords.some((keyword) => keywordMatches(text, keyword, trigger.match_type));
}

export function keywordMatches(text: string, keyword: string, matchType: MatchType): boolean {
  const haystack = text.slice(0, MAX_TEXT_LENGTH);
  const needle = keyword.trim();
  if (!needle) return false;
  if (matchType === 'EXACT') return haystack.trim().toLowerCase() === needle.toLowerCase();
  if (matchType === 'STARTS_WITH') return haystack.trim().toLowerCase().startsWith(needle.toLowerCase());
  if (matchType === 'REGEX') return regexMatches(haystack, needle);
  return containsWord(haystack, needle);
}

function containsWord(text: string, keyword: string): boolean {
  const pattern = new RegExp(`(?<!\\w)${escapeRegExp(keyword)}(?!\\w)`, 'i');
  return pattern.test(text);
}

function regexMatches(text: string, pattern: string): boolean {
  if (pattern.length > MAX_PATTERN_LENGTH) return false;
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch {
    return false;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
