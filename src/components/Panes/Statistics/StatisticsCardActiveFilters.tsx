import { Fragment } from 'react';

import { ModeFilter, CharactersFilter, LengthFilter, Filters } from '@utils/statistics';

import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import './StatisticsCard.scss';

const IconPerMode = {
    all: IconLayersAlt,
    [ModeFilter.Daily]: IconDay,
    [ModeFilter.Practice]: IconInfinity,
};

const IconPerCharacters = {
    all: IconLayersAlt,
    [CharactersFilter.NoSpecial]: IconFlag,
    [CharactersFilter.Special]: IconFlagAlt,
};

const IconPerLength = {
    all: IconLayersAlt,
    [LengthFilter.Short]: IconRulerSmall,
    [LengthFilter.Long]: IconRulerBig,
};



const StatisticsCardActiveFilters = ({
    modeFilter,
    charactersFilter,
    lengthFilter,
}: Filters) => {
    const totalOfAll = [modeFilter, charactersFilter, lengthFilter].filter(filter => filter === 'all').length;
    const hasManyAll = totalOfAll > 1;

    const IconMode = hasManyAll && modeFilter === 'all' ? Fragment : IconPerMode[modeFilter];
    const IconCharacters = hasManyAll && charactersFilter === 'all' ? Fragment : IconPerCharacters[charactersFilter];
    const IconLength = hasManyAll && lengthFilter === 'all' ? Fragment : IconPerLength[lengthFilter];
    

    return (
        <span className="footer-filters">
            <IconMode />
            <IconCharacters />
            <IconLength />
            {hasManyAll && <span><span>{totalOfAll}x</span> <IconLayersAlt /></span>}
        </span>
    )
};

export default StatisticsCardActiveFilters;
