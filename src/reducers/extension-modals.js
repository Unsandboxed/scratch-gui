const OPEN_EXTENSION_MODAL = 'scratch-gui/extension-modals/OPEN_EXTENSION_MODAL';
const CLOSE_EXTENSION_MODAL = 'scratch-gui/extension-modals/CLOSE_EXTENSION_MODAL';
const UPDATE_EXTENSION_MODAL = 'scratch-gui/extension-modals/UPDATE_EXTENSION_MODAL';
const CLEAR_EXTENSION_MODALS = 'scratch-gui/extension-modals/CLEAR_EXTENSION_MODALS';

const initialState = {
    modals: {}
};

const extensionModalsReducer = function (state = initialState, action) {
    switch (action.type) {
    case OPEN_EXTENSION_MODAL: {
        const id = `${action.payload.id || ''}`.trim();
        if (!id) return state;
        return {
            ...state,
            modals: {
                ...state.modals,
                [id]: {
                    ...(state.modals[id] || {}),
                    ...action.payload,
                    id,
                    isOpen: true
                }
            }
        };
    }
    case UPDATE_EXTENSION_MODAL: {
        const id = `${action.payload.id || ''}`.trim();
        if (!id || !state.modals[id]) return state;
        return {
            ...state,
            modals: {
                ...state.modals,
                [id]: {
                    ...state.modals[id],
                    ...action.payload,
                    id
                }
            }
        };
    }
    case CLOSE_EXTENSION_MODAL: {
        const id = `${action.payload.id || ''}`.trim();
        if (!id || !state.modals[id]) return state;
        const nextModals = {
            ...state.modals
        };
        delete nextModals[id];
        return {
            ...state,
            modals: nextModals
        };
    }
    case CLEAR_EXTENSION_MODALS:
        return initialState;
    default:
        return state;
    }
};

const openExtensionModal = payload => ({
    type: OPEN_EXTENSION_MODAL,
    payload
});

const updateExtensionModal = payload => ({
    type: UPDATE_EXTENSION_MODAL,
    payload
});

const closeExtensionModal = id => ({
    type: CLOSE_EXTENSION_MODAL,
    payload: {id}
});

const clearExtensionModals = () => ({
    type: CLEAR_EXTENSION_MODALS
});

const getOpenExtensionModals = state => {
    const modals = state && state.scratchGui && state.scratchGui.extensionModals
        ? state.scratchGui.extensionModals.modals
        : {};
    return Object.values(modals);
};

export {
    extensionModalsReducer as default,
    initialState as extensionModalsInitialState,
    openExtensionModal,
    updateExtensionModal,
    closeExtensionModal,
    clearExtensionModals,
    getOpenExtensionModals
};
