import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorLabel } from './IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';
import React from 'react';
import { PayloadProcedureHeader } from '@/payload/payload-types';

type Props = {
	indicator: PayloadProcedureHeader;
	isFull?: boolean;
};

export const ProcedureHeaderContent = (props: Props) => {
	const { indicator, isFull } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			{!isFull && indicator.description && (
				<>
					<p><b>Description</b></p>
					<p>{indicator.description}</p>
				</>
			)}
			{isFull && indicator.description_html && (
				<div
					className={cx(classes.description)}
					dangerouslySetInnerHTML={{ __html: indicator.description_html }}
				/>
			)}
			{isFull && indicator.moreInfos && (
				<div className={cx(classes.moreInfos)}>
					{indicator.moreInfosTitle && <b>{indicator.moreInfosTitle}</b>}
					<p>{indicator.moreInfos}</p>
				</div>
			)}
			<p>
				<b>{indicator.levels?.docs?.length} niveaux d'évaluation</b>
			</p>
			<ul className={cx(classes.indicatorContainer)}>
				{indicator.levels?.docs &&
					indicator.levels.docs
						.sort((a, b) =>
							typeof a === 'string' || typeof b === 'string'
								? 0
								: a.position - b.position
						)
						.map((level, index) => {
							if (typeof level === 'string') return;
							return (
								<li key={index} className={classes.indicatorItem}>
									<span className={cx(classes.label)}>
										<IndicatorLabel
											label={level.label}
											color={level.color}
											noBackground={level.noBackround}
										/>
									</span>{' '}
									<span>{level.description}</span>
								</li>
							);
						})}
			</ul>
		</div>
	);
};

const useStyles = makeStyles()(theme => ({
	root: {
		h5: {
			fontSize: '20px'
		},
		p: {
			fontSize: '14px'
		}
	},
	description: {
		fontSize: '14px',
		marginBottom: fr.spacing('4v')
	},
	label: {
		marginRight: fr.spacing('2v')
	},
	indicatorContainer: {
		paddingLeft: 0
	},
	indicatorItem: {
		marginBottom: `${fr.spacing('4v')} !important`,
		display: 'flex',
		flexDirection: 'column',
		...fr.typography[18].style,
		['& > span:first-of-type']: {
			flexShrink: 0,
			marginBottom: fr.spacing('2v')
		}
	},
	moreInfos: {
		padding: fr.spacing('2v'),
		marginBottom: fr.spacing('6v'),
		backgroundColor: theme.decisions.background.default.grey.hover,
		p: {
			marginBottom: 0,
			marginTop: fr.spacing('1v')
		}
	},
	moreInfosBlue: {
		backgroundColor: theme.decisions.background.contrast.info.default,
		b: {
			color: theme.decisions.background.flat.info.default
		}
	}
}));
