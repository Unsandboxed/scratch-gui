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
    customDataTypes.setExtraMode('set', 'highlight',
        _createHighlighter('Set', (blocklyHighlight, value, node) => {
            node.appendChild(blocklyHighlight.highlight(Array.from(value), 'object'));
        })
    );
    customDataTypes.setExtraMode('map', 'highlight',
        _createHighlighter('Map', (blocklyHighlight, _value, node) => {
            node.appendChild(blocklyHighlight.highlightSingle('{', 'object.openParenth'));
            node.appendChild(blocklyHighlight.highlightSingle('...', 'ctype.data'));
            node.appendChild(blocklyHighlight.highlightSingle('}', 'object.closeParenth'));
        })
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
