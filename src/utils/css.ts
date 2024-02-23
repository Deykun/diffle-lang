export const getCssVarValue = (propertyName: string) => {
  const root = document.querySelector(':root');

  if (!root) {
    return undefined;
  }

  const rootComputedStyles = getComputedStyle(root);

  return rootComputedStyles.getPropertyValue(propertyName);
};

const getMillisecondsFromTimeValue = (value: string) => {
  const numberFormatValue = value.startsWith('.') ? `0${value}` : value;

  const valueNumber = Number(numberFormatValue.replace(/[a-z]+/g, ''));

  if (!valueNumber) {
    return 0;
  }

  const isMilliseconds = numberFormatValue.includes('ms');

  return isMilliseconds ? valueNumber : valueNumber * 1000;
};

export const getCssVarMillisecondsValue = (propertyName: string) => {
  const value = getCssVarValue(propertyName);

  if (!value) {
    return 0;
  }

  return getMillisecondsFromTimeValue(value);
};
