const UPDATE_TARGET_LIST = 'scratch-gui/targets/UPDATE_TARGET_LIST';
const HIGHLIGHT_TARGET = 'scratch-gui/targets/HIGHLIGHT_TARGET';
const UPDATE_TARGET_TAGS = 'scratch-gui/targets/UPDATE_TARGET_TAGS';

const initialState = {
    sprites: {},
    stage: {},
    highlightedTargetId: null,
    highlightedTargetTime: null
};

const normalizeTags = function (tags) {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [];
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_TARGET_LIST:
        return Object.assign({}, state, {
            sprites: action.targets
                .filter(target => !target.isStage)
                .reduce(
                    (targets, target, listId) => Object.assign(
                        targets,
                        {[target.id]: {order: listId, ...target}}
                    ),
                    {}
                ),
            stage: action.targets
                .filter(target => target.isStage)[0] || {},
            editingTarget: action.editingTarget
        });
    case HIGHLIGHT_TARGET:
        return Object.assign({}, state, {
            highlightedTargetId: action.targetId,
            highlightedTargetTime: action.updateTime
        });
    case UPDATE_TARGET_TAGS:
        {
            const normalizedTags = normalizeTags(action.tags);
        if (state.stage && state.stage.id === action.targetId) {
            return Object.assign({}, state, {
                stage: Object.assign({}, state.stage, {
                    tags: normalizedTags
                })
            });
        }
        const targetIdToUpdate = Object.prototype.hasOwnProperty.call(state.sprites, action.targetId) ?
            action.targetId :
            (state.editingTarget && Object.prototype.hasOwnProperty.call(state.sprites, state.editingTarget) ?
                state.editingTarget : null);

        if (!targetIdToUpdate) {
            return state;
        }
        return Object.assign({}, state, {
            sprites: Object.assign({}, state.sprites, {
                [targetIdToUpdate]: Object.assign({}, state.sprites[targetIdToUpdate], {
                    tags: normalizedTags
                })
            })
        });
        }
    default:
        return state;
    }
};
const updateTargets = function (targetList, editingTarget) {
    return {
        type: UPDATE_TARGET_LIST,
        targets: targetList,
        editingTarget: editingTarget
    };
};
const highlightTarget = function (targetId) {
    return {
        type: HIGHLIGHT_TARGET,
        targetId: targetId,
        updateTime: Date.now()
    };
};
const updateTargetTags = function (targetId, tags) {
    return {
        type: UPDATE_TARGET_TAGS,
        targetId: targetId,
        tags: tags
    };
};
export {
    reducer as default,
    initialState as targetsInitialState,
    updateTargets,
    highlightTarget,
    updateTargetTags
};
