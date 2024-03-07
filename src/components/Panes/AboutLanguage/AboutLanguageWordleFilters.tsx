import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { BestWordleType } from '@common-types';

import { capitalize } from '@utils/format';

import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';

import Button from '@components/Button/Button';

interface Props {
  filterGroupBy: BestWordleType,
  setFilterGroupBy: Dispatch<SetStateAction<BestWordleType>>,
}

const AboutLanguageWordleFilters = ({
  filterGroupBy,
  setFilterGroupBy,
}: Props) => {
  const { handleClickSummary } = useEnhancedDetails();

  const { t } = useTranslation();

  return (
      <details className="about-language-wordle">
          <summary onClick={handleClickSummary}>
              <h3>{t('statistics.filters')}</h3>
              <IconAnimatedCaret className="details-icon" />
          </summary>
          <div className="details-content">
              <h5>{t('statistics.filterWordleLettersTitle')}</h5>
              <nav>
                  {[
                    BestWordleType.InWords,
                    BestWordleType.LetterPosition,
                    BestWordleType.UniqueLetterPosition,
                  ].map(filter => (
                      <Button
                        key={filter}
                        onClick={() => setFilterGroupBy(filter)}
                        isInverted
                        hasBorder={false}
                        isText={filterGroupBy !== filter}
                      >
                          {t(`statistics.filterWordle${capitalize(filter)}`)}
                      </Button>
                  ))}
              </nav>
              <h5>{t('statistics.filterWordleMaxTitle')}</h5>
              <nav>
                  {[
                    BestWordleType.BestMaxGreen,
                    BestWordleType.BestMax,
                    BestWordleType.BestMaxOrange,
                    BestWordleType.BestMaxGray,
                  ].map(filter => (
                      <Button
                        key={filter}
                        onClick={() => setFilterGroupBy(filter)}
                        isInverted
                        hasBorder={false}
                        isText={filterGroupBy !== filter}
                      >
                          {t(`statistics.filter${capitalize(filter)}`)}
                      </Button>
                  ))}
              </nav>
              <h5>{t('statistics.filterWordleBestTitle')}</h5>
              <nav>
                  {[
                    BestWordleType.BestGreen1_5,
                    BestWordleType.BestGreen2_0,
                  ].map(filter => (
                      <Button
                        key={filter}
                        onClick={() => setFilterGroupBy(filter)}
                        isInverted
                        hasBorder={false}
                        isText={filterGroupBy !== filter}
                      >
                          {t(`statistics.filter${capitalize(filter)}`)}
                      </Button>
                  ))}
              </nav>
          </div>
      </details>
  );
};

export default AboutLanguageWordleFilters;
