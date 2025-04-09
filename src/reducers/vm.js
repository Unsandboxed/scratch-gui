import VM from 'scratch-vm';
import storage from '../lib/storage';
import {MAXIMUM_CLOUD_VARIABLES} from '../lib/tw-cloud-limits';

const SET_VM = 'scratch-gui/vm/SET_VM';
const defaultVM = (() => {
    try {
        return new VM();
    } catch (e) {
        // Don't use log.error, the GUI messes up
        console.error('Failed to construct VM', e);
        throw e;
    }
})();
defaultVM.setCompatibilityMode(false);
defaultVM.runtime.cloudOptions.limit = MAXIMUM_CLOUD_VARIABLES;
defaultVM.attachStorage(storage);
const initialState = defaultVM;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_VM:
        return action.vm;
    default:
        return state;
    }
};
const setVM = function (vm) {
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};
