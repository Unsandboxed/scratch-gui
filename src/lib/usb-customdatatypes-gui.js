import {safeStringify} from './tw-safe-stringify'; // @todo: DO NOT USE TURBOWARPS SAFE STRINGIFY

const _createHighlighter = (visualType, h) => (
    (blocklyHighlight, value, goog) => {
        const node = goog.dom.createElement('span');
        node.appendChild(blocklyHighlight.highlightSingle(`<${visualType} `, 'ctype.open'));
        h(blocklyHighlight, value, node, goog);
        node.appendChild(blocklyHighlight.highlightSingle(`>`, 'ctype.close'));
        return node;
    }
);


export default /* applyCustomDataTypes */(customDataTypes, ScratchBlocks) => {
    // type: set
    customDataTypes.setExtraMode('set', 'highlight',
        _createHighlighter('Set', (blocklyHighlight, value, node) => {
            node.appendChild(blocklyHighlight.highlight(Array.from(value), 'object'));
        })
    );
    customDataTypes.setExtraMode('set', 'serializeForListRow',
        value => `<Set ${safeStringify(Array.from(value))}>`
    );
    customDataTypes.setExtraMode('set', 'serializeForMonitor',
        customDataTypes.getExtraMode('set', 'serializeForListRow')
    );
    // type: map
    customDataTypes.setExtraMode('map', 'highlight',
        _createHighlighter('Map', (blocklyHighlight, _value, node) => {
            node.appendChild(blocklyHighlight.highlightSingle('{', 'object.openParenth'));
            node.appendChild(blocklyHighlight.highlightSingle('...', 'ctype.data'));
            node.appendChild(blocklyHighlight.highlightSingle('}', 'object.closeParenth'));
        })
    );
    customDataTypes.setExtraMode('map', 'serializeForListRow',
        () => `<Map {...}>`
    );
    customDataTypes.setExtraMode('map', 'serializeForMonitor',
        customDataTypes.getExtraMode('map', 'serializeForListRow')
    );

    ScratchBlocks.Highlight.getCustomHighlightFor = value => {
        const c = customDataTypes.getTCof(value);
        if (!c) {
            return null;
        }
        return (...values) => customDataTypes.callExtraMode(
            customDataTypes.reverseTypeNameLookup(c),
            'highlight',
            ...values
        );
    };
};
