import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import DirectionPicker from '../../containers/direction-picker.jsx';

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
const noop = () => {};

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
    },
    collapseCameraAction: {
        id: 'gui.CameraInfo.collapseCameraAction',
        defaultMessage: 'Hide',
        description: 'Tooltip and label for camera info collapse button'
    },
    expandCameraAction: {
        id: 'gui.CameraInfo.expandCameraAction',
        defaultMessage: 'Show',
        description: 'Tooltip and label for camera info expand button'
    }
});

class CameraInfo extends React.Component {
    shouldComponentUpdate (nextProps) {
        return (
            this.props.stageSize !== nextProps.stageSize ||
            this.props.isCollapsed !== nextProps.isCollapsed ||
            Math.round(this.props.x) !== Math.round(nextProps.x) ||
            Math.round(this.props.y) !== Math.round(nextProps.y) ||
            Math.round(this.props.zoom) !== Math.round(nextProps.zoom) ||
            Math.round(this.props.direction) !== Math.round(nextProps.direction)
        );
    }
    render () {
        const {
            isCollapsed,
            stageSize
        } = this.props;

        const camera = (
            <FormattedMessage
                defaultMessage="Camera"
                description="Camera info label"
                id="gui.CameraInfo.camera"
            />
        );

        const zoomLabel = (
            <FormattedMessage
                defaultMessage="Zoom"
                description="Camera info zoom label"
                id="gui.CameraInfo.zoom"
            />
        );

        const labelAbove = isWideLocale(this.props.intl.locale);
        const toggleLabel = this.props.intl.formatMessage(isCollapsed ?
            messages.expandCameraAction :
            messages.collapseCameraAction
        );

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

        const zoom = (
            <div className={classNames(styles.group, styles.largerInput)}>
                <Label
                    secondary
                    above={labelAbove}
                    text={zoomLabel}
                >
                    <BufferedInput
                        small
                        disabled={this.props.disabled}
                        label={zoomLabel}
                        tabIndex="0"
                        type="number"
                        value={this.props.disabled ? '' : Math.round(this.props.zoom)}
                        onSubmit={this.props.onChangeZoom}
                    />
                </Label>
            </div>
        );

        const rotation = (
            <div className={classNames(styles.group, styles.largerInput)}>
                <DirectionPicker
                    direction={Math.round(this.props.direction)}
                    disabled={this.props.disabled}
                    labelAbove={labelAbove}
                    rotationStyle="all around"
                    onChangeDirection={this.props.onChangeDirection}
                    onChangeRotationStyle={noop}
                    removeRotationStyle={true}
                />
            </div>
        );

        const collapseControl = (
            <div className={styles.collapseControlRow}>
                {isCollapsed ? (
                    <div className={styles.collapsedLabel}>{camera}</div>
                ) : <div />}
                <button
                    aria-expanded={!isCollapsed}
                    className={classNames(styles.collapseToggle, {
                        [styles.collapseToggleCollapsed]: isCollapsed
                    })}
                    title={toggleLabel}
                    type="button"
                    onClick={e => {
                        e.stopPropagation();
                        this.props.onToggleCollapsed();
                    }}
                >
                    <span className={styles.collapseToggleIcon} />
                </button>
            </div>
        );

        if (stageSize === STAGE_DISPLAY_SIZES.small) {
            return (
                <Box className={classNames(styles.cameraInfo, {
                    [styles.cameraInfoCollapsed]: isCollapsed
                })}
                    onClick={isCollapsed ? this.props.onToggleCollapsed : null}
                >
                    {isCollapsed ? null : (
                        <div className={classNames(styles.row)}>
                            {xPosition}
                            {yPosition}
                            {zoom}
                            {rotation}
                        </div>
                    )}
                    {collapseControl}
                </Box>
            );
        }

        return (
            <Box className={classNames(styles.cameraInfo, {
                [styles.cameraInfoCollapsed]: isCollapsed
            })}
                onClick={isCollapsed ? this.props.onToggleCollapsed : null}
            >
                {isCollapsed ? null : (
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
                )}
                {isCollapsed ? null : (
                    <div className={classNames(styles.row, styles.rowSecondary)}>
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
                        {zoom}
                        {rotation}
                    </div>
                )}
                {collapseControl}
            </Box>
        );
    }
}

CameraInfo.propTypes = {
    disabled: PropTypes.bool,
    intl: intlShape,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    onChangeZoom: PropTypes.func,
    onChangeDirection: PropTypes.func,
    onClickCenter: PropTypes.func,
    onClickCenterOnTarget: PropTypes.func,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    zoom: PropTypes.number,
    direction: PropTypes.number,
    isCollapsed: PropTypes.bool,
    onToggleCollapsed: PropTypes.func,
};

export default injectIntl(CameraInfo);
