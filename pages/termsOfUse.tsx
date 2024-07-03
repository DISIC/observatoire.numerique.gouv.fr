import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { TermsOfUse as TOU } from '../utils/content';

const TermsOfUse = () => {
	const { cx, classes } = useStyles();

	return (
		<>
			<Head>
				<title>
					Modalités d’utilisation de Vos Démarches Essentielles | Vos démarches
					essentielles
				</title>
				<meta
					name="description"
					content={`Modalités d’utilisation de Vos Démarches Essentielles | Vos démarches essentielles`}
				/>
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-py-20v'
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
						<h1 className={fr.cx('fr-mb-12v')}>
							Modalités d’utilisation de Vos Démarches Essentielles
						</h1>
						{Object.keys(TOU).map(key => (
							<div key={key} className={cx(classes.blockWrapper)}>
								<h2>{TOU[key].title}</h2>
								<div className={'fr-col-lg-10'}>
									{TOU[key].content.map((line, index) => {
										const isLink =
											typeof line === 'object' && line.type === 'link';
										const isList =
											typeof line === 'object' && line.type === 'list';
										const isSubtitle =
											typeof line === 'object' && line.type === 'subtitle';
										const hasNoSpaces =
											typeof line === 'object' && line.type === 'noSpaces';
										const isBold =
											typeof line === 'object' && line.type === 'bold';

										return (
											<React.Fragment key={index}>
												{isSubtitle ? (
													<h3 className={classes.subtitle}>{line.text}</h3>
												) : isLink ? (
													<>
														<p>
															<a
																href={line.href}
																target="_blank"
																rel="noopener noreferrer"
															>
																{line.text}
															</a>
														</p>
													</>
												) : isBold ? (
													<>
														<p
															dangerouslySetInnerHTML={{ __html: line.text }}
														/>
													</>
												) : isList ? (
													<ul>
														<li
															dangerouslySetInnerHTML={{ __html: line.text }}
														></li>
													</ul>
												) : typeof line === 'string' ? (
													<>
														<p
															className={cx(
																hasNoSpaces ? classes.noSpacesParagraph : ''
															)}
														>
															{line}
														</p>
													</>
												) : (
													<>
														<p
															className={cx(
																hasNoSpaces ? classes.noSpacesParagraph : ''
															)}
														>
															{line.text}
														</p>
													</>
												)}
											</React.Fragment>
										);
									})}
								</div>
							</div>
						))}
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
		marginBottom: '1rem',

		a: {
			width: 'fit-content'
		},
		ul: {
			marginLeft: '2rem '
		}
	},
	subtitle: {
		...fr.typography[3].style
	},
	noSpacesParagraph: {
		marginBottom: '0 !important'
	}
}));

export default TermsOfUse;
