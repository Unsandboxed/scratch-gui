import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import styles from './settings-modal.css';

import openLinkIcon from './open-link.svg';

import AddonsContainer from './categories/addons-container.jsx';
import AppearanceSettings from './categories/appearance-settings.jsx';
import BlockSettings from './categories/block-settings.jsx';
import ProjectSettings from './categories/project-settings.jsx';

/* eslint-disable react/no-multi-comp */

const handleClickAddonSettings = addonId => {
    // addonId might be a string of the addon to focus on, undefined, or an event (treat like undefined)
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    const url = `${process.env.ROOT}${path}${typeof addonId === 'string' ? `#${addonId}` : ''}`;
    window.open(url);
};

const messages = defineMessages({
    title: {
        defaultMessage: 'Settings',
        description: 'Title of settings modal',
        id: 'tw.settingsModal.title'
    }
});

const SettingsModalComponent = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onClose}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="settingsModal"
    >
        <Box className={styles.body}>
            <Box className={styles.menu}>
                <div className={classNames(
                    styles.category,{
                    [styles.active]: props.category == "project"
                })}
                    category="project"
                    onClick={props.onChangeCategory}
                >
                    Project
                </div>
                <div className={classNames(
                    styles.category,{
                    [styles.active]: props.category == "appearance"
                })}
                    category="appearance"
                    onClick={props.onChangeCategory}
                >
                    Appearance
                </div>
                {/* <div className={classNames(
                    styles.category,{
                    [styles.active]: props.category == "blocks"
                })}
                    category="blocks"
                    onClick={props.onChangeCategory}
                >
                    Blocks
                </div> */}
                <div className={classNames(
                    styles.category,{
                    [styles.active]: props.category == "shortcuts"
                })}
                    category="shortcuts"
                    onClick={props.onChangeCategory}
                >
                    Shortcuts
                </div>

                <div className={styles.divider}/>

                <div className={classNames(
                    styles.category,{
                    [styles.active]: props.category == "addons"
                })}
                    category="addons"
                    onClick={props.onChangeCategory}
                >
                    Addons
                    <img
                        width={20}
                        height={20}
                        className={styles.openLink}
                        src={openLinkIcon}
                        draggable={false}
                    />
                </div>
            </Box>
            {(props.category === "appearance") ?
            <AppearanceSettings
                {...props}
            // /> : (props.category === "blocks") ?
            // <BlockSettings
            //     {...props}
            /> : (props.category === "addons") ?
            <AddonsContainer
                {...props}
            /> :
            <ProjectSettings
                {...props}
            />}
        </Box>
    </Modal>
);

SettingsModalComponent.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    isEmbedded: PropTypes.bool,
    onChangeCategory: PropTypes.func,
    editorSettings: PropTypes.object,

    // project settings
    framerate: PropTypes.number,
    onFramerateChange: PropTypes.func,
    onCustomizeFramerate: PropTypes.func,
    highQualityPen: PropTypes.bool,
    onHighQualityPenChange: PropTypes.func,
    interpolation: PropTypes.bool,
    onInterpolationChange: PropTypes.func,
    infiniteClones: PropTypes.bool,
    onInfiniteClonesChange: PropTypes.func,
    enableFencing: PropTypes.bool,
    onEnableFencingChange: PropTypes.func,
    removeLimits: PropTypes.bool,
    onRemoveLimitsChange: PropTypes.func,
    warpTimer: PropTypes.bool,
    onWarpTimerChange: PropTypes.func,
    disableCompiler: PropTypes.bool,
    onDisableCompilerChange: PropTypes.func,

    // appearance settings
    onStageLayoutChange: PropTypes.func,
    onStageCornersChange: PropTypes.func,
    onToolboxChange: PropTypes.func,

    // block settings
    blockHeight: PropTypes.number,
    onBlockHeightChange: PropTypes.func,
    notchHeight: PropTypes.number,
    onNotchHeightChange: PropTypes.func,
    cornerRadius: PropTypes.number,
    onCornerRadiusChange: PropTypes.func,
    cornerCurve: PropTypes.number,
    onCornerCurveChange: PropTypes.func
};

export default injectIntl(SettingsModalComponent);
