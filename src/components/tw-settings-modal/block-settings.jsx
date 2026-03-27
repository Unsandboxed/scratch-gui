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
                <span>{'×'}</span>
                <BufferedInput
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                    type="number"
                />
            </div>
        )}
    />
);
BlockHeight.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};

const NotchSize = props => (
    <Setting 
        noHelp={true}
        primary={(
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Notch Size:"
                    description="Notch Size option"
                    id="tw.settingsModal.notchSize"
                />
                <SliderSetting
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                />
                <span>{'×'}</span>
                <BufferedInput
                    value={props.value}
                    onChange={props.onChange}
                    className={styles.customStageSizeInput}
                    type="number"
                />
            </div>
        )}
    />
);
NotchSize.propTypes = {
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
            value={50}
            onChange={() => {console.log("gay 2")}}
        />
        <NotchSize
            {...props}
            value={50}
            onChange={() => {console.log("gay 2")}}
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
};

export default injectIntl(BlockSettings);
