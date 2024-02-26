export default async function ({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();

  Blockly.Connection.prototype.canConnectWithReason_ = () => { 
    return ScratchBlocks.Connection.CAN_CONNECT 
  }
}
