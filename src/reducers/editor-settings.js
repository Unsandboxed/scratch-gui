import {getSettings} from '../lib/themes/settingsPersistance';

const STAGE_LAYOUT = 'editor-settings/STAGE_LAYOUT'

export const initialState = getSettings();

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case STAGE_LAYOUT:
        return Object.assign({}, state, {
            stageOnLeft: action.stageOnLeft
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

export {
    reducer as default,
    initialState as editorSettingsInitialState,
    changeStageLayout
};