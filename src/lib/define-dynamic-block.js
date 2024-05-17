// TODO: access `BlockType` and `ArgumentType` without reaching into VM
// Should we move these into a new extension support module or something?
import ArgumentType from 'scratch-vm/src/extension-support/argument-type';
import BlockType from 'scratch-vm/src/extension-support/block-type';
import ContextMenuContext from 'scratch-vm/src/extension-support/context-menu-context';
import log from './log.js';
import {injectExtensionBlockTheme} from './themes/blockHelpers';

const setupCustomContextMenu = (ScratchBlocks, contextMenuInfo, extendedOpcode) => {
    // Handle custom context menu options
    const customContextMenuForBlock = {
        /**
         * Add any custom context menu options to the dynamic block being defined.
         * See Blockly.Extensions.apply in scratch-blocks/core/extensions.js
         * for how the block becomes `this` behind the scenes.
         * @param {!Array} options List of menu options to add to.
         * @this Blockly.Block
         */
        customContextMenu: function (options) {
            contextMenuInfo.forEach(contextOption => {
                const option = {
                    enabled: true,
                    text: contextOption.text,
                    callback: () => {
                        if (contextOption.builtInCallback) {
                            switch (contextOption.builtInCallback) {
                            case 'EDIT_A_PROCEDURE':
                                // TODO FILL THIS IN
                                break;
                            case 'RENAME_A_VARIABLE':
                                // TODO FILL THIS IN
                                break;
                            }
                        } else if (contextOption.callback) {
                            contextOption.callback({blockInfo: JSON.parse(this.blockInfoText)});
                        }
                    }
                };

                // Decide whether to add this item to the context menu
                // based on the context that the block is in and the
                // provided `context` property of the item.
                switch (contextOption.context) {
                case ContextMenuContext.TOOLBOX_ONLY:
                    if (this.isInFlyout) options.push(option);
                    break;
                case ContextMenuContext.WORKSPACE_ONLY:
                    if (!this.isInFlyout) options.push(option);
                    break;
                case ContextMenuContext.ALL:
                default:
                    options.push(option);
                }
            });
        }
    };
    const contextMenuName = `${extendedOpcode}_context_menu`;
    // TODO we need some way of registering a context menu option only once for
    // each block (see try catch below)
    // This is similar to the issue we have with re-registering block definitions.
    // See todo in containers/blocks.jsx, in `handleBlocksInfoUpdate`
    try {
        ScratchBlocks.Extensions.registerMixin(contextMenuName, customContextMenuForBlock);
    } catch (e) {
        log.warn("Context menu callback was already registered, but we're going to ignore this for now");
    }
    return contextMenuName;
};

/**
 * Define a block using extension info which has the ability to dynamically determine (and update) its layout.
 * This functionality is used for extension blocks which can change its properties based on different state
 * information. For example, the `control_stop` block changes its shape based on which menu item is selected
 * and a variable block changes its text to reflect the variable name without using an editable field.
 * @param {object} ScratchBlocks - The ScratchBlocks name space.
 * @param {object} categoryInfo - Information about this block's extension category, including any menus and icons.
 * @param {object} staticBlockInfo - The base block information before any dynamic changes.
 * @param {string} extendedOpcode - The opcode for the block (including the extension ID).
 * @param {Theme} theme - the current theme
 */
// TODO: grow this until it can fully replace `_convertForScratchBlocks` in the VM runtime
const defineDynamicBlock = (ScratchBlocks, categoryInfo, staticBlockInfo, extendedOpcode, theme) => {
    // Set up context menus if any
    const contextMenuInfo = staticBlockInfo.info.customContextMenu;
    const contextMenuName = contextMenuInfo ?
        setupCustomContextMenu(ScratchBlocks, staticBlockInfo.info.customContextMenu, extendedOpcode) : '';

    return ({
        init: function () {
            const colors = injectExtensionBlockTheme(staticBlockInfo.json, theme);
            const blockJson = {
                type: extendedOpcode,
                inputsInline: true,
                category: categoryInfo.name,
                colour: colors.colour,
                colourSecondary: colors.colourSecondary,
                colourTertiary: colors.colourTertiary,
                colourQuaternary: colors.colourQuaternary
            };
            // There is a scratch-blocks / Blockly extension called "scratch_extension" which adjusts the styling of
            // blocks to allow for an icon, a feature of Scratch extension blocks. However, Scratch "core" extension
            // blocks don't have icons and so they should not use 'scratch_extension'. Adding a scratch-blocks / Blockly
            // extension after `jsonInit` isn't fully supported (?), so we decide now whether there will be an icon.
            if (staticBlockInfo.blockIconURI || categoryInfo.blockIconURI) {
                blockJson.extensions = ['scratch_extension'];
            }
    
            if (contextMenuInfo) {
                blockJson.extensions = blockJson.extensions || [];
                blockJson.extensions.push(contextMenuName);
            }
    
            // initialize the basics of the block, to be overridden & extended later by `domToMutation`
            this.jsonInit(blockJson);
            // initialize the cached block info used to carry block info from `domToMutation` to `mutationToDom`
            this.blockInfoText = '{}';
            // we need a block info update (through `domToMutation`) before we have a completely initialized block
            this.needsBlockInfoUpdate = true;
        },
        mutationToDom: function () {
            const container = document.createElement('mutation');
            container.setAttribute('blockInfo', this.blockInfoText);
            return container;
        },
        domToMutation: function (xmlElement) {
            const blockInfoText = xmlElement.getAttribute('blockInfo');
            if (!blockInfoText) return;
            if (!this.needsBlockInfoUpdate) {
                throw new Error('Attempted to update block info twice');
            }
            delete this.needsBlockInfoUpdate;
            this.blockInfoText = blockInfoText;
            const blockInfo = JSON.parse(blockInfoText);
    
            switch (blockInfo.blockType) {
            case BlockType.COMMAND:
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
                this.setPreviousStatement(null); // null = available connection; undefined = hat
                if (!blockInfo.isTerminal) {
                    this.setNextStatement(null); // null = available connection; undefined = terminal
                }
                break;
            case BlockType.REPORTER:
                this.setOutput(blockInfo.allowDropAnywhere ? null : 'String'); // TODO: distinguish number & string here?
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_ROUND);
                break;
            case BlockType.BOOLEAN:
                this.setOutput('Boolean');
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_HEXAGONAL);
                break;
            case BlockType.HAT:
            case BlockType.EVENT:
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
                this.setNextStatement(null); // null = available connection; undefined = terminal
                break;
            case BlockType.CONDITIONAL:
            case BlockType.LOOP:
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
                this.setPreviousStatement(null); // null = available connection; undefined = hat
                if (!blockInfo.isTerminal) {
                    this.setNextStatement(null); // null = available connection; undefined = terminal
                }
                break;
            case BlockType.INLINE:
                this.setOutput(blockInfo.allowDropAnywhere ? null : 'String'); // TODO: distinguish number & string here?
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
                break;
            case BlockType.ARRAY:
                this.setOutput('Array');
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
                break;
            case BlockType.OBJECT:
                this.setOutput('Object');
                this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_OBJECT);
                break;
            }
    
            if (blockInfo.color1 || blockInfo.color2 || blockInfo.color3) {
                // `setColour` handles undefined parameters by adjusting defined colors
                this.setColour(blockInfo.color1, blockInfo.color2, blockInfo.color3);
            }
    
            // Layout block arguments
            // TODO handle E/C Blocks
            const blockText = blockInfo.text;
            const args = [];
            let argCount = 0;
            const scratchBlocksStyleText = blockText.replace(/\[(.+?)]/g, (match, argName) => {
                const arg = blockInfo.arguments[argName];
                switch (arg.type) {
                case ArgumentType.STRING:
                    args.push({type: 'input_value', name: argName});
                    break;
                case ArgumentType.BOOLEAN:
                    args.push({type: 'input_value', name: argName, check: 'Boolean'});
                    break;
                }
                return `%${++argCount}`;
            });
            this.interpolate_(scratchBlocksStyleText, args);
        }
    });
};

export default defineDynamicBlock;
