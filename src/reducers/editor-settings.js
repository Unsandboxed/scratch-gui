import {getSettings} from '../lib/themes/settingsPersistance';

const STAGE_LAYOUT = 'editor-settings/STAGE_LAYOUT'
const STAGE_CORNERS = 'editor-settings/STAGE_CORNERS'
const OLD_TOOLBOX = 'editor-settings/OLD_TOOLBOX'

export const initialState = getSettings();

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case STAGE_LAYOUT:
        return Object.assign({}, state, {
            stageOnLeft: action.stageOnLeft
        });
    case STAGE_CORNERS:
        return Object.assign({}, state, {
            stageRoundCorners: action.stageRoundCorners
        });
    case OLD_TOOLBOX:
        return Object.assign({}, state, {
            oldToolbox: action.oldToolbox
        });
    default:
        return state;
    }
};

const changeStageLayout = function (setting) {
    return {
        type: STAGE_LAYOUT,
        stageOnLeft: setting['stageOnLeft']
    };
};

const changeStageCorners = function (setting) {
    return {
        type: STAGE_CORNERS,
        stageRoundCorners: setting['stageRoundCorners']
    };
};

const changeToolbox = function (setting) {
    return {
        type: OLD_TOOLBOX,
        oldToolbox: setting['oldToolbox']
    };
};

export {
    reducer as default,
    initialState as editorSettingsInitialState,
    changeStageLayout,
    changeStageCorners,
    changeToolbox
};