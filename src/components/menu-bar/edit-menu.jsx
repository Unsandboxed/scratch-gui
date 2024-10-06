import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import MenuLabel from './tw-menu-label.jsx';
import FPSEditMenu from './usb-edit-fps.jsx';

import TurboMode from '../../containers/turbo-mode.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import FramerateChanger from '../../containers/tw-framerate-changer.jsx';
import ChangeUsername from '../../containers/tw-change-username.jsx';
import CloudVariablesToggler from '../../containers/tw-cloud-toggler.jsx';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import editIcon from './icon--edit.svg';
import usernameIcon from './icon--username.svg';
import turboModeIcon from './icon--turbo-bolt.svg';

const EditMenu = ({
    isRtl,
    onClickSettingsModal,
    onRequestClose,
    onRequestOpen,
    isPlayerOnly,
    handleRestoreOption,
    restoreOptionMessage,
    editMenuOpen
}) => (
    <MenuLabel
        open={editMenuOpen}
        onOpen={onRequestOpen}
        onClose={onRequestClose}
    >
        <img
            src={editIcon}
            draggable={false}
            width={20}
            height={20}
        />
        <span className={styles.dropdownLabel}>
            <FormattedMessage
                defaultMessage="Edit"
                description="Text for edit dropdown menu"
                id="gui.menuBar.edit"
            />
        </span>
        <img
            src={dropdownCaret}
            draggable={false}
            width={8}
            height={5}
        />
        <MenuBarMenu
            className={menuBarStyles.menuBarMenu}
            open={editMenuOpen}
            place={isRtl ? 'left' : 'right'}
        >
            {isPlayerOnly ? null : (
                <DeletionRestorer>{(handleRestore, {restorable, deletedItem}) => (
                    <MenuItem
                        className={classNames({[styles.disabled]: !restorable})}
                        onClick={handleRestoreOption(handleRestore)}
                    >
                        {restoreOptionMessage(deletedItem)}
                    </MenuItem>
                )}</DeletionRestorer>
            )}
            <MenuSection>
                <TurboMode>{(toggleTurboMode, {turboMode}) => (
                    <MenuItem onClick={toggleTurboMode}>
                        {turboMode ? (
                            <FormattedMessage
                                defaultMessage="Turn off Turbo Mode"
                                description="Menu bar item for turning off turbo mode"
                                id="gui.menuBar.turboModeOff"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Turn on Turbo Mode"
                                description="Menu bar item for turning on turbo mode"
                                id="gui.menuBar.turboModeOn"
                            />
                        )}
                    </MenuItem>
                )}</TurboMode>
                <FramerateChanger>{(changeFramerateFromValue, {framerate}) => (
                    <FPSEditMenu 
                        framerate={framerate}
                        changeFramerateFromValue={changeFramerateFromValue}
                    />
                )}</FramerateChanger>
                <ChangeUsername>{changeUsername => (
                    <MenuItem onClick={changeUsername}>
                        <FormattedMessage
                            defaultMessage="Change Username"
                            description="Menu bar item for changing the username"
                            id="tw.menuBar.changeUsername"
                        />
                    </MenuItem>
                )}</ChangeUsername>
                <CloudVariablesToggler>{(toggleCloudVariables, {enabled, canUseCloudVariables}) => (
                    <MenuItem
                        className={classNames({[styles.disabled]: !canUseCloudVariables})}
                        onClick={toggleCloudVariables}
                    >
                        {canUseCloudVariables ? (
                            enabled ? (
                                <FormattedMessage
                                    defaultMessage="Disable Cloud Variables"
                                    description="Menu bar item for disabling cloud variables"
                                    id="tw.menuBar.cloudOff"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Enable Cloud Variables"
                                    description="Menu bar item for enabling cloud variables"
                                    id="tw.menuBar.cloudOn"
                                />
                            )
                        ) : (
                            <FormattedMessage
                                defaultMessage="Cloud Variables are not Available"
                                // eslint-disable-next-line max-len
                                description="Menu bar item for when cloud variables are not available"
                                id="tw.menuBar.cloudUnavailable"
                            />
                        )}
                    </MenuItem>
                )}</CloudVariablesToggler>
                <MenuSection>
                    <MenuItem onClick={onClickSettingsModal}>
                        <FormattedMessage
                            defaultMessage="Advanced Settings"
                            description="Menu bar item for advanced settings"
                            id="tw.menuBar.moreSettings"
                        />
                    </MenuItem>
                </MenuSection>
            </MenuSection>
        </MenuBarMenu>
    </MenuLabel>
);

EditMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func,
    onClickAddonSettings: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    handleRestoreOption: PropTypes.func,
    restoreOptionMessage: PropTypes.func,
    onClickSettingsModal: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    canUseCloudVariables: PropTypes.bool
};

export default EditMenu;
