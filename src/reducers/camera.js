const CAMERA_UPDATE = 'scratch-gui/camera/CAMERA_UPDATE';

const initialState = {
    camera: {
        x: 0,
        y: 0
    }
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CAMERA_UPDATE:
        return {
            camera: action.camera
        };
    default:
        return state;
    }
};

const updateCamera = function (camera) {
    return {
        type: CAMERA_UPDATE,
        camera: camera
    };
};

export {
    reducer as default,
    initialState as cameraInitialState,
    updateCamera
};
