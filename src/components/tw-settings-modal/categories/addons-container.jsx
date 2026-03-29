import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import React from 'react';
import Box from '../../box/box.jsx';
import styles from '../settings-modal.css';

const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
const url = `${process.env.ROOT}${path}${typeof addonId === 'string' ? `#${addonId}` : ''}`;

const container = (
    <iframe
        frameBorder="0"
        name="addonsContainer"
        title="Inline Frame Example"
        src={url}>
    </iframe>
);

const AddonsContainer = props => (
    <iframe className={styles.container}
        frameBorder="0"
        name="addonsContainer"
        title="Inline Frame Example"
        src={url}>
    </iframe>
);

AddonsContainer.propTypes = {
    intl: intlShape,
};

export default injectIntl(AddonsContainer);
