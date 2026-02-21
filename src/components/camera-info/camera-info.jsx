import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';

import {injectIntl, intlShape, defineMessages, FormattedMessage} from 'react-intl';

import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {isWideLocale} from '../../lib/locale-utils.js';

import styles from './camera-info.css';

import xIcon from './icon--x.svg';
import yIcon from './icon--y.svg';
import centerIcon from '!../../lib/tw-recolor/build!./icon--center.svg';
import centerOnTargetIcon from '!../../lib/tw-recolor/build!./icon--center-on-target.svg';
import ToggleButtons from '../toggle-buttons/toggle-buttons.jsx';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    centerCameraAction: {
        id: 'gui.CameraInfo.centerCameraAction',
        defaultMessage: 'Move to origin',
        description: 'Tooltip for center button'
    },
    centerOnTargetAction: {
        id: 'gui.CameraInfo.centerOnTargetAction',
        defaultMessage: 'Move to current sprite',
        description: 'Tooltip for center-on-target button'
    }
});

class CameraInfo extends React.Component {
    shouldComponentUpdate (nextProps) {
        return (
            this.props.stageSize !== nextProps.stageSize ||
            // Only update these if rounded value has changed
            // Math.round(this.props.direction) !== Math.round(nextProps.direction) ||
            // Math.round(this.props.size) !== Math.round(nextProps.size) ||
            Math.round(this.props.x) !== Math.round(nextProps.x) ||
            Math.round(this.props.y) !== Math.round(nextProps.y)
        );
    }
    render () {
        const {
            stageSize
        } = this.props;

        const camera = (
            <FormattedMessage
                defaultMessage="Camera"
                description="Camera info label"
                id="gui.CameraInfo.camera"
            />
        );

        const labelAbove = isWideLocale(this.props.intl.locale);

        const xPosition = (
            <div className={styles.group}>
                {
                    (stageSize === STAGE_DISPLAY_SIZES.full || stageSize === STAGE_DISPLAY_SIZES.large) ?
                        <div className={styles.iconWrapper}>
                            <img
                                aria-hidden="true"
                                className={classNames(styles.xIcon, styles.icon)}
                                src={xIcon}
                                draggable={false}
                            />
                        </div> :
                        null
                }
                <Label text="x">
                    <BufferedInput
                        small
                        placeholder="x"
                        tabIndex="0"
                        type="number"
                        value={Math.round(this.props.x)}
                        onSubmit={this.props.onChangeX}
                    />
                </Label>
            </div>
        );

        const yPosition = (
            <div className={styles.group}>
                {
                    (stageSize === STAGE_DISPLAY_SIZES.full || stageSize === STAGE_DISPLAY_SIZES.large) ?
                        <div className={styles.iconWrapper}>
                            <img
                                aria-hidden="true"
                                className={classNames(styles.yIcon, styles.icon)}
                                src={yIcon}
                                draggable={false}
                            />
                        </div> :
                        null
                }
                <Label text="y">
                    <BufferedInput
                        small
                        placeholder="y"
                        tabIndex="0"
                        type="number"
                        value={Math.round(this.props.y)}
                        onSubmit={this.props.onChangeY}
                    />
                </Label>
            </div>
        );

        if (stageSize === STAGE_DISPLAY_SIZES.small) {
            return (
                <Box className={styles.cameraInfo}>
                    <div className={classNames(styles.row)}>
                        {xPosition}
                        {yPosition}
                    </div>
                </Box>
            );
        }

        return (
            <Box className={styles.cameraInfo}>
                <div className={classNames(styles.row)}>
                    <div className={styles.group}>
                        <Label
                            above={labelAbove}
                            text={camera}
                        >
                        </Label>
                    </div>
                    {xPosition}
                    {yPosition}
                    <ToggleButtons
                        buttons={[
                            {
                                handleClick: this.props.onClickCenter,
                                icon: centerIcon,
                                title: this.props.intl.formatMessage(messages.centerCameraAction)
                            },
                            {
                                handleClick: this.props.onClickCenterOnTarget,
                                icon: centerOnTargetIcon,
                                title: this.props.intl.formatMessage(messages.centerOnTargetAction)
                            }
                        ]}
                        disabled={this.props.disabled}
                    />
                </div>
            </Box>
        );
    }
}

CameraInfo.propTypes = {
    disabled: PropTypes.bool,
    intl: intlShape,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    onClickCenter: PropTypes.func,
    onClickCenterOnTarget: PropTypes.func,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    x: PropTypes.number,
    y: PropTypes.number
};

export default injectIntl(CameraInfo);
