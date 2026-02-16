import { fr } from '@codegouvfr/react-dsfr';
import { ProcedureHeaderSort, ProceduresTable } from './table/ProceduresTable';
import { ProceduresTableMobile } from './table/ProceduresTableMobile';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SkipLinks } from '../generic/SkipLinks';
import { push } from '@socialgouv/matomo-next';
import { Edition } from '@prisma/client';
import { sortProcedures } from '@/utils/tools';
import { tss } from 'tss-react';

type Props = {
	procedures?: ProcedureWithFields[];
	edition?: Edition;
	search?: string;
	isAdmin?: boolean;
};

export function Top250TableSection(props: Props) {
	const { procedures, edition, isAdmin, search } = props;
	const { classes, cx } = useStyles();
	const numberPerPage = isAdmin ? 300 : 20;

	const [currentSortObject, setCurrentSortObject] =
		useState<ProcedureHeaderSort | null>(null);
	const currentSortObjectRef = useRef<ProcedureHeaderSort | null>(null);

	const [displayedProcedures, setDisplayedProcedures] = useState<
		ProcedureWithFields[]
	>(procedures ? procedures.slice(0, numberPerPage) : []);
	const displayedProceduresRef = useRef(displayedProcedures);

	const onSortApply = (sortObject: ProcedureHeaderSort | null) => {
		setCurrentSortObject(sortObject);
		const sortedProcedures = sortProcedures(procedures || [], sortObject).slice(
			0,
			numberPerPage
		);
		setDisplayedProcedures([...sortedProcedures]);
	};

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		const currentDisplayedProcedures = displayedProceduresRef.current;
		if (
			scrollTop + clientHeight >= scrollHeight - 1500 &&
			scrollTop + clientHeight <= scrollHeight - 500 &&
			procedures &&
			procedures.length !== currentDisplayedProcedures.length
		) {
			setDisplayedProcedures([
				...currentDisplayedProcedures,
				...sortProcedures(procedures, currentSortObjectRef.current).slice(
					currentDisplayedProcedures.length,
					currentDisplayedProcedures.length + numberPerPage
				)
			]);
			push(['trackEvent', 'top250', 'loadMore']);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			window.addEventListener('scroll', handleScroll);
		}, 200);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		displayedProceduresRef.current = displayedProcedures;
	}, [displayedProcedures]);

	useEffect(() => {
		currentSortObjectRef.current = currentSortObject;
	}, [currentSortObject]);

	useEffect(() => {
		if (procedures && procedures.length) {
			setDisplayedProcedures(procedures.slice(0, numberPerPage));
		}
	}, [procedures]);

	useEffect(() => {
		setTimeout(() => {
			window.addEventListener('scroll', handleScroll);
		}, 200);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const table = useMemo(() => {
		if (!procedures || procedures.length === 0) {
			return (
				<p className={classes.noProcedure}>
					{search
						? 'Aucune démarche trouvée pour cette recherche...'
						: 'Aucune démarche pour cette édition...'}
				</p>
			);
		}
		return (
			<>
				<SkipLinks
					links={[{ text: 'Aller au pied du tableau', href: '#table-footer' }]}
				/>
				<div className={classes.tableDesktop}>
					<ProceduresTable
						edition={edition}
						procedures={displayedProcedures}
						onSortApply={onSortApply}
					/>
				</div>
				<div className={classes.tableMobile}>
					<ProceduresTableMobile
						edition={edition}
						procedures={displayedProcedures}
					/>
				</div>
				<div id="table-footer" />
			</>
		);
	}, [procedures, displayedProcedures, isAdmin, search, classes.noProcedure]);

	return <div className={cx(classes.root)}>{table}</div>;
}

const useStyles = tss.withName(Top250TableSection.name).create(() => ({
	root: {
		paddingBottom: fr.spacing('12v'),
		width: '100%'
	},
	noProcedure: {
		padding: fr.spacing('30v'),
		textAlign: 'center',
		fontWeight: 'bold'
	},
	tableDesktop: {
		display: 'block',
		[fr.breakpoints.down('lg')]: {
			display: 'none'
		}
	},
	tableMobile: {
		display: 'none',
		[fr.breakpoints.down('lg')]: {
			display: 'block'
		}
	}
}));
