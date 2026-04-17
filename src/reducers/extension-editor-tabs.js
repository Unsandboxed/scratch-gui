const OPEN_EXTENSION_EDITOR_TAB = 'scratch-gui/extension-editor-tabs/OPEN_EXTENSION_EDITOR_TAB';
const CLOSE_EXTENSION_EDITOR_TAB = 'scratch-gui/extension-editor-tabs/CLOSE_EXTENSION_EDITOR_TAB';
const UPDATE_EXTENSION_EDITOR_TAB = 'scratch-gui/extension-editor-tabs/UPDATE_EXTENSION_EDITOR_TAB';
const CLEAR_EXTENSION_EDITOR_TABS = 'scratch-gui/extension-editor-tabs/CLEAR_EXTENSION_EDITOR_TABS';

const EXTENSION_EDITOR_TAB_INDEX_START = 1000;

const initialState = {
    tabs: {},
    nextTabIndex: EXTENSION_EDITOR_TAB_INDEX_START
};

const normalizeId = id => `${id || ''}`.trim();

const toFiniteNumber = value => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const extensionEditorTabsReducer = function (state = initialState, action) {
    switch (action.type) {
    case OPEN_EXTENSION_EDITOR_TAB: {
        const payload = action.payload || {};
        const id = normalizeId(payload.id);
        if (!id) return state;

        const existing = state.tabs[id] || null;
        const requestedTabIndex = toFiniteNumber(payload.tabIndex);
        const tabIndex = existing
            ? existing.tabIndex
            : (requestedTabIndex === null ? state.nextTabIndex : Math.floor(requestedTabIndex));

        const orderValue = toFiniteNumber(payload.order);
        const nextTab = {
            id,
            tabIndex,
            title: typeof payload.title === 'string'
                ? payload.title
                : (existing && typeof existing.title === 'string' ? existing.title : id),
            html: typeof payload.html === 'string'
                ? payload.html
                : (existing && typeof existing.html === 'string' ? existing.html : ''),
            url: typeof payload.url === 'string'
                ? payload.url
                : (existing && typeof existing.url === 'string' ? existing.url : ''),
            icon: typeof payload.icon === 'string'
                ? payload.icon
                : (existing && typeof existing.icon === 'string' ? existing.icon : ''),
            className: typeof payload.className === 'string'
                ? payload.className
                : (existing && typeof existing.className === 'string' ? existing.className : ''),
            order: orderValue === null
                ? (existing && Number.isFinite(Number(existing.order)) ? Number(existing.order) : 0)
                : orderValue
        };

        return {
            ...state,
            nextTabIndex: existing
                ? state.nextTabIndex
                : Math.max(state.nextTabIndex, tabIndex + 1),
            tabs: {
                ...state.tabs,
                [id]: nextTab
            }
        };
    }
    case UPDATE_EXTENSION_EDITOR_TAB: {
        const payload = action.payload || {};
        const id = normalizeId(payload.id);
        if (!id || !state.tabs[id]) return state;

        const nextTab = {
            ...state.tabs[id]
        };

        if (Object.prototype.hasOwnProperty.call(payload, 'title') && typeof payload.title === 'string') {
            nextTab.title = payload.title;
        }
        if (Object.prototype.hasOwnProperty.call(payload, 'html') && typeof payload.html === 'string') {
            nextTab.html = payload.html;
        }
        if (Object.prototype.hasOwnProperty.call(payload, 'url') && typeof payload.url === 'string') {
            nextTab.url = payload.url;
        }
        if (Object.prototype.hasOwnProperty.call(payload, 'icon') && typeof payload.icon === 'string') {
            nextTab.icon = payload.icon;
        }
        if (Object.prototype.hasOwnProperty.call(payload, 'className') && typeof payload.className === 'string') {
            nextTab.className = payload.className;
        }
        if (Object.prototype.hasOwnProperty.call(payload, 'order')) {
            const orderValue = toFiniteNumber(payload.order);
            if (orderValue !== null) {
                nextTab.order = orderValue;
            }
        }

        return {
            ...state,
            tabs: {
                ...state.tabs,
                [id]: nextTab
            }
        };
    }
    case CLOSE_EXTENSION_EDITOR_TAB: {
        const payload = action.payload || {};
        const id = normalizeId(payload.id);
        if (!id || !state.tabs[id]) return state;

        const nextTabs = {
            ...state.tabs
        };
        delete nextTabs[id];

        return {
            ...state,
            tabs: nextTabs
        };
    }
    case CLEAR_EXTENSION_EDITOR_TABS:
        return initialState;
    default:
        return state;
    }
};

const openExtensionEditorTab = payload => ({
    type: OPEN_EXTENSION_EDITOR_TAB,
    payload
});

const updateExtensionEditorTab = payload => ({
    type: UPDATE_EXTENSION_EDITOR_TAB,
    payload
});

const closeExtensionEditorTab = id => ({
    type: CLOSE_EXTENSION_EDITOR_TAB,
    payload: {id}
});

const clearExtensionEditorTabs = () => ({
    type: CLEAR_EXTENSION_EDITOR_TABS
});

const getExtensionEditorTabsMap = state => {
    if (!state || !state.scratchGui || !state.scratchGui.extensionEditorTabs) {
        return {};
    }
    return state.scratchGui.extensionEditorTabs.tabs || {};
};

const getOpenExtensionEditorTabs = state => {
    const tabs = getExtensionEditorTabsMap(state);
    return Object.values(tabs).sort((a, b) => {
        const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 0;
        const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.tabIndex - b.tabIndex;
    });
};

const getExtensionEditorTabById = (state, id) => {
    const normalizedId = normalizeId(id);
    if (!normalizedId) return null;

    const tabs = getExtensionEditorTabsMap(state);
    return tabs[normalizedId] || null;
};

export {
    extensionEditorTabsReducer as default,
    initialState as extensionEditorTabsInitialState,
    EXTENSION_EDITOR_TAB_INDEX_START,
    openExtensionEditorTab,
    updateExtensionEditorTab,
    closeExtensionEditorTab,
    clearExtensionEditorTabs,
    getOpenExtensionEditorTabs,
    getExtensionEditorTabById
};