import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AffixStatus } from '@common-types';

import { useSelector } from '@store';
import {
  selectIsProcessing,
  selectWordToSubmit,
  selectKeyboardState,
  selectWordState,
} from '@store/selectors';

import useScrollEffect from '@hooks/useScrollEffect';

import IconDashedCircle from '@components/Icons/IconDashedCircle';

const WordToSubmitTip = () => {
  const isProcessing = useSelector(selectIsProcessing);
  const wordToSubmit = useSelector(selectWordToSubmit);
  const { status: wordStatus, details: wordDetails } = useSelector(
    selectWordState(wordToSubmit),
  );
  const { status: keyboardStatus, details: keyboardDetails } = useSelector(selectKeyboardState);
  const hasSpace = wordToSubmit.includes(' ');
  const isIncorrectType = [AffixStatus.Incorrect, AffixStatus.IncorrectOccurance].includes(
    wordStatus,
  )
    || [
      AffixStatus.IncorrectStart,
      AffixStatus.IncorrectMiddle,
      AffixStatus.IncorrectOrder,
      AffixStatus.IncorrectEnd,
    ].includes(keyboardStatus);

  const { t } = useTranslation();

  useScrollEffect('bottom', [wordToSubmit]);

  const { isImpossibleToWin, tipText, tipDetails } = useMemo(() => {
    let text = '';
    let details = '';
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let isImpossibleToWin = false;

    if (isProcessing) {
      text = 'game.checking';
    } else if (wordStatus === AffixStatus.Incorrect) {
      isImpossibleToWin = true;
      details = wordDetails ?? '';
      text = 'game.youCanUseIncorrectLetters';
    } else if (wordStatus === AffixStatus.IncorrectOccurance) {
      isImpossibleToWin = true;
      details = wordDetails ?? '';
      text = 'game.youCanUseLettersTypedTooManyTimes';
    } else if (keyboardStatus === AffixStatus.IncorrectStart) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectStart';
    } else if (keyboardStatus === AffixStatus.IncorrectMiddle) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectMiddle';
    } else if (keyboardStatus === AffixStatus.IncorrectOrder) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectOrder';
    } else if (keyboardStatus === AffixStatus.IncorrectEnd) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectEnd';
    } else if (hasSpace) {
      text = 'game.youCanUseSpace';
    }

    return {
      isImpossibleToWin,
      tipText: text,
      tipDetails: details,
    };
  }, [
    hasSpace,
    isProcessing,
    keyboardStatus,
    keyboardDetails,
    wordStatus,
    wordDetails,
  ]);

  return (
      <p
        className={clsx('status-tip', {
          'is-processing': isProcessing,
          'is-incorrect': isIncorrectType,
          space: hasSpace,
        })}
      >
          {isProcessing && <IconDashedCircle />}
          {!isProcessing && isImpossibleToWin && (
          <>
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t('game.youCanUseThisWordButNotWin'),
                }}
              />
              <br />
          </>
          )}
          {tipText && (
          <>
              <span>(</span>
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t(tipText),
                }}
              />
              {tipDetails && (
              <strong className="status-tip-details">{tipDetails}</strong>
              )}
              <span>)</span>
          </>
          )}
      </p>
  );
};

export default WordToSubmitTip;
