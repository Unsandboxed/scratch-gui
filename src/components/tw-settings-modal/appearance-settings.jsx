import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './settings-modal.css';

import {BooleanSetting, Setting, Header} from './global-components.jsx';

const StageOnLeft = props => (
    <BooleanSetting noHelp={true}
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Left-Hand Stage"
                description="Put the stage on the left side."
                id="tw.settingsModal.stageOnLeft"
            />
        }
        slug="stage-on-left"
    />
);

const OldToolbox = props => (
    <BooleanSetting noHelp={true}
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Legacy Block Palette"
                description="Bring back the old block palette."
                id="tw.settingsModal.oldToolbox"
            />
        }
        slug="old-toolbox"
    />
);

const AppearanceSettings = props => (
    <Box className={styles.content}>
        <Header>
            <FormattedMessage
                defaultMessage="Interface"
                description="Settings modal section"
                id="tw.settingsModal.interface"
            />
        </Header>
        <StageOnLeft
            value={props.stageOnLeft}
            onChange={props.onStageLayoutChange}
        />
        <Header>
            <FormattedMessage
                defaultMessage="Code Editor"
                description="Settings modal section"
                id="tw.settingsModal.codeEditor"
            />
        </Header>
        <OldToolbox
            value={props.oldToolbox}
            onChange={props.onToolboxChange}
        />
    </Box>
);

AppearanceSettings.propTypes = {
    intl: intlShape,

    // appearance settings
    onStageLayoutChange: PropTypes.func,
    onToolboxChange: PropTypes.func,
};

export default injectIntl(AppearanceSettings);
