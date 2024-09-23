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
    x: PropTypes.number,
    y: PropTypes.number
};

export default CameraInfo;
