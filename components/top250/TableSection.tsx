import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { PreHeader } from './table/PreHeader';
import { ProceduresTable } from './table/ProceduresTable';
import { PreFooter } from './table/PreFooter';
import { ProceduresTableMobile } from './table/ProceduresTableMobile';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SkipLinks } from '../generic/SkipLinks';

type Props = {
	procedures?: ProcedureWithFields[];
	search?: string;
	isAdmin?: boolean;
};

export function Top250TableSection(props: Props) {
	const { procedures, isAdmin, search } = props;
	const { classes, cx } = useStyles();
	const numberPerPage = 20;

	const [displayedProcedures, setDisplayedProcedures] = useState<
		ProcedureWithFields[]
	>(procedures ? procedures.slice(0, numberPerPage) : []);
	const displayedProceduresRef = useRef(displayedProcedures);

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		const currentDisplayedProcedures = displayedProceduresRef.current;
		if (
			scrollTop + clientHeight >= scrollHeight - 1500 &&
			procedures &&
			procedures.length !== currentDisplayedProcedures.length
		) {
			setDisplayedProcedures([
				...currentDisplayedProcedures,
				...procedures.slice(
					currentDisplayedProcedures.length,
					currentDisplayedProcedures.length + numberPerPage
				)
			]);
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
				<p className={classes.noProcedure} role="status">
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
					<ProceduresTable procedures={displayedProcedures} />
				</div>
				<div className={classes.tableMobile}>
					<ProceduresTableMobile procedures={displayedProcedures} />
				</div>
				<PreFooter id="table-footer" />
			</>
		);
	}, [procedures, displayedProcedures, isAdmin, search, classes.noProcedure]);

	return <div className={cx(classes.root)}>{table}</div>;
}

const useStyles = makeStyles()(theme => ({
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
