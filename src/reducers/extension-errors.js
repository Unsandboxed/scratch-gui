const ADD_EXTENSION_ERROR = 'extension-errors/ADD';
const REMOVE_EXTENSION_ERROR = 'extension-errors/REMOVE';
const CLEAR_EXTENSION_ERRORS = 'extension-errors/CLEAR';

const extensionErrorsInitialState = [];

const normalizeErrorType = errorType => (
    `${errorType || ''}`.trim().toLowerCase() === 'warning' ? 'warning' : 'error'
);

const extensionErrorsReducer = (state = extensionErrorsInitialState, action) => {
    switch (action.type) {
    case ADD_EXTENSION_ERROR:
        // Keep at most 5 errors; newest at end
        return [...state.slice(-4), action.error];
    case REMOVE_EXTENSION_ERROR:
        return state.filter(e => e.id !== action.id);
    case CLEAR_EXTENSION_ERRORS:
        return [];
    default:
        return state;
    }
};

let _idCounter = 0;

const addExtensionError = ({spriteName, message, blockId, errorType}) => ({
    type: ADD_EXTENSION_ERROR,
    error: {
        id: _idCounter++,
        spriteName: spriteName || '',
        message: message || '',
        blockId: blockId || null,
        errorType: normalizeErrorType(errorType)
    }
});

const removeExtensionError = id => ({type: REMOVE_EXTENSION_ERROR, id});
const clearExtensionErrors = () => ({type: CLEAR_EXTENSION_ERRORS});

export {
    extensionErrorsReducer as default,
    extensionErrorsInitialState,
    addExtensionError,
    removeExtensionError,
    clearExtensionErrors
};
