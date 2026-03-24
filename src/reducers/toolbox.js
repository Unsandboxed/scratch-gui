const UPDATE_TOOLBOX = 'scratch-gui/toolbox/UPDATE_TOOLBOX';
import makeToolboxXML from '../lib/make-toolbox-xml';
import makeOldToolboxXML from '../lib/make-old-toolbox-xml';
import {getSettings} from '../lib/themes/settingsPersistance';

const makeCorrectToolboxXML = function (vm, isInitialSetup) {
    if (getSettings().oldToolbox) {
        return makeOldToolboxXML(vm, isInitialSetup);
    } else {
        return makeToolboxXML(vm, isInitialSetup);
    }
};

const initialState = {
    toolboxXML: makeCorrectToolboxXML(null, true)
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_TOOLBOX:
        return Object.assign({}, state, {
            toolboxXML: action.toolboxXML
        });
    default:
        return state;
    }
};

const updateToolbox = function (toolboxXML) {
    return {
        type: UPDATE_TOOLBOX,
        toolboxXML: toolboxXML
    };
};

export {
    reducer as default,
    initialState as toolboxInitialState,
    updateToolbox
};
