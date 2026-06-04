import {connect} from 'react-redux';
import ExtensionErrorPopup from '../components/extension-error-popup/extension-error-popup.jsx';
import {removeExtensionError} from '../reducers/extension-errors';
import {activateTab, BLOCKS_TAB_INDEX} from '../reducers/editor-tab';
import AddonHooks from '../addons/hooks';

const mapStateToProps = state => ({
    errors: state.scratchGui.extensionErrors
});

const mapDispatchToProps = dispatch => ({
    onClose: id => dispatch(removeExtensionError(id)),
    onJump: error => {
        // Switch to the blocks (Scripts) tab
        dispatch(activateTab(BLOCKS_TAB_INDEX));

        // Ask Blockly to scroll to the block if we have a blockId
        if (error.blockId) {
            const blockly = AddonHooks.blocklyWorkspace;
            if (blockly) {
                try {
                    const block = blockly.getBlockById(error.blockId);
                    if (block) {
                        blockly.centerOnBlock(error.blockId);
                        block.select();
                    }
                } catch (_) {
                    // blockId may belong to a different sprite; ignore
                }
            }
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionErrorPopup);
