import { LightSelect } from '@/components/generic/LightSelect';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
	onSort: (value: string | number) => void;
};

const sortOptions = [
	{
		label: 'Trier par volumétrie (décroissant)',
		value: 'volume:desc'
	},
	{
		label: 'Trier par volumétrie (croissant)',
		value: 'volume:asc'
	}
];

export function PreHeader(props: Props) {
	const { classes, cx } = useStyles();
	const { onSort } = props;

	const [localSort, setLocalSort] = useState<string>('volume:desc');

	useEffect(() => {
		if (localSort && onSort) onSort(localSort);
	}, [localSort]);

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.section)}>
				<LightSelect
					label="Trier la liste des démarches"
					id="tri-demarche"
					options={sortOptions}
					superLight
					onChange={value => {
						setLocalSort(value as string);
					}}
				/>
			</div>
			<div className={cx(classes.section)}>
				<Link
					href="/Aide/Observatoire?tab=indicators"
					className={fr.cx('fr-link')}
				>
					Tout comprendre sur les indicateurs{' '}
					<i className={cx(fr.cx('ri-chat-poll-line'), classes.linkIcon)} />
				</Link>
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
