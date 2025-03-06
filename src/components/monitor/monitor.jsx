import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import {FormattedMessage} from 'react-intl';
import {ContextMenuTrigger, SubMenu} from 'react-contextmenu';
import {BorderedMenuItem, ContextMenu, MenuItem} from '../context-menu/context-menu.jsx';
import Box from '../box/box.jsx';
import DefaultMonitor from './default-monitor.jsx';
import LargeMonitor from './large-monitor.jsx';
import SliderMonitor from '../../containers/slider-monitor.jsx';
import ListMonitor from '../../containers/list-monitor.jsx';
import {Theme} from '../../lib/themes/index.js';

import styles from './monitor.css';

// Map category name to color name used in scratch-blocks Blockly.Colours
const categoryColorMap = {
    data: 'data',
    sensing: 'sensing',
    sound: 'sounds',
    looks: 'looks',
    motion: 'motion',
    list: 'data_lists',
    extension: 'pen',
    camera: 'camera'
};

const modes = {
    default: DefaultMonitor,
    large: LargeMonitor,
    slider: SliderMonitor,
    list: ListMonitor
};

const getCategoryColor = (theme, category) => {
    const colors = theme.getStageBlockColors();
    return {
        background: colors[categoryColorMap[category]].primary,
        text: colors.text
    };
};

const MonitorComponent = class MonitorComponent extends React.Component {
    getConversionItems () {
        const type = this.props.getType();
        if (type === 'undefined') return;
        return (<React.Fragment>
            <BorderedMenuItem onClick={this.props.onEdit}>
                <FormattedMessage
                    defaultMessage="edit content"
                    description="Edit the content"
                    id="gui.monitor.contextMenu.edit"
                />
            </BorderedMenuItem>
            {type !== 'string' && <MenuItem onClick={() => this.props.onConversion('string')}>
                    <FormattedMessage
                        defaultMessage="convert to string"
                        description="Converts the value to a string"
                        id="gui.monitor.contextMenu.cts"
                    />
                </MenuItem> }
            {type === 'string' && <MenuItem onClick={() => this.props.onConversion('number')}>
                    <FormattedMessage
                        defaultMessage="convert to number"
                        description="Converts the value to a number"
                        id="gui.monitor.contextMenu.ctn"
                    />
                </MenuItem> }
            {(type === 'string' || type === 'number') && <MenuItem onClick={() => this.props.onConversion('boolean')}>
                    <FormattedMessage
                        defaultMessage="convert to boolean"
                        description="Converts the value to a boolean"
                        id="gui.monitor.contextMenu.ctb"
                    />
                </MenuItem> }
            {type === 'string' && <MenuItem onClick={() => this.props.onConversion('array')}>
                    <FormattedMessage
                        defaultMessage="convert to array"
                        description="Converts the value to an array"
                        id="gui.monitor.contextMenu.cta"
                    />
                </MenuItem> }
            {type === 'string' && <MenuItem onClick={() => this.props.onConversion('object')}>
                    <FormattedMessage
                        defaultMessage="convert to object"
                        description="Converts the value to an object"
                        id="gui.monitor.contextMenu.cto"
                    />
                </MenuItem> }
        </React.Fragment>);
    }
    render () {
        return (
          <ContextMenuTrigger
              // TW: if export is defined, we always show it, even outside of the editor
              disable={!this.props.draggable && !this.props.onExport}
              holdToDisplay={this.props.mode === 'slider' ? -1 : 1000}
              id={`monitor-${this.props.label}`}
          ><React.Fragment>
              <Draggable
                  bounds=".monitor-overlay" // Class for monitor container
                  cancel=".no-drag" // Class used for slider input to prevent drag
                  defaultClassNameDragging={styles.dragging}
                  disabled={!this.props.draggable}
                  onStop={this.props.onDragEnd}
      
                  // https://github.com/TurboWarp/scratch-gui/issues/950
                  enableUserSelectHack={false}
              >
                  <Box
                      className={styles.monitorContainer}
                      componentRef={this.props.componentRef}
                      onDoubleClick={this.props.mode === 'list' || !this.props.draggable ? null : this.props.onNextMode}
                      data-id={this.props.id}
                      data-opcode={this.props.opcode}
                  >
                      {React.createElement(modes[this.props.mode], {
                          categoryColor: getCategoryColor(this.props.theme, this.props.category),
                          ...this.props
                      })}
                  </Box>
              </Draggable>
              {ReactDOM.createPortal((
                  // Use a portal to render the context menu outside the flow to avoid
                  // positioning conflicts between the monitors `transform: scale` and
                  // the context menus `position: fixed`. For more details, see
                  // http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/
                  <ContextMenu id={`monitor-${this.props.label}`}>
                      <div id={`monitor-readout-${this.props.label}`}>
                      {this.props.draggable && this.props.onSetModeToDefault &&
                          <MenuItem onClick={this.props.onSetModeToDefault}>
                              <FormattedMessage
                                  defaultMessage="normal readout"
                                  description="Menu item to switch to the default monitor"
                                  id="gui.monitor.contextMenu.default"
                              />
                          </MenuItem>}
                      {this.props.draggable && this.props.onSetModeToLarge &&
                          <MenuItem onClick={this.props.onSetModeToLarge}>
                              <FormattedMessage
                                  defaultMessage="large readout"
                                  description="Menu item to switch to the large monitor"
                                  id="gui.monitor.contextMenu.large"
                              />
                          </MenuItem>}
                      {this.props.draggable && this.props.onSetModeToSlider &&
                          <MenuItem onClick={this.props.onSetModeToSlider}>
                              <FormattedMessage
                                  defaultMessage="slider"
                                  description="Menu item to switch to the slider monitor"
                                  id="gui.monitor.contextMenu.slider"
                              />
                          </MenuItem>}
                      </div>
                      {this.props.draggable && this.props.mode !== 'list' && <div id={`monitor-edit-${this.props.label}`}>
                        {this.props.onSliderPromptOpen && this.props.mode === 'slider' &&
                            <MenuItem onClick={this.props.onSliderPromptOpen}>
                                <FormattedMessage
                                    defaultMessage="change slider range"
                                    description="Menu item to change the slider range"
                                    id="gui.monitor.contextMenu.sliderRange"
                                />
                            </MenuItem>}
                        {this.getConversionItems()}
                      </div>}
                      {this.props.onImport &&
                          <MenuItem onClick={this.props.onImport}>
                              <FormattedMessage
                                  defaultMessage="import"
                                  description="Menu item to import into list monitors"
                                  id="gui.monitor.contextMenu.import"
                              />
                          </MenuItem>}
                      {this.props.onExport &&
                          <MenuItem onClick={this.props.onExport}>
                              <FormattedMessage
                                  defaultMessage="export"
                                  description="Menu item to export from list monitors"
                                  id="gui.monitor.contextMenu.export"
                              />
                          </MenuItem>}
                      {this.props.draggable && this.props.onHide &&
                          <BorderedMenuItem onClick={this.props.onHide}>
                              <FormattedMessage
                                  defaultMessage="hide"
                                  description="Menu item to hide the monitor"
                                  id="gui.monitor.contextMenu.hide"
                              />
                          </BorderedMenuItem>}
                  </ContextMenu>
              ), document.body)}
          </React.Fragment></ContextMenuTrigger>
      );
    }
};

const monitorModes = Object.keys(modes);

MonitorComponent.propTypes = {
    category: PropTypes.oneOf(Object.keys(categoryColorMap)),
    componentRef: PropTypes.func.isRequired,
    draggable: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(monitorModes),
    opcode: PropTypes.string.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    onExport: PropTypes.func,
    onImport: PropTypes.func,
    onHide: PropTypes.func,
    onNextMode: PropTypes.func.isRequired,
    onSetModeToDefault: PropTypes.func,
    onSetModeToLarge: PropTypes.func,
    onSetModeToSlider: PropTypes.func,
    onSliderPromptOpen: PropTypes.func,
    theme: PropTypes.instanceOf(Theme).isRequired,
    getType: PropTypes.func
};

MonitorComponent.defaultProps = {
    category: 'extension',
    mode: 'default'
};

export {
    MonitorComponent as default,
    monitorModes
};
