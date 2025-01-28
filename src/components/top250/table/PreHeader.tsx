import { LightSelect } from '@/components/generic/LightSelect';
import { fr } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { tss } from 'tss-react';

type Props = {
	sort: string;
	setSort: Dispatch<SetStateAction<string>>;
	old?: boolean;
};

export function PreHeader(props: Props) {
	const { classes, cx } = useStyles();
	const { sort, setSort, old } = props;
	const volume_slug = old ? 'volumetrie_value' : 'volume';

	const sortOptions = [
		{
			label: 'Trier par volumétrie (décroissant)',
			value: `${volume_slug}:desc`
		},
		{
			label: 'Trier par volumétrie (croissant)',
			value: `${volume_slug}:asc`
		}
	];

	const [localSort, setLocalSort] = useState<string>(`${volume_slug}:desc`);

	useEffect(() => {
		if (localSort && setSort) setSort(localSort);
	}, [localSort]);

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.section)}>
				<LightSelect
					label="Trier la liste des démarches"
					id="tri-demarche"
					options={sortOptions}
					triggerValue={sort}
					superLight
					onChange={value => {
						setLocalSort(value as string);
					}}
				/>
			</div>
			<div className={cx(classes.section)}>
				{!old && (
					<>
						<Link
							href="/Aide/Observatoire?tab=indicators"
							className={fr.cx('fr-link')}
						>
							<i className={cx(fr.cx('ri-chat-poll-line'), classes.linkIcon)} />{' '}
							Tout comprendre sur les indicateurs
						</Link>
						<a
							href="https://www.data.gouv.fr/fr/datasets/observatoire-de-la-qualite-des-demarches-en-ligne/"
							target="_blank"
							rel="noreferrer"
							className={fr.cx('fr-link')}
						>
							<i
								className={cx(fr.cx('ri-database-2-line'), classes.linkIcon)}
							/>
							Accéder aux données ouvertes sur data.gouv.fr
						</a>
					</>
				)}
			</div>
		</div>
	);
}

const useStyles = tss.withName(PreHeader.name).create(() => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${fr.spacing('3v')} ${fr.spacing('4v')}`,
		[fr.breakpoints.down('lg')]: {
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			transform: 'translateY(-50%)'
		}
	},
	section: {
		display: 'flex',
		gap: fr.spacing('6v'),
		alignItems: 'center',
		fontWeight: 500,
		[fr.breakpoints.down('lg')]: {
			flexDirection: 'column',
			marginTop: fr.spacing('10v')
		}
	},
	linkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize
		}
	}
}));
