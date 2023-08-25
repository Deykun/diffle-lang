import { SEED_SHIFT } from '@const';

export const generateSeedForDay = (
    { day, month, year }: { day: number, month: number, year: number}
) => {
    const stamp = `${('' + day).padStart(2, '0')}.${('' + month).padStart(2, '0')}.${year}`;

    const stampConvertedToNumber = Number(stamp.replaceAll('.', '0130')) + SEED_SHIFT;

    return stampConvertedToNumber;
};

export const getNow = () => {
    const nowLocal = new Date();
    const nowUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);

    const year = nowUTC.getFullYear();
    // DD.MM.YYYY (month is counted from 0)
    const month = nowUTC.getMonth() + 1;
    const day = nowUTC.getDate();

    const stamp = `${('' + day).padStart(2, '0')}.${('' + month).padStart(2, '0')}.${year}`;

    const dateSeed = generateSeedForDay({ day, month, year });

    return {
        stamp,
        year,
        month,
        day,
        nowUTC,
        dateSeed
    };
};

export const getYesterdaysSeed = () => {
    const nowLocal = new Date();
    const dateUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);
    dateUTC.setDate(dateUTC.getDate() - 1);

    const year = dateUTC.getFullYear();
    // DD.MM.YYYY (month is counted from 0)
    const month = dateUTC.getMonth() + 1;
    const day = dateUTC.getDate();

    return generateSeedForDay({ day, month, year });
};
