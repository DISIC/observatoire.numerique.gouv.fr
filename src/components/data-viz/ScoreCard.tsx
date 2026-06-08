import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

type ScoreCardProps = {
	title: string;
	titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	percentage: number;
	delta: number | null;
	reached: number;
	total: number;
};

const ScoreCard = ({
	title,
	titleAs = 'h3',
	percentage,
	delta,
	reached,
	total
}: ScoreCardProps) => {
	const { classes, cx } = useStyles();

	const TitleTag = titleAs;

	const trend = delta === 0 ? 'stable' : delta && delta > 0 ? 'up' : 'down';

	const trendLabel =
		trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable';

	return (
		<div className={cx(fr.cx('fr-card', 'fr-card--shadow'), classes.root)}>
			<div className={classes.body}>
				<div className={classes.header}>
					<TitleTag className={fr.cx('fr-mb-0', 'fr-h6')}>{title}</TitleTag>
					{delta !== null && (
						<p className={cx(fr.cx('fr-text--xs', 'fr-mb-0'), classes.trend)}>
							{trendLabel}
							{trend !== 'stable' && (
								<span
									className={fr.cx(
										'fr-badge',
										'fr-badge--sm',
										'fr-badge--no-icon',
										'fr-ml-1v',
										trend === 'up' ? 'fr-badge--success' : 'fr-badge--error'
									)}
								>
									<span aria-hidden="true">
										{trend === 'up' ? '↗ ' : '↘ '}
									</span>
									{Math.abs(delta)} pts
								</span>
							)}
						</p>
					)}
				</div>
				<p className={cx(fr.cx('fr-display--xs', 'fr-mb-0'), classes.figure)}>
					{percentage}%
				</p>
				<p className={fr.cx('fr-text--xs', 'fr-mb-0')}>
					{reached}/{total} = {percentage}%
				</p>
			</div>
		</div>
	);
};

const useStyles = tss.withName(ScoreCard.name).create(() => ({
	root: {
		height: '100%'
	},
	body: {
		padding: fr.spacing('4v'),
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('2v')
	},
	header: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('1v')
	},
	trend: {
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'flex-end',
		gap: fr.spacing('1v'),
		textAlign: 'right',
		whiteSpace: 'nowrap'
	},
	figure: {
		textAlign: 'center',
		color: fr.colors.decisions.text.title.grey.default
	}
}));

export default ScoreCard;
