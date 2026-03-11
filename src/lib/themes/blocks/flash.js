import musicIcon from './flash-media/extensions/musicIcon.svg';
import penIcon from './flash-media/extensions/penIcon.svg';
import text2speechIcon from './flash-media/extensions/text2speechIcon.svg';
import translateIcon from './flash-media/extensions/translateIcon.svg';
import videoSensingIcon from './flash-media/extensions/videoSensingIcon.svg';
import {hex2hsv, hsv2hex} from '../../tw-color-utils';

const blockColors = {
    motion: {
        primary: '#4a6cd4',
        secondary: '#4463c2',
        tertiary: '#3e5ab1',
        quaternary: '#3e5ab1'
    },
    looks: {
        primary: '#8a55d7',
        secondary: '#7e4ec4',
        tertiary: '#7347b3',
        quaternary: '#7347b3'
    },
    sounds: {
        primary: '#bb42c3',
        secondary: '#ab3cb2',
        tertiary: '#9c37a3',
        quaternary: '#9c37a3'

    },
    control: {
        primary: '#e1a91a',
        secondary: '#ce9a18',
        tertiary: '#bc8d16',
        quaternary: '#bc8d16'
    },
    event: {
        primary: '#c88330',
        secondary: '#b7782c',
        tertiary: '#a76e28',
        quaternary: '#a76e28'
    },
    sensing: {
        primary: '#2ca5e2',
        secondary: '#2897cf',
        tertiary: '#258abd',
        quaternary: '#258abd'
    },
    camera: {
        primary: '#d84646',
        secondary: '#c54040',
        tertiary: '#b43a3a',
        quaternary: '#b43a3a'
    },
    pen: {
        primary: '#0e9a6c',
        secondary: '#0d8d63',
        tertiary: '#0c815a',
        quaternary: '#0c815a'
    },
    operators: {
        primary: '#5cb712',
        secondary: '#54a710',
        tertiary: '#4d990f',
        quaternary: '#4d990f'
    },
    string: {
        primary: '#419f86',
        secondary: '#3b917a',
        tertiary: '#36846f',
        quaternary: '#36846f'
    },
    data: {
        primary: '#ee7d16',
        secondary: '#d97214',
        tertiary: '#c66812',
        quaternary: '#c66812'
    },
    // This is not a new category, but rather for differentiation
    // between lists and scalar variables.
    data_lists: {
        primary: '#cc5b22',
        secondary: '#ba531f', // I don't think this is used, b/c we don't have any droppable fields in list blocks yet
        tertiary: '#aa4c1c',
        quaternary: '#aa4c1c'
    },
    more: {
        primary: '#632d99',
        secondary: '#5a298c',
        tertiary: '#522580',
        quaternary: '#522580'
    },
    addons: {
        primary: '#29beb8',
        secondary: '#3aa8a4',
        tertiary: '#3aa8a4',
        quaternary: '#3aa8a4'
    },
};

const extensions = {
    music: {
        blockIconURI: musicIcon
    },
    pen: {
        blockIconURI: penIcon
    },
    text2speech: {
        blockIconURI: text2speechIcon
    },
    translate: {
        blockIconURI: translateIcon
    },
    videoSensing: {
        blockIconURI: videoSensingIcon
    }
};

export {
    blockColors,
    extensions
};
