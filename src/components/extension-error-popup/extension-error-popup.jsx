import React from 'react';
import PropTypes from 'prop-types';
import styles from './extension-error-popup.css';
import closeIcon from '../close-button/icon--close.svg';

class ExtensionErrorItem extends React.PureComponent {
    constructor (props) {
        super(props);
        this.hideTimer = null;
        this.closeTimer = null;
        this.enterFrame = null;
        this.progressFrame = null;
        this.hideStart = null;
        this.hideDuration = 4200;
        this.state = {
            entering: false,
            exiting: false,
            progress: 100
        };
    }

    componentDidMount () {
        this.hideStart = performance.now();
        this.enterFrame = requestAnimationFrame(() => {
            this.setState({entering: true});
        });
        const tickProgress = () => {
            const elapsed = performance.now() - this.hideStart;
            const progress = Math.max(0, 100 - (elapsed / this.hideDuration) * 100);
            this.setState({progress});
            if (progress > 0 && !this.state.exiting) {
                this.progressFrame = requestAnimationFrame(tickProgress);
            }
        };
        this.progressFrame = requestAnimationFrame(tickProgress);
        this.hideTimer = setTimeout(() => this.startClose(), 4200);
    }

    componentWillUnmount () {
        if (this.enterFrame !== null) {
            cancelAnimationFrame(this.enterFrame);
        }
        if (this.progressFrame !== null) {
            cancelAnimationFrame(this.progressFrame);
        }
        clearTimeout(this.hideTimer);
        clearTimeout(this.closeTimer);
    }

    startClose () {
        if (this.state.exiting) return;
        if (this.progressFrame !== null) {
            cancelAnimationFrame(this.progressFrame);
        }
        this.setState({entering: false, exiting: true});
        this.closeTimer = setTimeout(() => {
            this.props.onClose(this.props.error.id);
        }, 180);
    }

    render () {
        const {error, onJump} = this.props;
        const {entering, exiting, progress} = this.state;
        const errorType = error.errorType === 'warning' ? 'warning' : 'error';
        const titlePrefix = errorType === 'warning' ? 'WARNING' : 'ERROR';

        return (
            <div className={`${styles.popup} ${styles[errorType]} ${entering ? styles.entered : ''} ${exiting ? styles.exiting : ''}`}>
                <div className={styles.icon} aria-hidden="true">!</div>
                <div className={styles.popupBody}>
                    <div className={styles.popupTitle}>
                        {`${titlePrefix}: ${error.spriteName}`}
                    </div>
                    <div className={styles.popupMessage}>
                        {error.message}
                    </div>
                    {error.blockId ? (
                        <button
                            className={styles.popupJump}
                            onClick={() => onJump(error)}
                            type="button"
                        >
                            Click to jump to the script
                        </button>
                    ) : null}
                </div>
                <button
                    aria-label="Close"
                    className={styles.closeButton}
                    onClick={() => this.startClose()}
                    type="button"
                >
                    <img
                        alt=""
                        className={styles.closeIcon}
                        draggable={false}
                        src={closeIcon}
                    />
                </button>
                <div className={styles.timerTrack} aria-hidden="true">
                    <div
                        className={styles.timerBar}
                        style={{width: `${progress}%`}}
                    />
                </div>
            </div>
        );
    }
}

ExtensionErrorItem.propTypes = {
    error: PropTypes.shape({
        id: PropTypes.number.isRequired,
        spriteName: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        blockId: PropTypes.string,
        errorType: PropTypes.oneOf(['error', 'warning'])
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired
};

const ExtensionErrorPopup = ({errors, onClose, onJump}) => {
    if (!errors || errors.length === 0) return null;
    return (
        <div className={styles.popupList}>
            {errors.map(error => (
                <ExtensionErrorItem
                    error={error}
                    key={error.id}
                    onClose={onClose}
                    onJump={onJump}
                />
            ))}
        </div>
    );
};

ExtensionErrorPopup.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        spriteName: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        blockId: PropTypes.string,
        errorType: PropTypes.oneOf(['error', 'warning'])
    })),
    onClose: PropTypes.func.isRequired,
    onJump: PropTypes.func.isRequired
};

ExtensionErrorPopup.defaultProps = {
    errors: []
};

export default ExtensionErrorPopup;
