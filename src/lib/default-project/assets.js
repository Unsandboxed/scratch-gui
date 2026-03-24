import svgBackdrop from '!raw-loader!./backdrop.svg';
import svgSandy1 from '!raw-loader!./Sandy1.svg';
import svgSandy2 from '!raw-loader!./Sandy2.svg';
import svgSandy3 from '!raw-loader!./Sandy3.svg';
import {md5} from 'js-md5';
/* eslint-enable import/no-unresolved */
import {TextEncoder} from '../tw-text-encoder';

let _TextEncoder;
if (typeof TextEncoder === 'undefined') {
    _TextEncoder = require('text-encoding').TextEncoder;
} else {
    _TextEncoder = TextEncoder;
}
const encoder = new _TextEncoder();

/**
 * @typedef {Object} MD5Asset
 * @property {string} hash MD5 hash of this assets contents.
 * @property {Uint8Array} content Uin8Array encoded contents of this asset.
 */

/**
 * Converts a string to a usable asset.
 * @param {string} contents Asset contents (as a string).
 * @returns {MD5Asset} Constructed asset.
 */
const assetFrom = contents => ({hash: md5(contents), content: encoder.encode(contents)});

export const backdrop = assetFrom(svgBackdrop);
export const Sandy1 = assetFrom(svgSandy1);
export const Sandy2 = assetFrom(svgSandy2);
export const Sandy3 = assetFrom(svgSandy3);
