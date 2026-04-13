import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Box from '../components/box/box.jsx';
import Modal from './modal.jsx';
import {closeExtensionModal, getOpenExtensionModals} from '../reducers/extension-modals';

const ExtensionModalBody = ({modal}) => {
    const hasUrl = typeof modal.url === 'string' && modal.url.length > 0;
    if (hasUrl) {
        return (
            <iframe
                title={modal.title || modal.id}
                src={modal.url}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                    background: 'white'
                }}
            />
        );
    }

    return (
        <div
            data-extension-modal-body={modal.id}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: 16,
                boxSizing: 'border-box',
                background: 'white',
                color: '#111827'
            }}
            dangerouslySetInnerHTML={{__html: modal.html || ''}}
        />
    );
};

ExtensionModalBody.propTypes = {
    modal: PropTypes.shape({
        id: PropTypes.string.isRequired,
        html: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string
    }).isRequired
};

const TWExtensionModals = ({modals, onClose}) => (
    <React.Fragment>
        {modals.map(modal => {
            const width = Number(modal.width) > 0 ? Number(modal.width) : 720;
            const height = Number(modal.height) > 0 ? Number(modal.height) : 520;
            const modalStyle = {
                content: {
                    width: `${Math.round(width)}px`,
                    maxWidth: 'calc(100vw - 48px)',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '56px',
                    marginBottom: '56px'
                }
            };
            return (
                <Modal
                    key={modal.id}
                    id={`extension-${modal.id}`}
                    contentLabel={modal.title || modal.id}
                    onRequestClose={() => onClose(modal.id)}
                    className={modal.className}
                    style={modalStyle}
                >
                    <Box
                        style={{
                            width: '100%',
                            height: `${Math.round(height)}px`,
                            maxHeight: 'calc(100vh - 220px)'
                        }}
                    >
                        <ExtensionModalBody modal={modal} />
                    </Box>
                </Modal>
            );
        })}
    </React.Fragment>
);

TWExtensionModals.propTypes = {
    modals: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        className: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        html: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })).isRequired,
    onClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    modals: getOpenExtensionModals(state)
});

const mapDispatchToProps = dispatch => ({
    onClose: id => dispatch(closeExtensionModal(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TWExtensionModals);
