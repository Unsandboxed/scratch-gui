import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import styles from './settings-modal.css';

const BufferedInput = BufferedInputHOC(Input);
import {SliderSetting, Setting, Header} from './global-components.jsx';

const BlockHeight = props => (
    <Setting 
        noHelp={true}
        primary={(
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Block Height:"
                    description="Block Height option"
                    id="tw.settingsModal.blockHeight"
                />
                <SliderSetting
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                />
            </div>
        )}
    />
);
BlockHeight.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};

const NotchHeight = props => (
    <Setting 
        noHelp={true}
        primary={(
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Notch Height:"
                    description="Notch Size option"
                    id="tw.settingsModal.notchHeight"
                />
                <SliderSetting
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                />
            </div>
        )}
    />
);
NotchHeight.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};

const CornerRadius = props => (
    <Setting 
        noHelp={true}
        primary={(
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Corner Radius:"
                    description="Corner Radius option"
                    id="tw.settingsModal.cornerRadius"
                />
                <SliderSetting
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                />
            </div>
        )}
    />
);
CornerRadius.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};

const CornerCurve = props => (
    <Setting 
        noHelp={true}
        primary={(
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Corner Curve:"
                    description="Corner Curve option"
                    id="tw.settingsModal.cornerCurve"
                />
                <SliderSetting
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                />
            </div>
        )}
    />
);
CornerCurve.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};

const BlockSettings = props => (
    <Box className={styles.content}>
        <Header>
            <FormattedMessage
                defaultMessage="Scale"
                description="Settings modal section"
                id="tw.settingsModal.scale"
            />
        </Header>
        <BlockHeight
            {...props}
            value={props.blockHeight}
            onChange={props.onBlockHeightChange}
        />
        <NotchHeight
            {...props}
            value={props.notchHeight}
            onChange={props.onNotchHeightChange}
        />
        <CornerRadius
            {...props}
            value={props.cornerRadius}
            onChange={props.onCornerRadiusChange}
        />
        <CornerCurve
            {...props}
            value={props.cornerCurve}
            onChange={props.onCornerCurveChange}
        />
        <Header>
            <FormattedMessage
                defaultMessage="Colors"
                description="Settings modal section"
                id="tw.settingsModal.colors"
            />
        </Header>
    </Box>
);
BlockSettings.propTypes = {
    intl: intlShape,
    blockHeight: PropTypes.number,
    onBlockHeightChange: PropTypes.func,
    notchHeight: PropTypes.number,
    onNotchHeightChange: PropTypes.func,
    cornerRadius: PropTypes.number,
    onCornerRadiusChange: PropTypes.func,
    cornerCurve: PropTypes.number,
    onCornerCurveChange: PropTypes.func
};

export default injectIntl(BlockSettings);
