import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import labelIcon from './icon--label.svg';

import styles from './custom-procedures.css';

const messages = defineMessages({
    myblockModalTitle: {
        defaultMessage: 'Make a Block',
        description: 'Title for the modal where you create a custom block.',
        id: 'gui.customProcedures.myblockModalTitle'
    }
});

const colors = [
    "#ff6680",
    "#4c97ff",
    "#9966ff",
    "#cf63cf",
    "#ffbf00",
    "#ffab19",
    "#5cb1d6",
    "#ff4c4c",
    "#59c059",
    "#ff8c1a",
    "#ff661a"
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
                <span style={{ backgroundColor: colors[0] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[0]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[1] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[1]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[2] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[2]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[3] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[3]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[4] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[4]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[5] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[5]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[6] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[6]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[7] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[7]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[8] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[8]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[9] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[9]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
                <span style={{ backgroundColor: colors[10] }}
                    className={styles.colorCard}
                    role="button"
                    color={colors[10]}
                    draggable={false}
                    onClick={props.onAddColor}
                />
            </Box>
            <div className={styles.checkboxRow}>
                <label>
                    <input
                        checked={props.warp}
                        type="checkbox"
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
    warp: PropTypes.bool.isRequired
};

export default injectIntl(CustomProcedures);
