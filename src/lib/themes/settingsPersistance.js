const STORAGE_KEY = 'usb:settings';

const defaultSettings = {
    stageOnLeft: false,
    oldToolbox: false,
};

/**
 * @returns {object} the settings
 */
const getSettings = () => {
    try {
        const local = localStorage.getItem(STORAGE_KEY);

        let parsed = JSON.parse(local);
        if (!parsed) parsed = defaultSettings;

        return parsed;
    } catch (e) {
        // ignore
    }

    return defaultSettings;
};

/**
 * @param {object} settings
 */
const changeSettings = settingsChanged => {
    let settings = getSettings();

    settings = {...settings, ...settingsChanged};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export {
    defaultSettings,
    getSettings,
    changeSettings
};
