import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import overrideDefaultProject from '!arraybuffer-loader!./override-default-project.sb3';

import * as assets from './assets';

const defaultProject = translator => {
    if (overrideDefaultProject.byteLength > 0) {
        return [{
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: overrideDefaultProject
        }];
    }

    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: assets.backdrop.hash,
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: assets.backdrop.content
    }, {
        id: assets.Sandy1.hash,
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: assets.Sandy1.content
    }, {
        id: assets.Sandy2.hash,
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: assets.Sandy2.content
    }, {
        id: assets.Sandy3.hash,
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: assets.Sandy3.content
    }];
};

export default defaultProject;
