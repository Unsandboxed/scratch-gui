export default async function ({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();

  Blockly.Connection.REASON_CHECKS_FAILED = 0;
}
