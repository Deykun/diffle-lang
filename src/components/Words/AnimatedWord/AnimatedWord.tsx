import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Affix as AffixType } from "@common-types";

import Button from "@components/Button/Button";

import styles from "./word.module.css";

type Props = {
  affixes: AffixType[];
};

export const AnimatedWord = ({ affixes }: Props) => {
  const [isJoined, setIsJoined] = useState(true);
  const wordRef = useRef<HTMLDivElement>(null);

  const length = affixes.reduce((total, { text }) => total + text.length, 0);

  /*
    CSS can't transition to width: auto, so joined letters get their natural width as variables (in em, so they scale).
    Kerning is read from hidden pairs of neighbours, rendered as one text run the way Affix renders them.
  */
  useLayoutEffect(() => {
    const setLetterWidths = () => {
      const word = wordRef.current;
      const fontSize = word ? parseFloat(getComputedStyle(word).fontSize) : 0;

      if (!word || !fontSize) {
        return;
      }

      const letters = Array.from(
        word.querySelectorAll<HTMLElement>("[data-letter]"),
      );

      const pairs = letters.map((letter) => {
        const nextLetter = letter.nextElementSibling;

        if (!nextLetter) {
          return undefined;
        }

        const pair = document.createElement("span");
        pair.className = styles.pair;
        pair.textContent = `${letter.textContent}${nextLetter.textContent}`;
        word.append(pair);

        return pair;
      });

      const glyphWidths = letters.map(
        (letter) =>
          letter.firstElementChild?.getBoundingClientRect().width || 0,
      );
      const kernings = pairs.map((pair, index) => {
        if (!pair) {
          return 0;
        }

        const letterSpacing =
          parseFloat(getComputedStyle(pair).letterSpacing) || 0;

        return (
          pair.getBoundingClientRect().width -
          2 * letterSpacing -
          glyphWidths[index] -
          glyphWidths[index + 1]
        );
      });

      pairs.forEach((pair) => pair?.remove());

      letters.forEach((letter, index) => {
        letter.style.setProperty(
          "--glyph-width",
          `${glyphWidths[index] / fontSize}em`,
        );
        letter.style.setProperty(
          "--kerning",
          `${kernings[index] / fontSize}em`,
        );
      });
    };

    setLetterWidths();
    // Widths change once the web font replaces the fallback one
    document.fonts?.ready.then(setLetterWidths);
  }, [affixes]);

  return (
    <div className={styles.container}>
      <Button onClick={() => setIsJoined((value) => !value)} isInverted>
        {isJoined ? "Split letters" : "Join letters"}
      </Button>
      <div
        ref={wordRef}
        className={clsx(styles.word, {
          [styles["word--is-joined"]]: isJoined,
          [styles["word--is-long"]]: length > 12,
          [styles["word--is-extra-long"]]: length > 15,
        })}
      >
        {affixes.map(({ text, type, subtype, isStart, isEnd }, affixIndex) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`affix-${affixIndex}`}
            className={clsx(styles.affix, styles[`affix--${type}`], {
              [styles["affix--typed-incorrect"]]: subtype === "typed-incorrect",
              [styles["affix--start"]]: isStart,
              [styles["affix--end"]]: isEnd,
            })}
          >
            {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
            {[...text.replaceAll("ß", "ẞ")].map((letter, letterIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <span
                key={`letter-${letterIndex}`}
                className={styles.letter}
                data-letter
              >
                <span className={styles.glyph}>{letter}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};
