export const getCssVarValue = (propertyName: string) => {
    const root = document.querySelector(':root');

    if (!root) {
        return;
    }

    const rootComputedStyles = getComputedStyle(root);

    return rootComputedStyles.getPropertyValue(propertyName);
};

export const getCssVarMillisecondsValue = (propertyName: string) => {
    const value = getCssVarValue(propertyName);

    if (!value) {
        return 0;
    }

    const valueNumber = Number(value?.replace(/\D/g,''));

    if (!valueNumber) {
        return 0;
    }


    const isMilliseconds = value.includes('ms');

    return isMilliseconds ? valueNumber : valueNumber * 1000;    
}
