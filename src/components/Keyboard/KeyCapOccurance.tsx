import clsx from 'clsx';

import {
  LetterReportStatus,
} from '@common-types';

import { useSelector } from '@store';
import { selectLetterSubreport } from '@store/selectors';

import './KeyCap.scss';

interface Props {
  text: string,
}

const KeyCapOccurance = ({ text }: Props) => {
  const {
    status,
    isLimitKnown,
    typedOccurrence = 0,
    confirmedOccurrence = 0,
  } = useSelector(selectLetterSubreport(text));

  if (status === LetterReportStatus.Ignored) {
    return null;
  }

  return (
      <span className={clsx('key-occurance', {
        'key-occurance-too-many': status === LetterReportStatus.TooManyLetters,
      })}
      >
          <span className="key-occurance-typed">
              {typedOccurrence !== 0 && isLimitKnown ? typedOccurrence : Math.min(typedOccurrence, confirmedOccurrence)}
          </span>
          <span className="key-occurance-separator">{typedOccurrence === 0 ? '×' : '/'}</span>
          <span className="key-occurance-known-limit">{confirmedOccurrence}</span>
      </span>
  );
};

export default KeyCapOccurance;
