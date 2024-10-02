import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import overrideDefaultProject from '!arraybuffer-loader!./override-default-project.sb3';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import Sandy1 from '!raw-loader!./Sandy1.svg';
import Sandy2 from '!raw-loader!./Sandy2.svg';
import Sandy3 from '!raw-loader!./Sandy3.svg';
/* eslint-enable import/no-unresolved */
import {TextEncoder} from '../tw-text-encoder';

const defaultProject = translator => {
    if (overrideDefaultProject.byteLength > 0) {
        return [{
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: overrideDefaultProject
        }];
    }

    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: 'cd21514d0531fdffb22204e0ec5ed84a',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(backdrop)
    }, {
        id: '927d672925e7b99f7813735c484c6922',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(Sandy1)
    }, {
        id: '5f0bf4c4fcf8a7b9ede17215f40c8440',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(Sandy2)
    }, {
        id: 'f40bd8ae5c2514f84f100b4ffe7c94c7',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(Sandy3)
    }];
};

export default defaultProject;
