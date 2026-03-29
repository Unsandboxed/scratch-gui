import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Box from '../../box/box.jsx';
import Input from '../../forms/input.jsx';
import BufferedInputHOC from '../../forms/buffered-input-hoc.jsx';
import styles from '../settings-modal.css';
import {APP_NAME} from '../../../lib/brand.js';

const BufferedInput = BufferedInputHOC(Input);
import {SliderSetting, Setting, Header} from '../global-components.jsx';
import BlockPreview from '../block-preview.jsx';

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
        <BlockPreview
            {...props}
        />
        <Header>
            <FormattedMessage
                defaultMessage="Scale"
                description="Settings modal section"
                id="tw.settingsModal.scale"
            />
        </Header>
        <BlockHeight
            {...props}
            min={25}
            max={150}
            value={props.blockSettings.blockHeight}
            onChange={props.onBlockHeightChange}
        />
        <NotchHeight
            {...props}
            value={props.blockSettings.notchHeight}
            onChange={props.onNotchHeightChange}
        />
        <CornerRadius
            {...props}
            value={props.blockSettings.cornerRadius}
            onChange={props.onCornerRadiusChange}
        />
        <CornerCurve
            {...props}
            value={props.blockSettings.cornerCurve}
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
    blockSettings: PropTypes.object,
};

export default injectIntl(BlockSettings);
