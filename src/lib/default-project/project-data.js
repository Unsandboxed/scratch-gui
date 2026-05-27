import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

import * as assets from './assets';

let messages = defineMessages({
    variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {
                    '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                        translator(messages.variable),
                        0
                    ]
                },
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: assets.backdrop.hash,
                        name: translator(messages.backdrop, {index: 1}),
                        md5ext: `${assets.backdrop.hash}.svg`,
                        dataFormat: 'svg',
                        rotationCenterX: 240,
                        rotationCenterY: 180
                    }
                ],
                sounds: [],
                volume: 100
            },
            {
                isStage: false,
                name: translator(messages.sprite, {index: 1}),
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: assets.Sandy1.hash,
                        name: translator(messages.costume, {index: 1}),
                        bitmapResolution: 1,
                        md5ext: `${assets.Sandy1.hash}.svg`,
                        dataFormat: 'svg',
                        rotationCenterX: 44.156184159652724,
                        rotationCenterY: 51.508237134270445
                    },
                    {
                        assetId: assets.Sandy2.hash,
                        name: translator(messages.costume, {index: 2}),
                        bitmapResolution: 1,
                        md5ext: `${assets.Sandy2.hash}.svg`,
                        dataFormat: 'svg',
                        rotationCenterX: 52.33362218184814,
                        rotationCenterY: 55.36285780562275
                    },
                    {
                        assetId: assets.Sandy3.hash,
                        name: translator(messages.costume, {index: 3}),
                        bitmapResolution: 1,
                        md5ext: `${assets.Sandy3.hash}.svg`,
                        dataFormat: 'svg',
                        rotationCenterX: 43.19538319010644,
                        rotationCenterY: 55.36286713427046
                    }
                ],
                sounds: [],
                volume: 100,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'looking'
            }
        ],
        meta: {
            semver: '3.0.0',
            vm: '0.1.0',
            ubpVersion: 1,
            agent: ''
        }
    });
};


export default projectData;
