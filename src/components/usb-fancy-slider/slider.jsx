import React from 'react';
import PropTypes from 'prop-types';
import styles from './slider.css';
import classNames from 'classnames';

const FancySlider = props => (
    <input
        {...props}
        type="range"
        onChange={props.onChange}
        className={classNames(styles.slider)}
    />
);

FancySlider.propTypes = {
    className: PropTypes.string
};

export default FancySlider;
