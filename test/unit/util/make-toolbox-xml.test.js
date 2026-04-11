import makeToolboxXML from '../../../src/lib/make-toolbox-xml';

const getCategoryXML = (toolboxXML, categoryId) => {
    const pattern = new RegExp(`<category[^>]*id="${categoryId}"[^>]*>[\\s\\S]*?<\\/category>`);
    const match = toolboxXML.match(pattern);
    return match ? match[0] : null;
};

describe('makeToolboxXML appendTo support', () => {
    test('appends extension blocks to an existing core category', () => {
        const toolboxXML = makeToolboxXML(null, false, false, 'target-id', [
            {
                id: 'myExtension',
                appendTo: 'control',
                xml: '<category name="My Extension" id="myExtension"><block type="myExtension_block"></block></category>'
            }
        ]);

        const controlCategoryXML = getCategoryXML(toolboxXML, 'control');
        expect(controlCategoryXML).toContain('<block type="myExtension_block"></block>');
        expect(toolboxXML).not.toContain('id="myExtension"');
    });

    test('keeps extension category when appendTo target is unknown', () => {
        const toolboxXML = makeToolboxXML(null, false, false, 'target-id', [
            {
                id: 'myExtension',
                appendTo: 'not-a-category',
                xml: '<category name="My Extension" id="myExtension"><block type="myExtension_block"></block></category>'
            }
        ]);

        const extensionCategoryXML = getCategoryXML(toolboxXML, 'myExtension');
        expect(extensionCategoryXML).toContain('<block type="myExtension_block"></block>');
    });
});
