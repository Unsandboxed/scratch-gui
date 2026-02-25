import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import labelIcon from './icon--label.svg';
import pickerIcon from './icon--eye-dropper.svg';

import styles from './custom-procedures.css';

const messages = defineMessages({
    myblockModalTitle: {
        defaultMessage: 'Make a Block',
        description: 'Title for the modal where you create a custom block.',
        id: 'gui.customProcedures.myblockModalTitle'
    }
});

const colors = [
    {color: "#4C97FF", id: "colours_motion"},
    {color: "#9966FF", id: "colours_looks"},
    {color: "#CF63CF", id: "colours_sounds"},
    {color: "#FFBF00", id: "colours_event"},
    {color: "#FFAB19", id: "colours_control"},
    {color: "#5CB1D6", id: "colours_sensing"},
    {color: "#FF4C4C", id: "colours_camera"},
    {color: "#59C059", id: "colours_operators"},
    {color: "#419f86", id: "colours_string"},
    {color: "#FF8C1A", id: "colours_data"},
    {color: "#FF661A", id: "colours_data_lists"},
    {color: "#FF6680", id: "colours_more"},
    {color: "#0fBD8C", id: "colours_pen"},
]

const CustomProcedures = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.myblockModalTitle)}
        onRequestClose={props.onCancel}
        id="customProceduresModal"
    >
        <Box
            className={styles.workspace}
            componentRef={props.componentRef}
        />
        <Box className={styles.body}>
            <div className={styles.optionTitle}>
                <FormattedMessage
                    defaultMessage="Add an input"
                    description="Label for button to add a text input"
                    id="gui.customProcedures.addAnInputText"
                />
            </div>
            <div className={styles.optionsRow}>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddText}
                >
                    <img
                        className={styles.optionIcon}
                        src={textInputIcon}
                        draggable={false}
                    />
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="text"
                            description="Description of the text input type"
                            id="gui.customProcedures.textType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddNumber}
                >
                    <img
                        className={styles.optionIcon}
                        src={textInputIcon}
                        draggable={false}
                    />
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="number"
                            description="Description of the number input type"
                            id="gui.customProcedures.numberType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddBoolean}
                >
                    <img
                        className={styles.optionIcon}
                        src={booleanInputIcon}
                        draggable={false}
                    />
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="boolean"
                            description="Description of the boolean input type"
                            id="gui.customProcedures.booleanType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddLabel}
                >
                    <img
                        className={styles.optionIcon}
                        src={labelIcon}
                        draggable={false}
                    />
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="label"
                            description="Label for button to add a label"
                            id="gui.customProcedures.addLabel"
                        />
                    </div>
                </div>
            </div>
            <div className={styles.optionTitle}>
                <FormattedMessage
                    defaultMessage="Select a color"
                    description="Label for button to add a text input"
                    id="gui.customProcedures.selectAColorText"
                />
            </div>
            <Box className={styles.colorRow}>
                {colors.map(item => (
                    <span style={{ backgroundColor: item.color }}
                        className={styles.colorCard}
                        key={item.id}
                        role="button"
                        color={item.id}
                        draggable={false}
                        onClick={props.onAddColor}
                    />
                ))}
                <input type="color"
                    className={styles.colorPicker}
                    onChange={props.onAddColor}
                />
            </Box>
            <div className={styles.checkboxRow}>
                <label className={styles.checkboxContainer}>
                    <FancyCheckbox
                        className={styles.checkbox}
                        checked={props.hat}
                        onChange={props.onToggleHat}
                    />
                    <FormattedMessage
                        defaultMessage="Hat by default"
                        description="Label for checkbox to make a hat block"
                        id="gui.customProcedures.hatBlock"
                    />
                </label>
                <label className={styles.checkboxContainer}
                    style={{visibility: (props.hat) ? "visible" : "hidden"}}
                >
                    <FancyCheckbox
                        className={styles.checkbox}
                        checked={props.hatAlwaysActivated}
                        onChange={props.onToggleHatAlwaysActivated}
                    />
                    <FormattedMessage
                        defaultMessage="Run every frame"
                        description="Label for checkbox to make a hat block always activated instead of edge activated"
                        id="gui.customProcedures.hatAlwaysActivated"
                    />
                </label>
            </div>
            <div className={styles.checkboxRow}>
                <label className={styles.checkboxContainer}>
                    <FancyCheckbox
                        className={styles.checkbox}
                        checked={props.warp}
                        onChange={props.onToggleWarp}
                    />
                    <FormattedMessage
                        defaultMessage="Run without screen refresh"
                        description="Label for checkbox to run without screen refresh"
                        id="gui.customProcedures.runWithoutScreenRefresh"
                    />
                </label>
            </div>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Label for button to cancel custom procedure edits"
                        id="gui.customProcedures.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Label for button to save new custom procedure"
                        id="gui.customProcedures.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

CustomProcedures.propTypes = {
    componentRef: PropTypes.func.isRequired,
    intl: intlShape,
    onAddBoolean: PropTypes.func.isRequired,
    onAddLabel: PropTypes.func.isRequired,
    onAddText: PropTypes.func.isRequired,
    onAddNumber: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onToggleWarp: PropTypes.func.isRequired,
    onToggleHat: PropTypes.func.isRequired,
    onToggleHatAlwaysActivated: PropTypes.func.isRequired,
    warp: PropTypes.bool.isRequired,
    hat: PropTypes.bool.isRequired,
    hatAlwaysActivated: PropTypes.bool.isRequired
};

export default injectIntl(CustomProcedures);
