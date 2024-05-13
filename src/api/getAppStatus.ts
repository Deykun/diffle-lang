type GetAppStatusReport = {
  shouldUpdate: boolean,
  shouldResetStore: boolean,
};

const LAST_BREAKING_CHANGES_APP = '3.22.2';
const LAST_BREAKING_CHANGES_STORE = '2.0';

export const getAppStatus = async (): Promise<GetAppStatusReport> => {
  try {
    const response = await fetch('./app-status.json').catch((error) => {
      throw error;
    });

    if (response?.status === 404) {
      return {
        shouldResetStore: false,
        shouldUpdate: false,
      };
    }

    const result = await response.json();

    const shouldUpdate = result?.lastBreakingChangesApp !== LAST_BREAKING_CHANGES_APP;

    const shouldResetStore = result?.lastBreakingChangesStore !== LAST_BREAKING_CHANGES_STORE;

    return {
      shouldResetStore,
      shouldUpdate,
    };
  } catch (error) {
    //
  }

  return {
    shouldResetStore: false,
    shouldUpdate: false,
  };
};

export default getAppStatus;
