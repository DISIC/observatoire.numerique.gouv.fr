import { IndicatorLabel } from './IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';
import React from 'react';
import { PayloadIndicator } from '@/payload/payload-types';
import { tss } from 'tss-react';
import ReactMarkdown from 'react-markdown';
import WysiwygInterpretor from '@/components/generic/WysiwygInterpretor';


type Props = {
	indicator: PayloadIndicator;
	isFull?: boolean;
};

export const IndicatorContent = (props: Props) => {
	const { indicator, isFull } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			{!isFull && indicator.description && (
				<>
					<p>
						<b>Description</b>
					</p>
					<p>{indicator.description}</p>
				</>
			)}
			{isFull && indicator.description_html && (
				<div className={cx(classes.description)}>
					<WysiwygInterpretor wysiwyg_html={indicator.description_html} />
				</div>
			)}
			<p>
				<b>Légende</b>
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
											noBackground={level.noBackground}
										/>
									</span>{' '}
									<span>{level.description}</span>
								</li>
							);
						})}
			</ul>
			{isFull && indicator.moreInfos && (
				<div className={cx(classes.moreInfos)}>
					{indicator.moreInfosTitle && <b>{indicator.moreInfosTitle}</b>}
					<ReactMarkdown>{indicator.moreInfos}</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

const useStyles = tss.withName(IndicatorContent.name).create(() => ({
	root: {
		h5: {
			fontSize: '20px'
		},
		'p, ul': {
			fontSize: '14px'
		},
	},
	description: {
		fontSize: '14px',
		marginBottom: fr.spacing('4v'),
		ul: {
			paddingLeft: fr.spacing('5v'),
		}
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
		backgroundColor: fr.colors.decisions.background.default.grey.hover,
		p: {
			marginBottom: 0,
			marginTop: fr.spacing('1v'),
			whiteSpace: 'pre-wrap'
		},
		ul: {
			marginTop: 0,
			marginLeft: fr.spacing('2v'),
		}
	},
	moreInfosBlue: {
		backgroundColor: fr.colors.decisions.background.contrast.info.default,
		b: {
			color: fr.colors.decisions.background.flat.info.default
		}
	}
}));
