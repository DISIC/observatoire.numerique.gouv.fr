import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorColor, IndicatorSlug } from '@prisma/client';
import { IndicatorLabel } from './IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';
import { indicatorsDescriptions } from '@/utils/indicators';
import { remark } from 'remark';
import html from 'remark-html';
import React from 'react';

type Props = {
	slug: IndicatorSlug;
	isFull?: boolean;
};

export const ProcedureHeaderContent = (props: Props) => {
	const [description, setDescription] = React.useState<string | undefined>(
		undefined
	);
	const { slug, isFull } = props;
	const { classes, cx } = useStyles();

	const content = indicatorsDescriptions.find(i => i.slug === slug);

	const renderMarkdown = async (str: string) => {
		const result = await remark().use(html).process(str);
		return result.toString();
	};

	React.useEffect(() => {
		if (content && content.description)
			renderMarkdown(content.description).then(res => setDescription(res));
	}, [content]);

	if (!content) return <p>À venir...</p>;

	return (
		<div className={cx(classes.root)}>
			<h4>{content.title}</h4>
			{isFull && content.description && (
				<div
					className={cx(classes.description)}
					dangerouslySetInnerHTML={{ __html: description as string }}
				/>
			)}
			{isFull && content.moreInfos && (
				<div
					className={cx(
						classes.moreInfos,
						content.isMoreInfosBlue ? classes.moreInfosBlue : {}
					)}
				>
					{content.moreInfos_title && <b>{content.moreInfos_title}</b>}
					<p>{content.moreInfos}</p>
				</div>
			)}
			{content.indicators_intro && (
				<p>
					<b>{content.indicators_intro}</b>
				</p>
			)}
			<ul className={cx(classes.indicatorContainer)}>
				{content.indicators.map((indicator, index) => (
					<li key={index} className={classes.indicatorItem}>
						<span className={cx(classes.label)}>
							<IndicatorLabel
								label={indicator.label}
								color={indicator.color as IndicatorColor}
								noBackground={indicator.noBackground}
							/>
						</span>{' '}
						<span>{indicator.description}</span>
					</li>
				))}
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
