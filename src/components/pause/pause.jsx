import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import playIcon from './icon--play.svg';
import pauseIcon from './icon--pause.svg';
import styles from './pause.css';

const PauseComponent = function (props) {
    const {
        active,
        className,
        onClick,
        title,
        paused,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.pause,
                {
                    [styles.isActive]: active
                }
            )}
            draggable={false}
            src={paused ? playIcon : pauseIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

PauseComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    paused: PropTypes.bool,
};

PauseComponent.defaultProps = {
    active: false,
    title: 'Stop',
    paused: false
};

export default PauseComponent;
