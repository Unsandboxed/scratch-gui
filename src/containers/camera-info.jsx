import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import CameraInfoComponent from '../components/camera-info/camera-info.jsx';

class CameraInfo extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return (
            <CameraInfoComponent
                {...this.props}
            />
        );
    }
}

CameraInfo.propTypes = {
    ...CameraInfoComponent.propTypes,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    onChangeZoom: PropTypes.func,
    onChangeDirection: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    zoom: PropTypes.number,
    direction: PropTypes.number
};

export default CameraInfo;
