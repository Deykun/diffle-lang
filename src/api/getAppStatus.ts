type getAppStatusReport = {
    shouldUpdate: boolean,
}

const LAST_BREAKING_CHANGES_APP = '2.0';

export const getAppStatus = async (): Promise<getAppStatusReport> => {


    try {
        const response = await fetch(`./app-status.json`).catch(error => {
            throw error;
        });

        if (response?.status === 404) {
            return {
                shouldUpdate: false,
            };
        }

        const result = await response.json();

        const shouldUpdate = result?.lastBreakingChangesApp !== LAST_BREAKING_CHANGES_APP;
        
        return {
            shouldUpdate,
        };
    } catch (error) {
        // 
    }

    return {
        shouldUpdate: false,
    };
};

export default getAppStatus;
