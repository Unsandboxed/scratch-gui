import React from 'react';
import VM from 'scratch-vm';
import PropTypes from 'prop-types';
import styles from './monitor.css';
import {safeStringify} from '../../lib/tw-safe-stringify.js'; // @todo: DO NOT USE TURBOWARPS SAFE STRINGIFY

const LargeMonitor = ({categoryColor, value, editing, onEditDone, vm}) => {
    const tc = vm.runtime.customDataTypes.getTCof(value);
    return <span>{!editing && <div className={styles.largeMonitor}>
        <div
            className={styles.largeValue}
            style={{
                background: categoryColor.background,
                color: categoryColor.text
            }}
        >
            {
                tc ?
                    (vm.runtime.customDataTypes.callExtraMode(
                        vm.runtime.customDataTypes.reverseTypeNameLookup(tc),
                        'serializeForMonitor',
                        value
                    ) ?? safeStringify(value)) :
                    safeStringify(value)
            }
        </div>
    </div>}
   {editing && <input defaultValue={value} onKeyDown={
       e => e.which === 13 && onEditDone((e.srcElement || e.target).value)
   } />}</span>
};

LargeMonitor.propTypes = {
    categoryColor: PropTypes.shape({
        background: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    }).isRequired,
    value: PropTypes.any.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default LargeMonitor;
