import Card from '@codegouvfr/react-dsfr/Card';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEditions } from '@/utils/api';

type Props = {
	error?: string;
};

export default function Editions(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	const { data: editions, isError, isLoading } = useEditions();
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading) return <div>...</div>;
	if (!editions) return <div>Aucune édition</div>;

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
				<h2>Mes éditions</h2>
				<p>Retrouvez sur cette page la liste des éditions publiées.</p>
			</div>
			<div className={cx(fr.cx('fr-container'))}>
				<div className={classes.editionsContainer}>
					{editions.map((edition, index) => (
						<div>
							<Card
								desc={`Du : ${new Date(edition.start_date).toLocaleDateString(
									'fr'
								)} au ${new Date(edition.end_date).toLocaleDateString('fr')}`}
								enlargeLink
								detail={
									<ul className="fr-badges-group">
										{index === 0 ? (
											<Badge severity="new">
												Crée le{' '}
												{new Date(edition.created_at).toLocaleDateString('fr')}
											</Badge>
										) : (
											<Badge>
												Crée le{' '}
												{new Date(edition.created_at).toLocaleDateString('fr')}
											</Badge>
										)}
									</ul>
								}
								linkProps={{
									href: `/administration/bo/editions/${edition.id}`
								}}
								title={edition.name}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingTop: fr.spacing('10v'),
		paddingBottom: fr.spacing('10v')
	},
	editionsContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		['& > div']: {
			width: '25%',
			padding: fr.spacing('2v')
		}
	}
}));
