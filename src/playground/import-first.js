import VMPrestateHook from 'scratch-vm/src/prestate-hook';
// eslint-disable-next-line
if (process.env.SCRATCHVM_PRESTATEHOOK) {
    // Tell the VM if it should do some prestate exposing
    // (this is for debugging where more access is required to debug)
    VMPrestateHook.sawGUI = true;
    VMPrestateHook.setDebug(false);
}

import './public-path';
import '../lib/tw-polyfill';
import '../lib/normalize.css';
