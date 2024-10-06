import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu, MenuSection} from '../menu/menu.jsx';
import {openFPSMenu, FPSMenuOpen, closeEditMenu} from '../../reducers/menus.js';
import styles from './settings-menu.css';

const options = defineMessages({
    "30": {
        defaultMessage: '30 FPS',
        description: 'Name of the 30 FPS speed setting.',
        id: 'tw.edit.30fps'
    },
    "60": {
        defaultMessage: '60 FPS',
        description: 'Name of the 60 FPS speed setting.',
        id: 'tw.edit.60fps'
    },
    "0": {
        defaultMessage: 'Unlimited',
        description: 'Name of the unlimited FPS speed setting.',
        id: 'tw.edit.unlimited'
    },
    "custom": {
        defaultMessage: "Custom",
        description: "Name of the custom speed setting.",
        id: "tw.edit.custom"
    }
});

const FPSMenuItem = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <img
                className={classNames(styles.check, {[styles.selected]: props.isSelected})}
                width={15}
                height={12}
                src={check}
                draggable={false}
            />
            <FormattedMessage {...options[props.id]}/>
        </div>
    </MenuItem>
);

FPSMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const FPSEditMenu = ({
    isOpen,
    isRtl,
    framerate,
    changeFramerateFromValue,
    onOpen
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpen}
        >
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="FPS"
                    description="Label for menu to choose FPS"
                    id="tw.menuBar.fps"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {Object.keys(options).map(item => (
                <FPSMenuItem
                    key={item}
                    id={item}
                    isSelected={
                        (item !== "custom" && framerate === Number(item)) ||
                        (item === "custom" && ![60, 30, 0].includes(framerate))
                    }
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => changeFramerateFromValue(item)}
                />
            ))}
        </Submenu>
    </MenuItem>
);

FPSEditMenu.propTypes = {
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    framerate: PropTypes.number,
    onClick: PropTypes.func,
    changeFramerateFromValue: PropTypes.func
};

const mapStateToProps = state => ({
    isOpen: FPSMenuOpen(state),
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = dispatch => ({
    onOpen: () => dispatch(openFPSMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FPSEditMenu);
