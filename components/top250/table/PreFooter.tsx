import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {};

export function PreFooter(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.section)}>
				<a
					href="https://www.data.gouv.fr/fr/datasets/observatoire-de-la-qualite-des-demarches-en-ligne/"
					target="_blank"
					rel="noreferrer"
					className={fr.cx('fr-link')}
				>
					<i className={cx(fr.cx('ri-database-2-line'), classes.linkIcon)} />
					Accéder aux données ouvertes sur data.gouv.fr
				</a>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {},
	section: {
		textAlign: 'right',
		a: {
			fontSize: fr.typography[18].style.fontSize,
			backgroundImage: 'none',
			['&::after']: {
				'--icon-size': '0 !important',
				margin: 0
			}
		}
	},
	linkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize,
			marginRight: fr.spacing('2v')
		}
	}
}));
