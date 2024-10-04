const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_TURBO_STATE = 'scratch-gui/vm-status/SET_TURBO_STATE';
const SET_STARTED_STATE = 'scratch-gui/vm-status/SET_STARTED_STATE';
const UPDATE_PAUSE_STATE = 'scratch-gui/vm-status/UPDATE_PAUSE_STATE';
const SET_VOLUME = 'scratch-gui/vm-status/SET_VOLUME';

const initialState = {
    running: false,
    started: false,
    turbo: false,
    paused: false,
    volume: 100
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_STARTED_STATE:
        return Object.assign({}, state, {
            started: action.started
        });
    case SET_RUNNING_STATE:
        return Object.assign({}, state, {
            running: action.running
        });
    case SET_TURBO_STATE:
        return Object.assign({}, state, {
            turbo: action.turbo
        });
    case UPDATE_PAUSE_STATE:
        return Object.assign({}, state, {
            paused: action.paused
        });
    case SET_VOLUME:
        return Object.assign({}, state, {
            volume: action.volume
        });
    default:
        return state;
    }
};

const setStartedState = function (started) {
    return {
        type: SET_STARTED_STATE,
        started: started
    };
};


const setRunningState = function (running) {
    return {
        type: SET_RUNNING_STATE,
        running: running
    };
};

const setTurboState = function (turbo) {
    return {
        type: SET_TURBO_STATE,
        turbo: turbo
    };
};

const updatePauseState = function (paused) {
    return {
        type: UPDATE_PAUSE_STATE,
        paused: paused
    };
};

const setVolume = function (volume) {
    return {
        type: SET_VOLUME,
        volume: volume
    };
};

export {
    reducer as default,
    initialState as vmStatusInitialState,
    setRunningState,
    setStartedState,
    setTurboState,
    updatePauseState,
    setVolume
};
