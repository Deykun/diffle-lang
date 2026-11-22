/*
  Hunspell unmunch: expands every stem from core/it_IT.dic
  with the affix rules from core/it_IT.aff into a flat list of word forms.

  Supported .aff features (all that it_IT uses): PFX, SFX, cross products (throws on the rest).

  Words with an apostrophe are rejected. Most of them come from elision prefixes
  (l', dell', un', ALL'...) which glue an article or a preposition to the next word,
  expanding them gives 36.6M forms (655 MB) instead of 3.1M (47 MB).
*/
import fs from 'fs';
import path from 'path';

const AFF_PATH = path.join(import.meta.dirname, '../core/it_IT.aff');
const DIC_PATH = path.join(import.meta.dirname, '../core/it_IT.dic');

type AffixType = 'PFX' | 'SFX';

type Rule = {
  strip: string,
  add: string,
  condition: RegExp,
};

type Affix = {
  type: AffixType,
  canCross: boolean,
  rules: Rule[],
};

const getHasApostrophe = (word: string) => word.includes("'");

const UNSUPPORTED_DIRECTIVES = ['FLAG', 'AF', 'NEEDAFFIX', 'PSEUDOROOT', 'CIRCUMFIX', 'FULLSTRIP', 'COMPOUNDFLAG', 'COMPOUNDRULE'];

const parseAffixes = (aff: string) => {
  const affixes = new Map<string, Affix>();

  aff.split(/\r?\n/).forEach((line) => {
    const [directive, flag, strip, add, condition = '.'] = line.trim().split(/\s+/);

    if (UNSUPPORTED_DIRECTIVES.includes(directive)) {
      throw new Error(`Unsupported .aff directive: ${directive}`);
    }

    if (directive !== 'PFX' && directive !== 'SFX') {
      return;
    }

    const affix = affixes.get(flag);

    if (!affix) {
      // Header line: PFX flag cross_product rules_count
      affixes.set(flag, { type: directive, canCross: strip === 'Y', rules: [] });

      return;
    }

    if (add.includes('/')) {
      throw new Error(`Unsupported affix continuation class: ${line}`);
    }

    // Skipped early, expanding 33M forms just to reject them later is slow
    if (getHasApostrophe(add)) {
      return;
    }

    affix.rules.push({
      strip: strip === '0' ? '' : strip,
      add: add === '0' ? '' : add,
      condition: new RegExp(directive === 'SFX' ? `${condition}$` : `^${condition}`),
    });
  });

  return affixes;
};

const applyRule = (word: string, type: AffixType, { strip, add, condition }: Rule) => {
  // Hunspell never strips the whole word (no FULLSTRIP)
  if (word.length <= strip.length || !condition.test(word)) {
    return undefined;
  }

  if (type === 'SFX') {
    return word.endsWith(strip) ? word.slice(0, word.length - strip.length) + add : undefined;
  }

  return word.startsWith(strip) ? add + word.slice(strip.length) : undefined;
};

const applyAffix = (word: string, { type, rules }: Affix) => rules
  .map(rule => applyRule(word, type, rule))
  .filter((form): form is string => form !== undefined);

const getForms = (stem: string, affixes: Affix[]) => {
  const prefixes = affixes.filter(({ type }) => type === 'PFX');
  const suffixes = affixes.filter(({ type }) => type === 'SFX');

  const suffixed = suffixes.flatMap(suffix => applyAffix(stem, suffix));
  const suffixedToCross = suffixes.filter(({ canCross }) => canCross).flatMap(suffix => applyAffix(stem, suffix));

  const prefixed = prefixes.flatMap((prefix) => {
    const bases = prefix.canCross ? [stem, ...suffixedToCross] : [stem];

    return bases.flatMap(base => applyAffix(base, prefix));
  });

  return [stem, ...suffixed, ...prefixed];
};

export const getDictionaryWordsFromHunspell = () => {
  const affixes = parseAffixes(fs.readFileSync(AFF_PATH, 'utf-8'));

  const words = new Set<string>();
  const unknownFlags = new Set<string>();
  let totalStems = 0;

  fs.readFileSync(DIC_PATH, 'utf-8').split(/\r?\n/).forEach((line, index) => {
    const [stem, flags = ''] = line.trim().split('/');
    const isWordsCount = index === 0 && /^\d+$/.test(stem);

    // Lines starting with "/" are comments in it_IT.dic
    if (!stem || isWordsCount) {
      return;
    }

    totalStems += 1;

    const stemAffixes = [...new Set(flags)].flatMap((flag) => {
      const affix = affixes.get(flag);

      if (!affix) {
        unknownFlags.add(flag);
      }

      return affix ? [affix] : [];
    });

    getForms(stem, stemAffixes)
      .filter(form => !getHasApostrophe(form))
      .forEach(form => words.add(form));
  });

  console.log(`Hunspell stems: ${totalStems}`);
  console.log(`Hunspell word forms: ${words.size}`);

  if (unknownFlags.size > 0) {
    console.log(`Flags used in .dic but missing in .aff (ignored): ${[...unknownFlags].join(' ')}`);
  }

  return [...words].sort(new Intl.Collator('it').compare);
};
