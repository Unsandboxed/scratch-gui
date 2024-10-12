import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Input from '../forms/input.jsx';
import Label from '../forms/label.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';

import styles from './layer-editor.css';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    scene: {
        id: 'gui.layerEditor.scene',
        description: 'Label for the name of the scene',
        defaultMessage: 'Scene'
    },
});

const LayerEditor = props => (
    <div
        className={styles.editorContainer}
        ref={props.setRef}
        onMouseDown={(console.log(props.sceneId))}
    >
        <div className={styles.row}>
            <div className={styles.inputGroup}>
                <Label text={props.intl.formatMessage(messages.scene)}>
                    <BufferedInput
                        tabIndex="1"
                        type="text"
                        value={props.name}
                        onSubmit={props.onChangeName}
                        className={styles.nameInput}
                    />
                </Label>
            </div>
        </div>
    </div>
);

LayerEditor.propTypes = {
    selectedSceneId: PropTypes.string,
    name: PropTypes.string,
    onChangeName: PropTypes.func,
    vm: PropTypes.instanceOf(VM)
};

export default injectIntl(LayerEditor);
