import React from 'react';

import Box from '../box/box.jsx';
import Selector from './selector.jsx';
import styles from './scenes-panel.css';

const ScenesPanel = props => (
    <Box className={styles.wrapper}>
        <Selector
            className={styles.selector}
            {...props}
        />
        <Box className={styles.detailArea}>
            {props.children}
        </Box>
    </Box>
);

ScenesPanel.propTypes = {
    ...Selector.propTypes
};

export default ScenesPanel;
