import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './vol-slider.css';

const VolumeComponent = function (props) {
    const {
        className,
        volume,
        ...componentProps
    } = props;
    return (<div>{volume}</div>);
};

VolumeComponent.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number
};

VolumeComponent.defaultProps = {
    volume: 100
};

export default VolumeComponent;
