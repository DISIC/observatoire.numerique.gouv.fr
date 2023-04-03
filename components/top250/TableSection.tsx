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
	const numberPerPage = 20;

	const [displayedProcedures, setDisplayedProcedures] = useState<
		ProcedureWithFields[]
	>(procedures ? procedures.slice(0, numberPerPage) : []);
	const displayedProceduresRef = useRef(displayedProcedures);

	useEffect(() => {
		displayedProceduresRef.current = displayedProcedures;
	}, [displayedProcedures]);

	useEffect(() => {
		if (procedures && procedures.length) {
			setDisplayedProcedures(procedures.slice(0, numberPerPage));
		}
	}, [procedures]);

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
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const table = useMemo(() => {
		if (!procedures || procedures.length === 0) {
			return (
				<div className={classes.noProcedure}>
					{search
						? 'Aucune démarche trouvée pour cette recherche...'
						: 'Aucune démarche pour cette édition...'}
				</div>
			);
		}

		console.log('RERENDER');

		return (
			<>
				{window.innerWidth > 62 * 16 ? (
					<ProceduresTable procedures={displayedProcedures} />
				) : (
					<ProceduresTableMobile procedures={displayedProcedures} />
				)}
				<PreFooter />
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
	}
}));
