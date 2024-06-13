import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { LegalNotice as LN } from '../utils/content';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

const LegalNotice = () => {
	const { cx, classes } = useStyles();

	return (
		<>
			<Head>
				<title>Mentions légales | Je donne mon avis</title>
				<meta
					name="description"
					content={`Mentions légales | Je donne mon avis`}
				/>
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-pt-20v'
				)}
			>
				<div
					className={fr.cx(
						'fr-grid-row',
						'fr-grid-row--gutters',
						'fr-grid-row--middle'
					)}
				>
					<div className={'fr-col-lg-12'}>
						<h1 className={fr.cx('fr-mb-12v')}>{LN.title}</h1>
						{Object.keys(LN.sections).map(sectionKey => {
							const section = LN.sections[sectionKey];
							return (
								<div key={sectionKey}>
									<h2>{sectionKey}</h2>
									{section.title && <p>{section.title}</p>}
									<div className={cx(classes.blockWrapper)}>
										{Array.isArray(section.content[0])
											? (section.content as string[][]).map(
													(subContent, index) => (
														<div
															key={index}
															className={cx(classes.blockWrapper)}
														>
															{subContent.map((block, subIndex) => (
																<p key={subIndex}>{block}</p>
															))}
														</div>
													)
											  )
											: (section.content as string[]).map((block, index) => (
													<p key={index}>{block}</p>
											  ))}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	blockWrapper: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '2rem',
		p: {
			marginBottom: '0 !important'
		}
	}
}));

export default LegalNotice;
