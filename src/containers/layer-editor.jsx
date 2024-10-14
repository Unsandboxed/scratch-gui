import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';

import LayerEditorComponent from '../components/layer-editor/layer-editor.jsx';

import {connect} from 'react-redux';
import {Theme} from '../lib/themes/index.js';

class LayerEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            "handleChangeName"
        ]);
    }
    shouldComponentUpdate (nextProps, nextState) {
        return this.props.name !== nextProps.name;
    }
    handleChangeName (name) {
        const sceneId = this.props.selectedSceneId;
        this.props.vm.runtime.renameScene(sceneId, name);
    }
    render () {
        if (this.props.vm.runtime.scene !== this.props.selectedSceneId) return null;

        const {
            selectedSceneId,
            vm,
            ...componentProps
        } = this.props;

        return (
            <LayerEditorComponent
                {...componentProps}
                onChangeName={this.handleChangeName}
                theme={this.props.theme.isDark() ? 'dark' : 'light'}
                width={this.props.customStageSize.width}
                height={this.props.customStageSize.height}
                selectedSceneId={this.props.selectedSceneId}
                name={this.props.name}
                vm={this.props.vm}
            />
        );
    }
}

LayerEditor.propTypes = {
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    theme: PropTypes.instanceOf(Theme),
    name: PropTypes.string.isRequired,
    rtl: PropTypes.bool,
    selectedSceneId: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = (state, {selectedSceneId}) => {
    const scene = state.scratchGui.vm.runtime.scenes[selectedSceneId];
    return {
        customStageSize: state.scratchGui.customStageSize,
        selectedSceneId: selectedSceneId,
        isFullScreen: state.scratchGui.mode.isFullScreen,
        name: scene.name,
        theme: state.scratchGui.theme.theme,
        vm: state.scratchGui.vm
    };
};

export default connect(
    mapStateToProps
)(LayerEditor);
