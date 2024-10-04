import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import Pause from '../pause/pause.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import FramerateIndicator from '../tw-framerate-indicator/framerate-indicator.jsx';
import VolumeSlider from '../vol-slider/vol-slider.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    pauseTitle: {
        id: 'gui.controls.pause',
        defaultMessage: 'Pause',
        description: 'Pause button title'
    },
    playTitle: {
        id: 'gui.controls.play',
        defaultMessage: 'Unpause',
        description: 'Unpause button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    }
});

const Controls = function (props) {
    const {
        active,
        className,
        intl,
        onGreenFlagClick,
        onPauseClick,
        onStopAllClick,
        onVolumeClick,
        onVolumeChange,
        turbo,
        paused,
        volume,
        framerate,
        interpolation,
        isSmall,
        isHidden,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            {!isHidden && (
                <GreenFlag
                    active={active}
                    title={intl.formatMessage(messages.goTitle)}
                    onClick={onGreenFlagClick}
                    turboMode={turbo}
                />
            )}
            {!isHidden && (
                <Pause
                    active={active}
                    title={intl.formatMessage(paused ? messages.playTitle : messages.pauseTitle)}
                    onClick={onPauseClick}
                    paused={paused}
                />
            )}
            {!isHidden && (
                <StopAll
                    active={active}
                    title={intl.formatMessage(messages.stopTitle)}
                    onClick={onStopAllClick}
                />
            )}
            {!(isSmall || isHidden) && (
                <FramerateIndicator
                    framerate={framerate}
                    interpolation={interpolation}
                />
            )}
            {!(isSmall || isHidden) && (
                <VolumeSlider onChange={onVolumeChange} onClick={onVolumeClick} volume={volume} />
            )}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onPauseClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onVolumeClick: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    framerate: PropTypes.number,
    interpolation: PropTypes.bool,
    isSmall: PropTypes.bool,
    isHidden: PropTypes.bool,
    turbo: PropTypes.bool,
    paused: PropTypes.bool,
    volume: PropTypes.number
};

Controls.defaultProps = {
    active: false,
    turbo: false,
    paused: false,
    isSmall: false,
    isHidden: false,
    volume: 100
};

export default injectIntl(Controls);
