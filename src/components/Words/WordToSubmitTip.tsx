import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AffixStatus, WordStatus } from '@common-types';

import { capitalize } from '@utils/format';

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
  const {
    status: keyboardStatus,
    details: keyboardDetails,
    detailsStatus: keyboardDetailsStatus = '',
  } = useSelector(selectKeyboardState);
  const hasSpace = wordToSubmit.includes(' ');
  const isIncorrectType = [AffixStatus.Incorrect, AffixStatus.IncorrectOccurance].includes(
    wordStatus,
  )
    || [
      AffixStatus.IncorrectStart,
      AffixStatus.IncorrectMiddle,
      AffixStatus.IncorrectOrder,
      WordStatus.IncorrectOccuranceMissing,
      WordStatus.IncorrectPairWithLetterMissing,
      AffixStatus.IncorrectEnd,
    ].includes(keyboardStatus);

  const { t } = useTranslation();

  useScrollEffect('bottom', [wordToSubmit]);

  const {
    tipTextMain, tipText, tipDetails, tipDetailsStatus,
  } = useMemo(() => {
    let text = '';
    let details = '';
    let detailsStatus = '';
    let isImpossibleToWin = false;

    if (!isProcessing) {
      if (wordStatus === AffixStatus.Incorrect) {
        isImpossibleToWin = true;
        details = wordDetails ?? '';
        detailsStatus = 'unexpected';
        text = 'game.youCanUseIncorrectLetters';
      } else if (wordStatus === AffixStatus.IncorrectOccurance) {
        isImpossibleToWin = true;
        details = wordDetails ?? '';
        detailsStatus = 'unexpected';
        text = 'game.youCanUseLettersTypedTooManyTimes';
      } else if (keyboardStatus === AffixStatus.IncorrectStart) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectStart';
      } else if (keyboardStatus === AffixStatus.IncorrectMiddle) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectMiddle';
      } else if (keyboardStatus === AffixStatus.IncorrectOrder) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectOrder';
      } else if (keyboardStatus === AffixStatus.IncorrectEnd) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectEnd';
      } else if (keyboardStatus === WordStatus.IncorrectOccuranceMissing) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectOccuranceMissing';
      } else if (keyboardStatus === WordStatus.IncorrectPairWithLetterMissing) {
        isImpossibleToWin = true;
        details = keyboardDetails ?? '';
        detailsStatus = keyboardDetailsStatus;
        text = 'game.youCanUseIncorrectPairWithLetterMissing';
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    let tipTextMain = '';
    if (isProcessing) {
      tipTextMain = 'game.checking';
    } else if (isImpossibleToWin) {
      tipTextMain = 'game.youCanUseThisWordButNotWin';
    } else if (!text && hasSpace) {
      tipTextMain = 'game.youCanUseSpace';
    }

    return {
      tipTextMain,
      tipText: text,
      tipDetails: details,
      tipDetailsStatus: detailsStatus,
    };
  }, [
    hasSpace,
    isProcessing,
    keyboardStatus,
    keyboardDetails,
    keyboardDetailsStatus,
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
          {!isProcessing && tipTextMain && (
          <>
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t(tipTextMain),
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
              <>
                  {tipDetailsStatus
                  && (
                  <span>
                      {', '}
                      <span className={`status-tip-detawils-status--${tipDetailsStatus}`}>
                          {t(`game.youCanUseThisWe${capitalize(tipDetailsStatus)}`)}
                      </span>
                      :
                  </span>
                  )}
                  <strong
                    className={`status-tip-details status-tip-details-status--${tipDetailsStatus}`}
                  >
                      {tipDetails}
                  </strong>
              </>
              )}
              <span>)</span>
          </>
          )}
      </p>
  );
};

export default WordToSubmitTip;
