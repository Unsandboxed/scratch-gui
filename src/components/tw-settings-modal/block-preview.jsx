import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './settings-modal.css';

const getBlockSvg = props => {
    let steps = [];
    const blockHeight = props.blockSettings.blockHeight;

    // top
    steps.push("m 0 4 A 4 4 0 0 1 4 0 H 12 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H 134.5 a 4 4 0 0 1 4 4");
    // block height, right side
    steps.push(`v ${blockHeight}`);
    // bottom and left side
    steps.push("a 4 4 0 0 1 -4 4 H 48 h 0 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 H 4 a 4 4 0 0 1 -4 -4 z");

    return `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="139.5"
            height="` + (17 + 80) + `" viewBox="0,0,139.5,` + (17 + 80) + `">
            <style xmlns="http://www.w3.org/1999/xhtml">
                .blocklyText {
                    fill: #FFFFFF;
                    font-family: "Helvetica Neue", Helvetica, sans-serif;
                    font-size: 12pt;
                    font-weight: 500;
                }

                .blocklyNonEditableText&gt;
                text,
                .blocklyEditableText&gt;

                text {
                    fill: #575E75;
                }

                .blocklyDropdownText {
                    fill: #FFFFFF !important;
                }
            </style>
            <g transform="translate(0,0)">
                <path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1"
                    d="` + steps.join() + `"/>
                <text class="blocklyText" y="0" text-anchor="middle" dominant-baseline="middle" dy="0" x="27.56944465637207"
                    transform="translate(8, ` + (26 + (blockHeight - 40) / 2) + `)">preview</text>
                <path class="blocklyPath blocklyInputOutline" style="visibility: hidden" d="" fill="#3373CC" />
                <g data-id="ZFO)V5CN10L;BQbOcI!j" data-argument-type="text" style="cursor: text;" data-shapes="argument"
                    transform="translate(71.13888931274414,8)">
                    <path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1"
                        d="m 0,4 A 4,4 0 0,1 4,0 H 55.36111068725586 a 4,4 0 0,1 4,4 v ` + (24 + (blockHeight - 40)) + ` a 4,4 0 0,1 -4,4 H 4 a 4,4 0 0,1 -4,-4 z" />
                    <g class="blocklyEditableText" transform="translate(8, 0) ">
                        <text class="blocklyTextField" x="21.68055534362793" y="` + (18 + (blockHeight - 40) / 2) + `" dominant-baseline="middle" dy="0"
                            text-anchor="middle">block</text>
                    </g>
                </g>
            </g>
        </svg>
    `;
}

const BlockPreview = props => (
    <img
        src={`data:image/svg+xml;base64,${btoa(getBlockSvg(props))}`}
        draggable={false}
    />
);

BlockPreview.propTypes = {
    intl: intlShape,
    blockHeight: PropTypes.number,
    notchHeight: PropTypes.number,
    cornerRadius: PropTypes.number,
    cornerCurve: PropTypes.number,
};

export default injectIntl(BlockPreview);
