import { SEED_SHIFT } from '@const';

export const generateSeedForDay = (
  { day, month, year }: { day: number, month: number, year: number },
) => {
  const stamp = `${(`${day}`).padStart(2, '0')}.${(`${month}`).padStart(2, '0')}.${year}`;

  const stampConvertedToNumber = Number(stamp.replaceAll('.', '0130')) + SEED_SHIFT;

  return stampConvertedToNumber;
};

// https://stackoverflow.com/a/40975730/6743808
const getDayIntoYear = (date: Date) => {
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
};

export const getNow = () => {
  const nowLocal = new Date();
  const nowUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);

  const year = nowUTC.getFullYear();
  // DD.MM.YYYY (month is counted from 0)
  const month = nowUTC.getMonth() + 1;
  const day = nowUTC.getDate();

  const stampDateWithoutYear = `${(`${day}`).padStart(2, '0')}.${(`${month}`).padStart(2, '0')}`;

  const stamp = `${stampDateWithoutYear}.${year}`;

  const stampOnlyTime = [
    `${(`${nowUTC.getHours()}`).padStart(2, '0')}`,
    `${(`${nowUTC.getMinutes()}`).padStart(2, '0')}`,
    `${(`${nowUTC.getSeconds()}`).padStart(2, '0')}`,
  ].join(':');

  const dateSeed = generateSeedForDay({ day, month, year });

  return {
    stamp,
    stampDateWithoutYear,
    stampOnlyTime,
    year,
    month,
    day,
    nowUTC,
    dateSeed,
    dayIntoYear: getDayIntoYear(nowUTC),
  };
};

const getNowWithAddDays = (numberOfDaysToAdd: number) => {
  const nowLocal = new Date();
  const dateUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);
  dateUTC.setDate(dateUTC.getDate() + numberOfDaysToAdd);

  const year = dateUTC.getFullYear();
  // DD.MM.YYYY (month is counted from 0)
  const month = dateUTC.getMonth() + 1;
  const day = dateUTC.getDate();

  const stampDateWithoutYear = `${(`${day}`).padStart(2, '0')}.${(`${month}`).padStart(2, '0')}`;
  const stamp = `${stampDateWithoutYear}.${year}`;

  return {
    stamp,
    seed: generateSeedForDay({ day, month, year }),
  };
};

export const getYesterdaysSeed = () => {
  return getNowWithAddDays(-1).seed;
};

export const getYesterdaysStamp = () => {
  return getNowWithAddDays(-1).stamp;
};

export const getTommorowSeed = () => {
  return getNowWithAddDays(1).seed;
};

export const getTimeUpdateFromTimeStamp = (timeToCompare: number) => {
  const now = new Date().getTime();

  if (!timeToCompare) {
    return {
      now,
      timePassed: 0,
    };
  }

  const timePassed = Math.abs(timeToCompare - now);

  const inactivityBreakPointInMS = 60 * 1000;

  const shouldIgnoreDueToInactivity = timePassed > inactivityBreakPointInMS;
  if (shouldIgnoreDueToInactivity) {
    return {
      now,
      timePassed: 0,
    };
  }

  return {
    now,
    timePassed,
  };
};

export const convertMillisecondsToTime = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  const millisecondsRest = Math.floor(milliseconds % 1000);

  return {
    hours,
    minutes,
    seconds,
    milliseconds: millisecondsRest,
  };
};

export const getNumberFromStamp = (date: string) => Number(date.split('.').reverse().join(''));

export const getIsFirstStampInFuture = (dateA: string, dateB: string) => getNumberFromStamp(dateA) > getNumberFromStamp(dateB);
