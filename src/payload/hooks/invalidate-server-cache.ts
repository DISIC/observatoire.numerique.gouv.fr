import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	GlobalAfterChangeHook
} from 'payload';
import { invalidateServerCache } from '../../utils/server-cache';

const afterCollectionChange: CollectionAfterChangeHook = ({ doc }) => {
	invalidateServerCache();
	return doc;
};

const afterCollectionDelete: CollectionAfterDeleteHook = ({ doc }) => {
	invalidateServerCache();
	return doc;
};

const afterGlobalChange: GlobalAfterChangeHook = ({ doc }) => {
	invalidateServerCache();
	return doc;
};

// Fonctions : chaque collection reçoit ses propres tableaux
export const collectionCacheInvalidationHooks = () => ({
	afterChange: [afterCollectionChange],
	afterDelete: [afterCollectionDelete]
});

export const globalCacheInvalidationHooks = () => ({
	afterChange: [afterGlobalChange]
});
