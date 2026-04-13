import LazyScratchBlocks from './tw-lazy-scratch-blocks';
import AddonHooks from '../addons/hooks';
import {
    openExtensionModal,
    updateExtensionModal,
    closeExtensionModal
} from '../reducers/extension-modals';

/**
 * Implements Scratch.gui API for unsandboxed extensions.
 * @param {any} Scratch window.Scratch, mutated in place.
 */
const implementGuiAPI = Scratch => {
    Scratch.gui = {
        immutable: Scratch.vm.$.modules.immutable(),

        /**
         * Lazily get the internal ScratchBlocks object when it becomes available. It may never be
         * available if, for example, the user never enters the editor.
         *
         * You should not assume that ScratchBlocks becoming available means the user is actually
         * in the editor or that a workspace has been created already.
         *
         * @returns {Promise<any>} Promise that may eventually resolve to ScratchBlocks
         */
        getBlockly: () => {
            if (AddonHooks.blockly) {
                return Promise.resolve(AddonHooks.blockly);
            }
            return new Promise(resolve => {
                AddonHooks.blocklyCallbacks.push(() => resolve(AddonHooks.blockly));
            });
        },

        /**
         * Get the internal ScratchBlocks object as soon as possible. This lets you access it even
         * if the user never enters the editor.
         *
         * This method is VERY SLOW and will cause A LOT OF CPU AND NETWORK ACTIVITY because it
         * downloads and evaluates all of scratch-blocks, a multi-megabyte JavaScript bundle.
         *
         * @returns {Promise<any>} Promise that will resolve to ScratchBlocks.
         */
        getBlocklyEagerly: () => LazyScratchBlocks.load()
    };

    const getStore = () => window.ReduxStore || AddonHooks.appStateStore;
    const normalizeId = id => `${id || ''}`.trim();
    const getThemeMetrics = () => {
        const store = getStore();
        const state = store ? store.getState() : null;
        const theme = state && state.scratchGui && state.scratchGui.theme ? state.scratchGui.theme.theme : null;

        const style = getComputedStyle(document.documentElement);
        const readVar = name => (style.getPropertyValue(name) || '').trim();

        const guiMode = theme && typeof theme.gui === 'string' ? theme.gui : null;
        const isDark = guiMode ? guiMode === 'dark' : readVar('--ui-modal-background') !== '#ffffff';

        return {
            isDark,
            accent: theme && typeof theme.accent === 'string' ? theme.accent : null,
            gui: guiMode,
            blocks: theme && typeof theme.blocks === 'string' ? theme.blocks : null,
            colors: {
                modalBackground: readVar('--ui-modal-background'),
                modalForeground: readVar('--ui-modal-foreground'),
                modalHeaderBackground: readVar('--ui-modal-header-background'),
                modalHeaderForeground: readVar('--ui-modal-header-foreground'),
                uiPrimary: readVar('--ui-primary'),
                uiSecondary: readVar('--ui-secondary'),
                uiTertiary: readVar('--ui-tertiary'),
                textPrimary: readVar('--text-primary'),
                textPrimaryTransparent: readVar('--ui-text-primary-transparent'),
                accentPrimary: readVar('--extensions-primary'),
                successPrimary: readVar('--pen-primary'),
                warningPrimary: readVar('--looks-primary'),
                errorPrimary: readVar('--error-primary'),
                blackTransparent: readVar('--ui-black-transparent')
            }
        };
    };

    Scratch.gui.extensionModals = {
        open: options => {
            const modalOptions = options || {};
            const id = normalizeId(modalOptions.id || `extension-modal-${Date.now()}`);
            const store = getStore();
            if (!store) return null;
            store.dispatch(openExtensionModal({
                id,
                title: `${modalOptions.title || 'Extension Modal'}`,
                html: typeof modalOptions.html === 'string' ? modalOptions.html : '',
                url: typeof modalOptions.url === 'string' ? modalOptions.url : '',
                width: Number.isFinite(Number(modalOptions.width)) ? Number(modalOptions.width) : 720,
                height: Number.isFinite(Number(modalOptions.height)) ? Number(modalOptions.height) : 520,
                className: typeof modalOptions.className === 'string' ? modalOptions.className : ''
            }));
            return id;
        },
        update: options => {
            const modalOptions = options || {};
            const id = normalizeId(modalOptions.id);
            const store = getStore();
            if (!store || !id) return false;
            store.dispatch(updateExtensionModal({
                id,
                title: typeof modalOptions.title === 'string' ? modalOptions.title : undefined,
                html: typeof modalOptions.html === 'string' ? modalOptions.html : undefined,
                url: typeof modalOptions.url === 'string' ? modalOptions.url : undefined,
                width: Number.isFinite(Number(modalOptions.width)) ? Number(modalOptions.width) : undefined,
                height: Number.isFinite(Number(modalOptions.height)) ? Number(modalOptions.height) : undefined,
                className: typeof modalOptions.className === 'string' ? modalOptions.className : undefined
            }));
            return true;
        },
        close: id => {
            const normalizedId = normalizeId(id);
            const store = getStore();
            if (!store || !normalizedId) return false;
            store.dispatch(closeExtensionModal(normalizedId));
            return true;
        },
        getBodyElement: id => {
            const normalizedId = normalizeId(id);
            if (!normalizedId) return null;
            return document.querySelector(`[data-extension-modal-body='${normalizedId}']`);
        },
        getThemeMetrics
    };
};

export default implementGuiAPI;
