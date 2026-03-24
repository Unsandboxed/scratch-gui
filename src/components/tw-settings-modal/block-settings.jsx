import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import Box from '../box/box.jsx';
import React from 'react';
import styles from './settings-modal.css';

import {BooleanSetting, Setting, Header} from './global-components.jsx';

const BlockSettings = props => (
    <Box className={styles.content}>
        <Header>
            <FormattedMessage
                defaultMessage="Nothing yet"
                description="Settings modal section"
                id="tw.settingsModal.nothingYet"
            />
        </Header>
    </Box>
);

BlockSettings.propTypes = {
    intl: intlShape,
};

export default injectIntl(BlockSettings);
