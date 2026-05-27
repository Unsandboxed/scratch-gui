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
import customExtensionIcon from '../lib/libraries/extensions/custom/custom.svg';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    }
});

const LOCAL_DEV_SERVER_PORT = 8001;
const LOCAL_DEV_SERVER_FLAG = 'usb.useLocalExtensionDevServer';
const LOCAL_DEV_SERVER_BASE_URL = `http://localhost:${LOCAL_DEV_SERVER_PORT}`;
const LOCAL_DEV_FETCH_TIMEOUT_MS = 1200;
const LOCAL_DEV_GALLERY_CACHE_TTL_MS = 30000;

const fetchWithTimeout = async (url, options = {}, timeoutMs = LOCAL_DEV_FETCH_TIMEOUT_MS) => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = setTimeout(() => {
        if (controller) {
            controller.abort();
        }
    }, timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            ...(controller ? {signal: controller.signal} : {})
        });
    } finally {
        clearTimeout(timeoutId);
    }
};

const shouldUseLocalDevServer = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    // Default to disabled to avoid localhost probing delays during normal usage.
    // Users can explicitly enable by setting localStorage[LOCAL_DEV_SERVER_FLAG] = '1'.
    try {
        const localFlag = window.localStorage.getItem(LOCAL_DEV_SERVER_FLAG);
        return localFlag === '1';
    } catch (error) {
        return false;
    }
};

const toLocalDevServerExtensionURL = subPath =>
    `${LOCAL_DEV_SERVER_BASE_URL}/extensions/${subPath}/index.js`;

const isLocalDevServerExtensionURL = url =>
    typeof url === 'string' &&
    url.startsWith(`${LOCAL_DEV_SERVER_BASE_URL}/extensions/`);

const toLocalDevServerExtensionAssetURL = (subPath, assetName) =>
    `${LOCAL_DEV_SERVER_BASE_URL}/extensions/${subPath}/${assetName}`;

const toLocalDevServerMetadataURL = subPath =>
    `${LOCAL_DEV_SERVER_BASE_URL}/extensions/${subPath}/metadata.json`;

const toLocalDevServerGeneratedThumbnailURL = (subPath, color) => {
    const query = new URLSearchParams();
    query.set('subPath', subPath);
    if (typeof color === 'string' && color.trim()) {
        query.set('color', color.trim());
    }
    return `${LOCAL_DEV_SERVER_BASE_URL}/generated-thumbnail?${query.toString()}`;
};

const toSearchableText = value => {
    if (typeof value === 'string') {
        return value.trim().toLowerCase();
    }

    if (React.isValidElement(value) && value.props && typeof value.props.defaultMessage === 'string') {
        return value.props.defaultMessage.trim().toLowerCase();
    }

    return '';
};


const dedupeExtensions = items => {
    const seenIds = new Set();
    const seenFallbackKeys = new Set();

    return items.filter(item => {
        if (!item) {
            return false;
        }

        const extensionId = typeof item.extensionId === 'string' ? item.extensionId.trim().toLowerCase() : '';
        if (extensionId) {
            if (seenIds.has(extensionId)) {
                return false;
            }
            seenIds.add(extensionId);
            return true;
        }

        const name = toSearchableText(item.name);
        const description = toSearchableText(item.description);
        const fallbackKey = `${name}|${description}`;

        if (!name && !description) {
            return true;
        }

        if (seenFallbackKeys.has(fallbackKey)) {
            return false;
        }

        seenFallbackKeys.add(fallbackKey);
        return true;
    });
};

const toLibraryItem = extension => {
    if (typeof extension === 'object') {
        return ({
            rawURL: extension.iconURL || customExtensionIcon || extensionIcon,
            ...extension
        });
    }
    return extension;
};

const LOCAL_DEV_STATUS = {
    LOCAL_ONLY: 'local-only',
    LOCAL_OVERRIDE: 'local-override'
};

const normalizeCreditsForComparison = credits => {
    if (!Array.isArray(credits)) {
        return '';
    }

    return credits
        .map(credit => {
            if (typeof credit === 'string') {
                return credit;
            }

            if (credit && typeof credit === 'object' && typeof credit.name === 'string') {
                return credit.name;
            }

            return '';
        })
        .filter(Boolean)
        .join('|');
};

const hasMeaningfulMetadataDiff = (localItem, bundledItem) => {
    if (!localItem || !bundledItem) {
        return false;
    }

    const localName = toSearchableText(localItem.name);
    const bundledName = toSearchableText(bundledItem.name);
    if (localName !== bundledName) {
        return true;
    }

    const localDescription = toSearchableText(localItem.description);
    const bundledDescription = toSearchableText(bundledItem.description);
    if (localDescription !== bundledDescription) {
        return true;
    }

    const localInsetColor = toSearchableText(localItem.insetColor);
    const bundledInsetColor = toSearchableText(bundledItem.insetColor);
    if (localInsetColor !== bundledInsetColor) {
        return true;
    }

    return normalizeCreditsForComparison(localItem.credits) !== normalizeCreditsForComparison(bundledItem.credits);
};

const translateGalleryItem = (extension, locale) => ({
    ...extension,
    name: extension.nameTranslations[locale] || extension.name,
    description: extension.descriptionTranslations[locale] || extension.description
});

// Manual ordering for the full extension list by extension ID.
const PRIMARY_EXTENSION_ORDER = [
    // Core data and utility blocks
    'usbArrays',
    'usbObjects',
    'usbTypes',
    'usbVectors',
    'usbTemporaryData',
    'usbRuntime',
    'usbIteration',
    // Input and interaction
    'usbMouse',
    'usbTouch',
    // Visual/compositing
    'usbComments',
    'usbSpriteTags',
    'usbBlendingEffects',
    'usbClipMask',
    'text', // tw animated text (lab/text)
    'stretch', // wont be around for long but we want it to be high priority while it is
    // Built-in Scratch cards
    'pen',
    'music',
    'videoSensing',
    'text2speech',
    'translate'
];

// Temporary curation mode to hide most non-Unsandboxed cards.
const TEMP_MINIMAL_LIBRARY_MODE = false;

// Allowlist of default extension IDs that stay visible in temporary curation mode.
const TEMP_VISIBLE_DEFAULT_EXTENSION_IDS = ['custom_extension'];

// TurboWarp IDs to suppress when we provide our own canonical implementation.
const SUPPRESSED_TURBOWARP_EXTENSION_IDS = new Set([
    'stretch'
]);

const orderById = (extensions, orderedIds) => {
    if (!orderedIds.length) {
        return extensions;
    }

    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
    return extensions
        .map((extension, index) => ({extension, index}))
        .sort((left, right) => {
            const leftOrder = orderMap.get(left.extension.extensionId);
            const rightOrder = orderMap.get(right.extension.extensionId);

            const leftRanked = typeof leftOrder === 'number';
            const rightRanked = typeof rightOrder === 'number';

            if (leftRanked && rightRanked) {
                return leftOrder - rightOrder;
            }
            if (leftRanked) {
                return -1;
            }
            if (rightRanked) {
                return 1;
            }

            // Preserve source order for unranked items.
            return left.index - right.index;
        })
        .map(item => item.extension);
};

let cachedUnsandboxedGallery = null;
let cachedLocalDevServerGallery = null;
let cachedLocalDevServerGalleryAt = 0;
let cachedLocalDevServerGalleryPromise = null;

const fetchLocalDevServerLibraryCached = async () => {
    const now = Date.now();
    if (cachedLocalDevServerGallery && (now - cachedLocalDevServerGalleryAt) < LOCAL_DEV_GALLERY_CACHE_TTL_MS) {
        return cachedLocalDevServerGallery;
    }

    if (cachedLocalDevServerGalleryPromise) {
        return cachedLocalDevServerGalleryPromise;
    }

    cachedLocalDevServerGalleryPromise = fetchLocalDevServerLibrary()
        .then(items => {
            cachedLocalDevServerGallery = items;
            cachedLocalDevServerGalleryAt = Date.now();
            return items;
        })
        .finally(() => {
            cachedLocalDevServerGalleryPromise = null;
        });

    return cachedLocalDevServerGalleryPromise;
};

const constructUnsandboxedLibrary = async () => {
    const extensions = UnsandboxedExtensions.extensions;
    const manifests = UnsandboxedExtensions.manifests;
    const images = UnsandboxedExtensions.images;
    const insetImages = UnsandboxedExtensions.insetImages || {};
    const extensionPaths = UnsandboxedExtensions.extensionPaths || {};
    const useLocalDevServer = shouldUseLocalDevServer();

    let gallery = [];
    const list = Object.keys(extensions);
    for (const name of list) {
        const manifest = manifests[name]();
        const insetIconResolver = insetImages[name];
        const extensionPath = extensionPaths[name];
        const extensionURL = useLocalDevServer && typeof extensionPath === 'string'
            ? toLocalDevServerExtensionURL(extensionPath)
            : null;
        const insetColor = manifest.insetIconColor ?? '#66757f';
        const insetIconURL = typeof insetIconResolver === 'function'
            ? (insetIconResolver() || customExtensionInsetIcon)
            : customExtensionInsetIcon;

        gallery.push({
            name: manifest.name ?? name,
            // TODO: Support translations
            nameTranslations: {},
            description: manifest.description ?? "Description goes here",
            // TODO: Support translations
            descriptionTranslations: {},
            extensionId: manifest.id ?? name,
            extensionURL,
            iconURL: images[name](),
            insetIconURL,
            insetColor,
            tags: ['usb'],
            credits: manifest.createdBy,
            featured: true
        });
    }

    const bundledById = new Map(gallery
        .map(item => [item && item.extensionId, item])
        .filter(([id]) => Boolean(id)));

    if (useLocalDevServer) {
        try {
            const localGallery = await fetchLocalDevServerLibraryCached();
            const promotedLocal = [];
            const localById = new Map(localGallery
                .map(item => [item && item.extensionId, item])
                .filter(([id]) => Boolean(id)));

            for (const localItem of localGallery) {
                const extensionId = localItem && localItem.extensionId;
                if (!extensionId) {
                    continue;
                }

                const bundledItem = bundledById.get(extensionId);

                if (!bundledItem) {
                    promotedLocal.push({
                        ...localItem,
                        // Keep Unsandboxed cards grouped only under USB + Dev.
                        tags: ['usb', 'dev'],
                        localDevStatus: LOCAL_DEV_STATUS.LOCAL_ONLY,
                        featured: true
                    });
                }
            }

            const bundledWithLocalDefaults = gallery.map(item => {
                const localItem = localById.get(item.extensionId);
                if (!localItem) {
                    return item;
                }

                const hasDiff = hasMeaningfulMetadataDiff(localItem, item);
                return {
                    ...item,
                    ...localItem,
                    // Keep bundled icon by default; fallback to recolored custom icon.
                    iconURL: item.iconURL || localItem.iconURL || customExtensionIcon || extensionIcon,
                    // Preserve bundled inset icon so local metadata doesn't flatten all badges.
                    insetIconURL: item.insetIconURL || localItem.insetIconURL || customExtensionInsetIcon,
                    insetColor: item.insetColor || localItem.insetColor,
                    // Local dev source should be the default load URL whenever available.
                    extensionURL: localItem.extensionURL || item.extensionURL,
                    // Keep Unsandboxed cards grouped only under USB + Dev.
                    tags: ['usb', 'dev'],
                    localDevStatus: LOCAL_DEV_STATUS.LOCAL_OVERRIDE,
                    localDevHasMetadataDiff: hasDiff,
                    featured: true
                };
            });

            gallery = dedupeExtensions([
                ...promotedLocal,
                ...bundledWithLocalDefaults
            ]);
        } catch (error) {
            log.warn('Local extension development server metadata fetch failed; using bundled gallery metadata.', error);
        }
    }

    return gallery.filter(extension => !blacklist.has(extension.extensionId));
}

const fetchLocalDevServerLibrary = async () => {
    const res = await fetchWithTimeout(`${LOCAL_DEV_SERVER_BASE_URL}/extensions.json`);
    if (!res.ok) {
        throw new Error(`Local extensions.json HTTP status ${res.status}`);
    }

    const extensionsMap = await res.json();
    const extensionIds = Object.keys(extensionsMap || {});

    const items = await Promise.all(extensionIds.map(async extensionId => {
        const subPath = extensionsMap[extensionId];
        if (typeof subPath !== 'string' || !subPath) {
            return null;
        }

        try {
            const metadataRes = await fetchWithTimeout(toLocalDevServerMetadataURL(subPath));
            if (metadataRes.ok) {
                const metadata = await metadataRes.json();
                const insetColor = (metadata && metadata.insetColor) || '#66757f';

                return {
                    name: (metadata && metadata.name) || extensionId,
                    nameTranslations: {},
                    description: (metadata && metadata.description) || 'Description goes here',
                    descriptionTranslations: {},
                    extensionId: (metadata && metadata.extensionId) || extensionId,
                    extensionURL: (metadata && metadata.extensionURL) || toLocalDevServerExtensionURL(subPath),
                    iconURL: (metadata && metadata.iconURL) || toLocalDevServerGeneratedThumbnailURL(subPath, insetColor),
                    insetIconURL: (metadata && metadata.insetIconURL) || customExtensionInsetIcon,
                    insetColor,
                    tags: ['usb'],
                    credits: (metadata && metadata.createdBy) || [],
                    localDevSourcePath: (metadata && metadata.subPath) || subPath,
                    featured: true
                };
            }
        } catch (error) {
            // Fallback to legacy manifest/icon probing below.
        }

        const manifestUrl = toLocalDevServerExtensionAssetURL(subPath, 'manifest.json');
        const manifestRes = await fetchWithTimeout(manifestUrl);
        if (!manifestRes.ok) {
            return null;
        }

        const manifest = await manifestRes.json();
        const insetColor = (manifest && manifest.insetIconColor) || '#66757f';
        const extensionURL = toLocalDevServerExtensionURL(subPath);

        let iconURL = null;
        const iconCandidates = [
            toLocalDevServerExtensionAssetURL(subPath, 'icon.svg'),
            toLocalDevServerExtensionAssetURL(subPath, 'icon.png')
        ];

        for (const candidate of iconCandidates) {
            try {
                const iconRes = await fetchWithTimeout(candidate);
                if (iconRes.ok) {
                    iconURL = candidate;
                    break;
                }
            } catch (error) {
                // Continue to next candidate.
            }
        }

        if (!iconURL) {
            iconURL = toLocalDevServerGeneratedThumbnailURL(subPath, insetColor);
        }

        return {
            name: (manifest && manifest.name) || extensionId,
            nameTranslations: {},
            description: (manifest && manifest.description) || 'Description goes here',
            descriptionTranslations: {},
            extensionId: (manifest && manifest.id) || extensionId,
            extensionURL,
            iconURL,
            insetIconURL: customExtensionInsetIcon,
            insetColor,
            tags: ['usb'],
            credits: (manifest && manifest.createdBy) || [],
            localDevSourcePath: subPath,
            featured: true
        };
    }));

    return items.filter(Boolean);
};

let cachedTurboWarpGallery = null;

const fetchTurboWarpLibrary = async () => {
    const res = await fetch('https://extensions.turbowarp.org/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => {
        const rawCredits = [
            ...(extension.original || []),
            ...(extension.by || [])
        ];

        return ({
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
        credits: rawCredits.map(credit => {
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
        });
    }).filter(extension => !blacklist.has(extension.extensionId));
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
        if (!this.state.unsandboxedGallery || !this.state.turbowarpGallery) {
            const timeout = setTimeout(() => {
                this.setState({
                    galleryTimedOut: true
                });
            }, 750);

            if (!this.state.unsandboxedGallery) {
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
            }

            if (!this.state.turbowarpGallery) {
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
                    .catch(err => {
                        if (!isLocalDevServerExtensionURL(url)) {
                            throw err;
                        }

                        log.warn(`Falling back to bundled extension load for ${extensionId} after local dev server failure.`);
                        return this.props.vm.extensionManager.loadExtensionURL(extensionId);
                    })
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
        const hasDevelopmentCards = Array.isArray(this.state.unsandboxedGallery) &&
            this.state.unsandboxedGallery.some(item =>
                item && Array.isArray(item.tags) && item.tags.includes('dev')
            );
        const visibleTags = hasDevelopmentCards
            ? extensionTags
            : extensionTags.filter(tag => tag.tag !== 'dev');

        let library = null;
        if ((this.state.turbowarpGallery && this.state.unsandboxedGallery) || this.state.galleryError || this.state.galleryTimedOut) {
            library = [];
            if ((this.state.turbowarpGallery && this.state.unsandboxedGallery)) {
                const locale = this.props.intl.locale;

                const baseLibraryItems = extensionLibraryContent
                    .map(toLibraryItem)
                    .filter(item => {
                        if (typeof item !== 'object' || !item.extensionId) {
                            return false;
                        }

                        if (!TEMP_MINIMAL_LIBRARY_MODE) {
                            return true;
                        }

                        return TEMP_VISIBLE_DEFAULT_EXTENSION_IDS.includes(item.extensionId);
                    });
                const baseExtensionItems = baseLibraryItems
                    .filter(item => typeof item === 'object' && item.extensionId);

                const translatedTurboWarp = this.state.turbowarpGallery
                    .filter(i => i.extensionId !== 'faceSensing')
                    .filter(i => !SUPPRESSED_TURBOWARP_EXTENSION_IDS.has(i.extensionId))
                    .map(i => translateGalleryItem(i, locale));

                const primaryOrderSet = new Set(PRIMARY_EXTENSION_ORDER);
                const promotedTurboWarp = translatedTurboWarp
                    .filter(item => primaryOrderSet.has(item.extensionId));

                const allNonTurboWarpExtensions = [
                    ...baseExtensionItems,
                    ...this.state.unsandboxedGallery,
                    ...promotedTurboWarp
                ];

                const uniqueNonTurboWarpExtensions = dedupeExtensions(allNonTurboWarpExtensions);
                const seenIds = new Set(uniqueNonTurboWarpExtensions
                    .map(item => item && item.extensionId)
                    .filter(Boolean));
                const seenNames = new Set(uniqueNonTurboWarpExtensions
                    .map(item => toSearchableText(item && item.name))
                    .filter(Boolean));

                const localDevPriority = orderById(
                    uniqueNonTurboWarpExtensions
                        .filter(item => item && item.localDevStatus === LOCAL_DEV_STATUS.LOCAL_ONLY),
                    PRIMARY_EXTENSION_ORDER
                );

                const localDevPriorityIds = new Set(localDevPriority
                    .map(item => item && item.extensionId)
                    .filter(Boolean));

                const nonPriorityExtensions = uniqueNonTurboWarpExtensions
                    .filter(item => !localDevPriorityIds.has(item.extensionId));

                const orderedExtensions = orderById(nonPriorityExtensions, PRIMARY_EXTENSION_ORDER);

                const turbowarpSection = orderById(
                    translatedTurboWarp
                        .filter(item => !seenIds.has(item.extensionId))
                        // Prevent duplicate-looking cards (e.g. Comment Blocks) from appearing twice
                        // under different sources with different IDs.
                        .filter(item => !seenNames.has(toSearchableText(item && item.name))),
                    PRIMARY_EXTENSION_ORDER
                );

                if (localDevPriority.length > 0) {
                    library.push(...localDevPriority.map(toLibraryItem));

                    if (orderedExtensions.length > 0 || turbowarpSection.length > 0 || !TEMP_MINIMAL_LIBRARY_MODE) {
                        library.push('---');
                    }
                }

                library.push(...orderedExtensions.map(toLibraryItem));

                if (turbowarpSection.length > 0 || !TEMP_MINIMAL_LIBRARY_MODE) {
                    library.push('---');

                    if (!TEMP_MINIMAL_LIBRARY_MODE) {
                        library.push(toLibraryItem(galleryMore));
                        library.push(toLibraryItem(penGroupGallery));
                    }

                    library.push(
                        ...turbowarpSection.map(toLibraryItem)
                    );
                }
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
                tags={visibleTags}
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
