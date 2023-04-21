import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { PreHeader } from './table/PreHeader';
import { ProceduresTable } from './table/ProceduresTable';
import { PreFooter } from './table/PreFooter';
import { ProceduresTableMobile } from './table/ProceduresTableMobile';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
	procedures?: ProcedureWithFields[];
	search?: string;
	isAdmin?: boolean;
};

export function Top250TableSection(props: Props) {
	const { procedures, isAdmin, search } = props;
	const { classes, cx } = useStyles();
	const numberPerPage = isAdmin ? 50 : 100;

	const [displayedProcedures, setDisplayedProcedures] = useState<
		ProcedureWithFields[]
	>(procedures ? procedures.slice(0, numberPerPage) : []);

	const loadAllProcedures = (loadMore: boolean) => {
		if (!procedures) return;

		if (loadMore) {
			const futureLength = displayedProcedures.length + numberPerPage;
			setDisplayedProcedures([
				...displayedProcedures,
				...procedures.slice(displayedProcedures.length, futureLength)
			]);
		} else {
			setDisplayedProcedures([...procedures.slice(0, numberPerPage)]);
		}
	};

	useEffect(() => {
		if (
			!!displayedProcedures.length &&
			!!procedures &&
			displayedProcedures.length < procedures.length
		)
			setTimeout(() => {
				loadAllProcedures(true);
			}, 100);
	}, [displayedProcedures]);

	useEffect(() => {
		if (procedures && procedures.length) {
			loadAllProcedures(false);
		}
	}, [procedures]);

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
				<ul className={classes.skipLinkList}>
					<li>
						<a className={classes.skipLink} href="#table-footer">
							Aller au pied de page
						</a>
					</li>
				</ul>
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
	},
	skipLinkList: {
		display: 'flex',
		flexDirection: 'row',
		listStyle: 'none'
	},
	skipLink: {
		position: 'absolute',
		left: -9999,
		['&:focus']: {
			position: 'static'
		}
	}
}));
