import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import soundIcon from '../components/asset-panel/icon--sound.svg';
import soundIconRtl from '../components/asset-panel/icon--sound-rtl.svg';
import VM from 'scratch-vm';

import addLibraryBackdropIcon from '../components/asset-panel/icon--add-backdrop-lib.svg';
import ScenesPanel from '../components/scenes-panel/scenes-panel.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import sharedMessages from '../lib/shared-messages';

import {connect} from 'react-redux';

import {
    activateTab,
    COSTUMES_TAB_INDEX
} from '../reducers/editor-tab';

let messages = defineMessages({
    createScene: {
        defaultMessage: 'Create a Scene',
        description: 'Button to add a scene in the editor tab',
        id: 'gui.soundTab.createScene'
    }
});

messages = {...messages, ...sharedMessages};

class ScenesTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddScene',
            'handleDrop',
            'handleSelectScene',
        ]);
        this.state = {selectedSceneId: vm.runtime.scene};
    }

    componentWillReceiveProps (nextProps) {
        const {
            editingTarget,
            sprites,
            stage
        } = nextProps;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target || !target.sounds) {
            return;
        }

        if (this.state.selectedSceneId !== vm.runtime.scene) {
            this.setState({selectedSceneId: vm.runtime.scene});
        }
    }

    handleSelectScene(sceneId) {
        vm.runtime.loadScene(sceneId);
        this.setState({selectedSceneId: vm.runtime.scene});
    }

    handleAddScene() {
        const name = this.props.intl.formatMessage(messages.scene, {index: 1});
        vm.runtime.createScene(name);
    }

    handleDrop() {}

    render () {
        const {
            dispatchUpdateRestore, // eslint-disable-line no-unused-vars
            intl,
            isRtl,
            vm,
        } = this.props;

        if (!vm.editingTarget) {
            return null;
        }

        const isSupported = true;
        const runtimeScenes = Object.values(vm.runtime.scenes);

        const scenes = runtimeScenes ? runtimeScenes.map(scene => (
            {
                url: scene.preview,
                name: scene.name,
                details: "",
                dragPayload: scene,
                id: scene.id
            }
        )) : [];

        return (
            <ScenesPanel
                buttons={isSupported ? 
                [
                    {
                        title: intl.formatMessage(messages.createScene),
                        img: addLibraryBackdropIcon,
                        onClick: this.handleAddScene
                    },
                ] : []}
                isRtl={isRtl}
                items={scenes}
                selectedSceneId={this.state.selectedSceneId}
                onItemClick={this.handleSelectScene}
                onDrop={this.handleDrop}
            >
            </ScenesPanel>
        );
    }
}

ScenesTab.propTypes = {
    dispatchUpdateRestore: PropTypes.func,
    editingTarget: PropTypes.string,
    intl: intlShape,
    isRtl: PropTypes.bool,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            sounds: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired
            }))
        })
    }),
    stage: PropTypes.shape({
        sounds: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        }))
    }),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    isRtl: state.locales.isRtl,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage
});

const mapDispatchToProps = dispatch => ({
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX))
});

export default errorBoundaryHOC('Scenes Tab')(
    injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps
    )(ScenesTab))
);
