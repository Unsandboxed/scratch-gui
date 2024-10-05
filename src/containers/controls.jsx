import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handlePauseClick',
            'handleStopAllClick',
            'handleVolumeClick',
            'handleVolumeChange'
        ]);
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        // tw: implement alt+click and right click to toggle FPS
        // usb: implement ctrl+click to toggle muted status for volume
        if (e.ctrlKey || e.shiftKey || e.altKey || e.type === 'contextmenu') {
            if (e.ctrlKey) {
                if (this.props.vm.runtime.audioSettings.muted) {
                    this.props.vm.runtime.setVolume(-1);
                } else {
                    this.props.vm.runtime.setVolume(0);
                }
            } else if (e.shiftKey) {
                this.props.vm.setTurboMode(!this.props.turbo);
            }
            if (e.ctrlKey) {
                const muted = this.props.vm.runtime.audioSettings.muted;
                const volume = this.props.vm.runtime.audioSettings.muted;
                this.props.vm.runtime.setVolume(volume * -1);
                this.props.vm.runtime.audioSettings.muted = !muted;
            }
            if (e.altKey || e.type === 'contextmenu') {
                if (this.props.framerate === 30) {
                    this.props.vm.setFramerate(60);
                } else {
                    this.props.vm.setFramerate(30);
                }
            }
        } else {
            if (!this.props.isStarted) {
                this.props.vm.start();
            }
            this.props.vm.greenFlag();
        }
    }
    handlePauseClick (e) {
        e.preventDefault();
        this.props.vm.runtime.setPause(!this.props.vm.runtime.paused);
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
    }
    handleVolumeClick (e) {
        e.preventDefault();
        if (this.props.vm.runtime.audioSettings.muted) {
             this.props.vm.runtime.setVolume(-1);
        } else {
             this.props.vm.runtime.setVolume(0);
        }
    }
    handleVolumeChange (e) {
        e.preventDefault();
        this.props.vm.runtime.setVolume(Number(e.target.value));        
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            projectRunning,
            turbo,
            paused,
            volume,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={projectRunning && isStarted}
                turbo={turbo}
                paused={paused}
                volume={volume}
                onGreenFlagClick={this.handleGreenFlagClick}
                onPauseClick={this.handlePauseClick}
                onStopAllClick={this.handleStopAllClick}
                onVolumeChange={this.handleVolumeChange}
                onVolumeClick={this.handleVolumeClick}
            />
        );
    }
}

Controls.propTypes = {
    isStarted: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    interpolation: PropTypes.bool.isRequired,
    isSmall: PropTypes.bool,
    isHidden: PropTypes.bool,
    paused: PropTypes.bool,
    volume: PropTypes.number,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.started,
    projectRunning: state.scratchGui.vmStatus.running,
    framerate: state.scratchGui.tw.framerate,
    interpolation: state.scratchGui.tw.interpolation,
    turbo: state.scratchGui.vmStatus.turbo,
    paused: state.scratchGui.vmStatus.paused,
    volume: state.scratchGui.vmStatus.volume
});
// no-op function to prevent dispatch prop being passed to component
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
