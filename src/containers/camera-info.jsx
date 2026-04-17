import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import CameraInfoComponent from '../components/camera-info/camera-info.jsx';

class CameraInfo extends React.Component {
    constructor (props) {
        super(props);

        bindAll(this, [
            'handleToggleCollapsed'
        ]);

        this.state = {
            isCollapsed: false
        };
    }

    handleToggleCollapsed () {
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed
        }));
    }

    render () {
        return (
            <CameraInfoComponent
                {...this.props}
                isCollapsed={this.state.isCollapsed}
                onToggleCollapsed={this.handleToggleCollapsed}
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
    onToggleCollapsed: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    zoom: PropTypes.number,
    direction: PropTypes.number
};

export default CameraInfo;
