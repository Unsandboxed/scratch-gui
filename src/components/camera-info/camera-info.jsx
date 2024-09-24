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

const BufferedInput = BufferedInputHOC(Input);

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
                    <div className={classNames(styles.row, styles.rowPrimary)}>
                        {xPosition}
                        {yPosition}
                    </div>
                </Box>
            );
        }

        return (
            <Box className={styles.cameraInfo}>
                <div className={classNames(styles.row, styles.rowPrimary)}>
                    <div className={styles.group}>
                        <Label
                            above={labelAbove}
                            text={camera}
                        >
                        </Label>
                    </div>
                    {xPosition}
                    {yPosition}
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
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    x: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    y: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default injectIntl(CameraInfo);
