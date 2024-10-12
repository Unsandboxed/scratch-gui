import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import scenesIcon from '../components/scenes-panel/icon--scenes.svg';
import addSceneIcon from '../components/scenes-panel/icon--add-scene.svg';
import ScenesPanel from '../components/scenes-panel/scenes-panel.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import sharedMessages from '../lib/shared-messages';
import LayerEditor from './layer-editor.jsx';

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
            'handleDeleteScene',
        ]);
        this.state = {
            selectedSceneId: vm.runtime.scene
        };
    }

    componentWillReceiveProps (nextProps) {
        const {
            editingTarget,
            sprites,
            stage
        } = nextProps;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target) {
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
        vm.runtime.scene = vm.runtime.createScene(name).id;
        this.setState({selectedSceneId: vm.runtime.scene});
    }

    handleDrop() {}

    handleDeleteScene(sceneId) {
        vm.runtime.removeScene(sceneId);
        this.setState({selectedSceneId: vm.runtime.scene});
    }

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
        const scenes = runtimeScenes ? runtimeScenes.filter(
           scene => !scene.temporary
        ).map(scene => (
            {
                url: scene.preview ?? scenesIcon,
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
                        img: addSceneIcon,
                        onClick: this.handleAddScene
                    },
                ] : []}
                isRtl={isRtl}
                items={scenes}
                selectedSceneId={this.state.selectedSceneId}
                onItemClick={this.handleSelectScene}
                onDrop={this.handleDrop}
                onDeleteClick={Object.keys(vm.runtime.scenes).length > 1 ?
                    this.handleDeleteScene : null}
            >
                <LayerEditor
                    selectedSceneId={this.state.selectedSceneId}
                />
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
