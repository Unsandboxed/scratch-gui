const UPDATE_CAMERA = 'scratch-gui/camera/UPDATE_CAMERA';

const initialState = {
    camera: {
        x: 0,
        y: 0
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_CAMERA:
        return {
            camera: action.camera
        };
    default:
        return state;
    }
};

const updateCamera = function (camera) {
    return {
        type: UPDATE_CAMERA,
        camera: camera,
        meta: {
            throttle: 30
        }
    };
};

export {
    reducer as default,
    initialState as cameraInitialState,
    updateCamera
};
