import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import UnsandboxedExtensions from 'extensions';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import log from '../lib/log';

import extensionLibraryContent, {
    galleryError,
    galleryLoading,
    galleryMore,
    penGroupGallery,
    blacklist
} from '../lib/libraries/extensions/index.jsx';
import extensionTags from '../lib/libraries/tw-extension-tags';
import galleryInsetIcon from '../lib/libraries/extensions/gallery/tw-icon-small.svg';
import customExtensionInsetIcon from '../lib/libraries/extensions/custom/custom-small.svg';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    }
});

const toLibraryItem = extension => {
    if (typeof extension === 'object') {
        return ({
            rawURL: extension.iconURL || extensionIcon,
            ...extension
        });
    }
    return extension;
};

const translateGalleryItem = (extension, locale) => ({
    ...extension,
    name: extension.nameTranslations[locale] || extension.name,
    description: extension.descriptionTranslations[locale] || extension.description
});

let cachedUnsandboxedGallery = null;

const constructUnsandboxedLibrary = async () => {
    const extensions = UnsandboxedExtensions.extensions;
    const manifests = UnsandboxedExtensions.manifests;
    const images = UnsandboxedExtensions.images;

    let gallery = [];
    const list = Object.keys(extensions);
    for (const name of list) {
        const manifest = manifests[name]();

        gallery.push({
            name: manifest.name ?? name,
            // TODO: Support translations
            nameTranslations: {},
            description: manifest.description ?? "Description goes here",
            // TODO: Support translations
            descriptionTranslations: {},
            extensionId: manifest.id ?? name,
            iconURL: images[name](),
            insetIconURL: customExtensionInsetIcon,
            insetColor: manifest.insetIconColor ?? '#66757f',
            tags: ['usb'],
            credits: manifest.createdBy,
            featured: true
        });
    }

    return gallery.filter(extension => !blacklist.has(extension.extensionId));
}

let cachedTurboWarpGallery = null;

const fetchTurboWarpLibrary = async () => {
    const res = await fetch('https://extensions.turbowarp.org/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => ({
        name: extension.name,
        nameTranslations: extension.nameTranslations || {},
        description: extension.description,
        descriptionTranslations: extension.descriptionTranslations || {},
        extensionId: extension.id,
        extensionURL: `https://extensions.turbowarp.org/${extension.slug}.js`,
        iconURL: `https://extensions.turbowarp.org/${extension.image || 'images/unknown.svg'}`,
        insetIconURL: galleryInsetIcon,
        insetColor: '#FF4C4C',
        tags: ['tw'],
        credits: [
            ...(extension.original || []),
            ...(extension.by || [])
        ].map(credit => {
            if (credit.link) {
                return (
                    <a
                        href={credit.link}
                        target="_blank"
                        rel="noreferrer"
                        key={credit.name}
                    >
                        {credit.name}
                    </a>
                );
            }
            return credit.name;
        }),
        docsURI: extension.docs ? `https://extensions.turbowarp.org/${extension.slug}` : null,
        samples: extension.samples ? extension.samples.map(sample => ({
            href: `${process.env.ROOT}editor?project_url=https://extensions.turbowarp.org/samples/${encodeURIComponent(sample)}.sb3`,
            text: sample
        })) : null,
        featured: true
    })).filter(extension => !blacklist.has(extension.extensionId));;
};

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
            unsandboxedGallery: cachedUnsandboxedGallery,
            turbowarpGallery: cachedTurboWarpGallery,
            galleryError: null,
            galleryTimedOut: false
        };
    }
    componentDidMount () {
        if (!this.state.gallery) {
            const timeout = setTimeout(() => {
                this.setState({
                    galleryTimedOut: true
                });
            }, 750);

            constructUnsandboxedLibrary()
                .then(gallery => {
                    cachedUnsandboxedGallery = gallery;
                    this.setState({
                        unsandboxedGallery: cachedUnsandboxedGallery
                    });
                    clearTimeout(timeout);
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error
                    });
                    clearTimeout(timeout);
                });

            fetchTurboWarpLibrary()
                .then(gallery => {
                    cachedTurboWarpGallery = gallery;
                    this.setState({
                        turbowarpGallery: cachedTurboWarpGallery
                    });
                    clearTimeout(timeout);
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error
                    });
                    clearTimeout(timeout);
                });
        }
    }
    handleItemSelect (item) {
        if (item.href) {
            return;
        }

        const extensionId = item.extensionId;

        if (extensionId === 'custom_extension') {
            this.props.onOpenCustomExtensionModal();
            return;
        }

        if (extensionId === 'procedures_enable_return') {
            this.props.onEnableProcedureReturns();
            this.props.onCategorySelected('myBlocks');
            return;
        }

        const url = item.extensionURL ? item.extensionURL : extensionId;
        if (!item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(extensionId)) {
                this.props.onCategorySelected(extensionId);
            } else {
                this.props.vm.extensionManager.loadExtensionURL(url)
                    .then(() => {
                        this.props.onCategorySelected(extensionId);
                    })
                    .catch(err => {
                        log.error(err);
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render () {
        let library = null;
        if ((this.state.turbowarpGallery && this.state.unsandboxedGallery) || this.state.galleryError || this.state.galleryTimedOut) {
            library = extensionLibraryContent.map(toLibraryItem);
            library.push('---');
            if ((this.state.turbowarpGallery && this.state.unsandboxedGallery)) {
                library.push(
                    ...this.state.unsandboxedGallery
                        .map(toLibraryItem),
                );
                library.push(toLibraryItem(galleryMore));
                library.push(toLibraryItem(penGroupGallery));
                const locale = this.props.intl.locale;
                library.push(
                    ...this.state.turbowarpGallery
                        .filter(i => i.extensionId !== 'faceSensing')
                        .map(i => translateGalleryItem(i, locale))
                        .map(toLibraryItem),
                );
            } else if (this.state.galleryError) {
                library.push(toLibraryItem(galleryError));
            } else {
                library.push(toLibraryItem(galleryLoading));
            }
        }

        return (
            <LibraryComponent
                data={library}
                filterable
                persistableKey="extensionId"
                id="extensionLibrary"
                tags={extensionTags}
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onEnableProcedureReturns: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);
