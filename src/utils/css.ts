export const getCssVarValue = (propertyName: string) => {
    const root = document.querySelector(':root');

    if (!root) {
        return;
    }

    const rootComputedStyles = getComputedStyle(root);

    return rootComputedStyles.getPropertyValue(propertyName);
};

const getMillisecondsFromTimeValue = (value: string) => {
    value = value.startsWith('.') ? `0${value}` : value;

    const valueNumber = Number(value.replace(/[a-z]+/g, ''));

    if (!valueNumber) {
        return 0;
    }

    const isMilliseconds = value.includes('ms');

    return isMilliseconds ? valueNumber : valueNumber * 1000;    
};

export const getCssVarMillisecondsValue = (propertyName: string) => {
    const value = getCssVarValue(propertyName);

    if (!value) {
        return 0;
    }

    return getMillisecondsFromTimeValue(value);
}
