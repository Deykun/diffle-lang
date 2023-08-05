export const generateSeedForDay = (
    { day, month, year }: { day: number, month: number, year: number}
) => {
    const stamp = `${('' + day).padStart(2, '0')}.${('' + month).padStart(2, '0')}.${year}`;

    const stampConvertedToNumber = Number(stamp.replaceAll('.', '0130'));

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

