import { LightSelect } from '@/components/generic/LightSelect';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
					<Link
						href="/Aide/Observatoire?tab=indicators"
						className={fr.cx('fr-link')}
					>
						Tout comprendre sur les indicateurs{' '}
						<i className={cx(fr.cx('ri-chat-poll-line'), classes.linkIcon)} />
					</Link>
				)}
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
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
		alignItems: 'center',
		fontWeight: 500,
		[fr.breakpoints.down('lg')]: {
			['&:first-of-type']: {
				marginBottom: fr.spacing('8v')
			}
		}
	},
	linkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize
		}
	}
}));
