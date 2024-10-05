import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import muteIcon from './mute.svg';
import quietIcon from './quiet.svg';
import loudIcon from './loud.svg';
import styles from './vol-slider.css';

const VolumeComponent = function (props) {
        const {
            className,
            volume,
            onChange,
            onClick,
            onBlur,
            ...componentProps
        } = props;
        const imageRef = React.useRef(0);
        const image = (<img
            ref={imageRef}
            icons={[muteIcon, quietIcon, loudIcon]}
            className={styles.volSliderIcon}
            src={imageRef.current}
            onClick={onClick}
        />);
        imageRef.current = volume === 0 ? muteIcon : (volume < 0.5 ? quietIcon : loudIcon);
        return (
            <div 
                className={styles.volSlider}
            >
                <div className={styles.volSliderInner}>
                    {image}
                <input
                    className={classNames(
                        styles.volSliderInput
                    )}
                    type={"range"}
                    min={"0"}
                    max={"1"}
                    step={"0.02"}
                    onChange={(...args) => onChange(image, ...args)}
                    value={volume}
                />
                </div>
            </div>
        );
}

VolumeComponent.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    volume: PropTypes.number
};

VolumeComponent.defaultProps = {
    volume: 1
};

export default VolumeComponent;
