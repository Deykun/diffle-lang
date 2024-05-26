// Taken fron original: https://github.com/hedalu244/diffle/blob/main/main.ts
type DiffleResult = {
  pattern: (0 | 1 | 2 | 3)[],
  start: boolean,
  end: boolean,
};

export const compareWords = (answer: string, guess: string) => {
  const table = Array.from({ length: answer.length + 1 }, () => Array.from({ length: guess.length + 1 }, () => (
    { cost: 0, paths: [] as ('+' | '-' | '>')[][] }
  )));

  table[0][0] = { cost: 0, paths: [[]] };
  for (let a = 1; a < answer.length + 1; a++) table[a][0] = { cost: a, paths: table[a - 1][0].paths.map(x => [...x, '+']) };
  for (let b = 1; b < guess.length + 1; b++) table[0][b] = { cost: b, paths: table[0][b - 1].paths.map(x => [...x, '-']) };

  for (let a = 1; a < answer.length + 1; a++) {
    for (let b = 1; b < guess.length + 1; b++) {
      const accept = table[a - 1][b - 1].cost + (answer[a - 1] == guess[b - 1] ? 0 : Infinity);
      const insert = table[a - 1][b].cost + 1;
      const remove = table[a][b - 1].cost + 1;

      const cost = Math.min(insert, remove, accept);
      const paths = [] as ('+' | '-' | '>')[][];

      if (cost == accept) paths.push(...table[a - 1][b - 1].paths.map(x => [...x, '>' as const]));
      if (cost == insert) paths.push(...table[a - 1][b].paths.map(x => [...x, '+' as const]));
      if (cost == remove) paths.push(...table[a][b - 1].paths.map(x => [...x, '-' as const]));

      table[a][b] = { cost, paths };
    }
  }

  let bestScore = -Infinity;
  let bestResults: DiffleResult[] = [];

  table[answer.length][guess.length].paths.forEach((path) => {
    const start = path[0] === '>';
    const end = path[path.length - 1] === '>';
    const pattern: (0 | 1 | 2 | 3)[] = Array.from({ length: guess.length }, () => 0);
    const unusedLetter: string[] = Array.from(answer);

    let acceptCount = 0;
    let streakLength = 0;
    let score = 0;
    // Custom diffle-lang start and end should always win over coupling
    if (start) score += 1000;
    if (end) score += 500;

    let a = 0; let
      b = 0;
    for (let i = 0; i < path.length; i++) {
      switch (path[i]) {
        case '>':
          acceptCount++;
          streakLength++;
          pattern[b] = streakLength == 1 ? 2 : 3;
          unusedLetter.splice(unusedLetter.indexOf(guess[b]), 1);
          score += 3 * streakLength;
          a++;
          b++;
          break;
        case '+':
          streakLength = 0;
          a++;
          break;
        case '-':
          streakLength = 0;
          b++;
          break;
      }
    }

    // Yellow
    for (let i = 0; i < guess.length; i++) {
      if (pattern[i] == 0 && unusedLetter.includes(guess[i])) {
        pattern[i] = 1;
        unusedLetter.splice(unusedLetter.indexOf(guess[i]), 1);
      }
    }

    // If green in the middle the only marked character it turns it yellow
    // if (acceptCount == 1 && !start && !end) {
    //     pattern[pattern.indexOf(2)] = 1;
    // }

    if (bestScore == score) {
      bestResults.push({ pattern, start, end });
    } else if (bestScore < score) {
      bestScore = score;
      bestResults = [{ pattern, start, end }];
    }
  });

  bestResults.sort((a, b) => (a.pattern.join() < b.pattern.join() ? 1 : -1));
  return bestResults[0];
};

export default compareWords;
