/**
 * Reprise des données MongoDB → PostgreSQL (Prisma + Payload).
 *
 *   MONGO_SOURCE_URI=... POSTGRESQL_ADDON_URI=... \
 *     yarn migrate:mongo-to-postgres [--dry-run] [--reset] [--allow-dangling]
 *
 * Les ids Prisma sont conservés (présents dans les URL). Les documents Payload reçoivent
 * de nouveaux ids et les relations sont remappées, texte riche Lexical compris.
 */
import 'dotenv/config';
import 'ignore-styles';
import { Prisma, PrismaClient } from '@prisma/client';
import { MongoClient, ObjectId, type Db } from 'mongodb';
import type { Field, Payload } from 'payload';
import getPayloadClient from '@/payload/payload-client';

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const RESET = argv.includes('--reset');
const ALLOW_DANGLING = argv.includes('--allow-dangling');

const MONGO_SOURCE_URI = process.env.MONGO_SOURCE_URI;
const PRISMA_DB = process.env.MONGO_SOURCE_PRISMA_DB ?? 'observatoire';
const PAYLOAD_DB =
	process.env.MONGO_SOURCE_PAYLOAD_DB ?? 'observatoire-payload';

const BATCH_SIZE = 1000;

// Ordre imposé par les clés étrangères
const PRISMA_MODELS = [
	'Edition',
	'OldProcedure',
	'Procedure',
	'Field'
] as const;
// Ordre imposé par les relations : un document n'est créé qu'après ceux qu'il référence
const PAYLOAD_COLLECTIONS = [
	'payload-media',
	'payload-versions',
	'payload-admins',
	'payload-indicators',
	'payload-indicator-levels'
] as const;
// Champs jamais copiés : identifiants recalculés, sessions (reconnexion demandée)
const SKIPPED_FIELDS = new Set(['id', '_id', '__v', 'sessions']);

const problems: string[] = [];
const report = (msg: string) => {
	problems.push(msg);
	console.warn(`  ⚠ ${msg}`);
};

const toPlain = (value: unknown): unknown => {
	if (value instanceof ObjectId) return value.toHexString();
	if (Array.isArray(value)) return value.map(toPlain);
	if (value && typeof value === 'object' && !(value instanceof Date)) {
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, toPlain(v)])
		);
	}
	return value;
};

const prismaDelegate = (prisma: PrismaClient, model: string) =>
	(prisma as any)[model.charAt(0).toLowerCase() + model.slice(1)];

const convertPrismaDoc = (
	model: Prisma.DMMF.Model,
	doc: Record<string, unknown>,
	enums: Map<string, Set<string>>
): Record<string, unknown> | null => {
	const ref = `${model.name} ${toPlain(doc._id)}`;
	const data: Record<string, unknown> = {};
	let valid = true;

	for (const field of model.fields) {
		if (field.kind === 'object') continue;
		let value = toPlain(field.name === 'id' ? doc._id : doc[field.name]);

		if (value === undefined || value === null) {
			if (field.isList) value = [];
			else if (field.hasDefaultValue) continue;
			else if (field.isRequired) {
				report(
					`${ref} : champ obligatoire « ${field.name} » vide, document ignoré`
				);
				valid = false;
				continue;
			} else {
				data[field.name] = null;
				continue;
			}
		}

		if (field.kind === 'enum') {
			const allowed = enums.get(field.type)!;
			if (!allowed.has(value as string)) {
				report(
					`${ref} : « ${field.name} » = ${value} hors enum ${field.type}, document ignoré`
				);
				valid = false;
				continue;
			}
		} else if (field.type === 'Int' && !field.isList) {
			if (typeof value !== 'number' || !Number.isInteger(value)) {
				report(
					`${ref} : « ${field.name} » = ${value} n'est pas un entier, document ignoré`
				);
				valid = false;
				continue;
			}
		} else if (field.type === 'DateTime' && !(value instanceof Date)) {
			const date = new Date(value as string);
			if (Number.isNaN(date.getTime())) {
				report(
					`${ref} : « ${field.name} » = ${value} n'est pas une date, document ignoré`
				);
				valid = false;
				continue;
			}
			value = date;
		}
		data[field.name] = value;
	}

	return valid ? data : null;
};

const migratePrisma = async (prisma: PrismaClient, mongo: Db) => {
	console.log('\n== Prisma');
	const { models, enums: dmmfEnums } = Prisma.dmmf.datamodel;
	const enums = new Map(
		dmmfEnums.map(e => [e.name, new Set(e.values.map(v => v.name))])
	);
	const migratedIds = new Map<string, Set<string>>();

	if (RESET && !DRY_RUN) {
		for (const name of [...PRISMA_MODELS].reverse()) {
			await prismaDelegate(prisma, name).deleteMany();
		}
	}

	for (const name of PRISMA_MODELS) {
		const model = models.find(m => m.name === name)!;
		const delegate = prismaDelegate(prisma, name);

		if (!DRY_RUN && (await delegate.count()) > 0) {
			throw new Error(
				`${name} n'est pas vide côté PostgreSQL (relancer avec --reset)`
			);
		}

		// Par lots pour borner la mémoire
		const ids = new Set<string>();
		let total = 0;
		let rows: Record<string, unknown>[] = [];
		const flush = async () => {
			if (!DRY_RUN && rows.length) await delegate.createMany({ data: rows });
			rows = [];
		};
		const relation = model.fields.find(
			f => f.kind === 'object' && f.relationFromFields?.length
		);

		for await (const doc of mongo
			.collection(name)
			.find({})
			.batchSize(BATCH_SIZE)) {
			total++;
			const row = convertPrismaDoc(model, doc, enums);
			if (!row) continue;

			if (relation) {
				const fk = relation.relationFromFields![0];
				const target = migratedIds.get(relation.type)!;
				if (
					row[fk] !== null &&
					row[fk] !== undefined &&
					!target.has(row[fk] as string)
				) {
					if (relation.isRequired) {
						report(
							`${name} ${row.id} : ${fk} = ${row[fk]} introuvable dans ${relation.type}, document ignoré`
						);
						continue;
					}
					report(
						`${name} ${row.id} : ${fk} = ${row[fk]} introuvable dans ${relation.type}, relation retirée`
					);
					row[fk] = null;
				}
			}
			rows.push(row);
			ids.add(row.id as string);
			if (rows.length >= BATCH_SIZE) await flush();
		}
		await flush();

		migratedIds.set(name, ids);
		console.log(`  ${name} : ${ids.size}/${total} documents`);
	}
};

type IdMaps = Map<string, Map<string, string | number>>;

class Remapper {
	constructor(private ids: IdMaps, private context: string) {}

	ref(relationTo: string, value: unknown): string | number | undefined {
		if (value === null || value === undefined) return undefined;
		const oldId = toPlain(
			typeof value === 'object' && !(value instanceof ObjectId)
				? (value as any).id ?? (value as any)._id
				: value
		) as string;
		const newId = this.ids.get(relationTo)?.get(String(oldId));
		if (newId === undefined) {
			report(
				`${this.context} : relation vers ${relationTo} ${oldId} introuvable, retirée`
			);
		}
		return newId;
	}

	relation(
		field: { relationTo: string | string[]; hasMany?: boolean },
		value: unknown
	) {
		const one = (v: unknown) => {
			if (Array.isArray(field.relationTo)) {
				const { relationTo, value: inner } = v as {
					relationTo: string;
					value: unknown;
				};
				const id = this.ref(relationTo, inner);
				return id === undefined ? undefined : { relationTo, value: id };
			}
			return this.ref(field.relationTo, v);
		};
		if (field.hasMany) {
			return ((value as unknown[]) ?? []).map(one).filter(v => v !== undefined);
		}
		return one(value) ?? null;
	}

	lexical(node: any): any {
		if (!node || typeof node !== 'object') return node;
		if (Array.isArray(node)) return node.map(n => this.lexical(n));

		const out: any = { ...node };
		if (
			(node.type === 'upload' || node.type === 'relationship') &&
			node.relationTo
		) {
			out.value = this.ref(node.relationTo, node.value) ?? null;
		}
		if (node.type === 'link' && node.fields?.doc?.relationTo) {
			out.fields = {
				...node.fields,
				doc: {
					...node.fields.doc,
					value:
						this.ref(node.fields.doc.relationTo, node.fields.doc.value) ?? null
				}
			};
		}
		if (node.children) out.children = this.lexical(node.children);
		if (node.root) out.root = this.lexical(node.root);
		return out;
	}

	fields(fields: Field[], src: Record<string, any>): Record<string, unknown> {
		const out: Record<string, unknown> = {};
		for (const field of fields) {
			switch (field.type) {
				case 'tabs':
					for (const tab of field.tabs) {
						if ('name' in tab && tab.name) {
							if (src[tab.name] !== undefined) {
								out[tab.name] = this.fields(tab.fields, src[tab.name] ?? {});
							}
						} else {
							Object.assign(out, this.fields(tab.fields, src));
						}
					}
					break;
				case 'row':
				case 'collapsible':
					Object.assign(out, this.fields(field.fields, src));
					break;
				case 'ui':
				case 'join':
					break;
				default: {
					if (!('name' in field) || SKIPPED_FIELDS.has(field.name)) break;
					const value = src[field.name];
					if (value === undefined) break;
					out[field.name] = this.value(field, value);
				}
			}
		}
		return out;
	}

	value(field: Field, value: any): unknown {
		if (value === null) return null;
		switch (field.type) {
			case 'group':
				return this.fields(field.fields, value);
			case 'array':
				return (value as any[]).map(row => ({
					...this.fields(field.fields, row),
					id: toPlain(row.id ?? row._id)
				}));
			case 'blocks':
				return (value as any[]).map(row => {
					const block = field.blocks.find(b => b.slug === row.blockType);
					if (!block)
						throw new Error(`${this.context} : bloc inconnu ${row.blockType}`);
					return {
						...this.fields(block.fields, row),
						id: toPlain(row.id ?? row._id),
						blockType: row.blockType,
						blockName: row.blockName
					};
				});
			case 'relationship':
			case 'upload':
				return this.relation(field as any, value);
			case 'richText':
				return this.lexical(toPlain(value));
			default:
				return toPlain(value);
		}
	}
}

// Nom de la collection Mongo : mongoose met le slug au pluriel (payload-media → payload-medias)
const mongoCollectionName = async (mongo: Db, slug: string) => {
	const names = new Set(
		(await mongo.listCollections().toArray()).map(c => c.name)
	);
	if (names.has(slug)) return slug;
	if (names.has(`${slug}s`)) return `${slug}s`;
	return null;
};

const migratePayload = async (payload: Payload, mongo: Db) => {
	console.log('\n== Payload');
	const ids: IdMaps = new Map();
	let fakeId = 0;

	if (RESET && !DRY_RUN) {
		for (const slug of [...PAYLOAD_COLLECTIONS].reverse()) {
			await payload.db.deleteMany({ collection: slug, where: {} });
		}
	}

	for (const slug of PAYLOAD_COLLECTIONS) {
		const config = payload.collections[slug].config;
		const source = await mongoCollectionName(mongo, slug);
		const docs = source
			? await mongo.collection(source).find({}).toArray()
			: [];
		const map = new Map<string, string | number>();
		ids.set(slug, map);

		if (!DRY_RUN) {
			const { totalDocs } = await payload.db.count({
				collection: slug,
				where: {}
			});
			if (totalDocs > 0) {
				throw new Error(
					`${slug} n'est pas vide côté PostgreSQL (relancer avec --reset)`
				);
			}
		}

		for (const doc of docs) {
			const oldId = (doc._id as ObjectId).toHexString();
			const data = new Remapper(ids, `${slug} ${oldId}`).fields(
				config.fields,
				doc
			);
			if (DRY_RUN) {
				map.set(oldId, ++fakeId);
				continue;
			}
			const created = await payload.db.create({ collection: slug, data });
			map.set(oldId, created.id);
		}
		console.log(
			`  ${slug} : ${map.size}/${docs.length} documents (source : ${
				source ?? 'absente'
			})`
		);
	}

	const globals = await mongo.collection('globals').find({}).toArray();
	for (const doc of globals) {
		const global = payload.globals.config.find(g => g.slug === doc.globalType);
		if (!global) {
			report(`global ${doc.globalType} absent de la configuration, ignoré`);
			continue;
		}
		const data = new Remapper(ids, `global ${global.slug}`).fields(
			global.fields,
			doc
		);
		if (!DRY_RUN) {
			if (RESET) {
				await payload.db
					.updateGlobal({ slug: global.slug, data })
					.catch(() => null);
			}
			const existing = await payload.db.findGlobal({
				slug: global.slug,
				where: {}
			});
			if (existing && Object.keys(existing).length > 2) {
				await payload.db.updateGlobal({ slug: global.slug, data });
			} else {
				await payload.db.createGlobal({ slug: global.slug, data });
			}
		}
		console.log(`  global ${global.slug} : migré`);
	}
};

const verify = async (
	prisma: PrismaClient,
	payload: Payload,
	mongoPrisma: Db,
	mongoPayload: Db
) => {
	console.log('\n== Contrôle (MongoDB → PostgreSQL)');
	for (const name of PRISMA_MODELS) {
		const before = await mongoPrisma.collection(name).countDocuments();
		const after = await prismaDelegate(prisma, name).count();
		console.log(
			`  ${name.padEnd(26)} ${String(before).padStart(6)} → ${after}`
		);
	}
	for (const slug of PAYLOAD_COLLECTIONS) {
		const source = await mongoCollectionName(mongoPayload, slug);
		const before = source
			? await mongoPayload.collection(source).countDocuments()
			: 0;
		const { totalDocs } = await payload.find({
			collection: slug,
			depth: 2,
			limit: 0,
			pagination: false
		});
		console.log(
			`  ${slug.padEnd(26)} ${String(before).padStart(6)} → ${totalDocs}`
		);
	}
	for (const global of payload.globals.config) {
		await payload.findGlobal({ slug: global.slug as any, depth: 2 });
	}
	console.log('  globals : lecture OK (depth 2)');
};

const main = async () => {
	if (!MONGO_SOURCE_URI) throw new Error('MONGO_SOURCE_URI manquant');
	console.log(
		`Migration MongoDB → PostgreSQL${
			DRY_RUN ? ' (dry-run : aucune écriture)' : ''
		}`
	);

	const mongo = new MongoClient(MONGO_SOURCE_URI, {
		readPreference: 'secondaryPreferred'
	});
	await mongo.connect();
	const prisma = new PrismaClient();
	const payload = await getPayloadClient({ seed: true });

	try {
		await migratePrisma(prisma, mongo.db(PRISMA_DB));
		await migratePayload(payload, mongo.db(PAYLOAD_DB));
		if (!DRY_RUN)
			await verify(prisma, payload, mongo.db(PRISMA_DB), mongo.db(PAYLOAD_DB));
	} finally {
		await prisma.$disconnect();
		await mongo.close();
	}

	console.log(`\n${problems.length} anomalie(s) signalée(s).`);
	const dangling = problems.filter(
		p => p.includes('introuvable, retirée') && p.includes('relation vers')
	);
	if (dangling.length && !ALLOW_DANGLING) {
		throw new Error(
			`${dangling.length} relation(s) Payload pendante(s) : relancer avec --allow-dangling pour les ignorer`
		);
	}
};

main()
	.then(() => process.exit(0))
	.catch(e => {
		console.error(e);
		process.exit(1);
	});
