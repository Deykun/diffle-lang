import { describe, expect, it } from '@jest/globals';

import { generateSeedForDay } from './date';

describe('generateSeedForDay', () => {
  it('should embed date inside number', () => {
    expect(generateSeedForDay({ day: 2, month: 6, year: 2025 })).toBe(201300601302025);
    expect(generateSeedForDay({ day: 3, month: 6, year: 2025 })).toBe(301300601302025);
    expect(generateSeedForDay({ day: 17, month: 6, year: 2025 })).toBe(1701300601302025);
    expect(generateSeedForDay({ day: 18, month: 6, year: 2025 })).toBe(1801300601302025);
    expect(generateSeedForDay({ day: 19, month: 10, year: 2025 })).toBe(1901301001302025);
    expect(generateSeedForDay({ day: 20, month: 10, year: 2025 })).toBe(2001301001302025);
  });

  it('should generate unique numbers for 3 years', () => {
    const seedsForFake3Years = [2023, 2024, 2025].reduce((yearsStack, year) => {
      const yearData = [...new Array(12)].reduce((monthsStack, _, monthIndex) => {
        const month = monthIndex + 1;

        const monthData = [...new Array(31)].reduce((daysStack, _, dayIndex) => {
          const day = dayIndex + 1;

          const seed = generateSeedForDay({ day, month, year });

          daysStack[seed] = true;

          return daysStack;
        }, {});

        return {
          ...monthsStack,
          ...monthData,
        };
      }, {});

      return {
        ...yearsStack,
        ...yearData,
      };
    }, {});

    expect(Object.keys(seedsForFake3Years).length).toBe(3 * 12 * 31);
  });
});
