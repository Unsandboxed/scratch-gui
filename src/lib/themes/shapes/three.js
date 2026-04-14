// Constants
const gridUnit = 4;
const cornerRadius = 4;

// Static paths
const startHat = 'c 25,-22 71,-22 96,0';

const notchPath = function (left) {
    if (left) {
        return `
            c 2,0 3,1 4,2 
            l 4,4 
            c 1,1 2,2 4,2 
            h 12 
            c 2,0 3,-1 4,-2 
            l 4,-4 
            c 1,-1 2,-2 4,-2
        `;
    } else {
        return `
            c -2,0 -3,1 -4,2 
            l -4,4 
            c -1,1 -2,2 -4,2 
            h -12 
            c -2,0 -3,-1 -4,-2 
            l -4,-4 
            c -1,-1 -2,-2 -4,-2
        `;
    }
}

const shapeHexagonal = function (start, unit) {
    return `
        ${(start) ? `M ${4 * gridUnit},0` : ''}
         h 
    `;
}

const topLeftCornerStart = function (radius) {
    if (!radius) {
        radius = cornerRadius;
    }

    return 'm 0,' + radius;
};

const topLeftCorner = function (radius) {
    if (!radius) {
        radius = cornerRadius;
    }

    return 'A ' + radius + ',' +
        radius + ' 0 0,1 ' +
        radius + ',0';
};

const topRightCorner = function (radius) {
    if (!radius) {
        radius = cornerRadius;
    }

    return 'A ' + radius + ',' +
        radius + ' 0 0,1 ' +
        radius + ',0';
};

const bottomRightCorner = function (radius) {
    if (!radius) {
        radius = cornerRadius;
    }

    return 'A ' + radius + ',' +
        radius + ' 0 0,1 ' +
        radius + ',0';
};

const bottomLeftCorner = function (radius) {
    if (!radius) {
        radius = cornerRadius;
    }

    return 'A ' + radius + ',' +
        radius + ' 0 0,1 ' +
        radius + ',0';
};

const innerTopLeft = function (radius) {
    if (!radius) {
        radius = Blockly.BlockSvg.CORNER_RADIUS;
    }

    return ' a ' + radius + ',' +
        radius + ' 0 0,0 -' +
        radius + ',' +
        radius;
};

const innerBottomLeft = function (radius) {
    if (!radius) {
        radius = Blockly.BlockSvg.CORNER_RADIUS;
    }

    return 'a ' + radius + ',' +
        radius + ' 0 0,0 ' +
        radius + ',' +
        radius;
}