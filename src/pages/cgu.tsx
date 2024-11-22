import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { CGU } from '../utils/content';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

const GeneralConditions = () => {
	const { cx, classes } = useStyles();

	return (
		<>
			<Head>
				<title>Politique de confidentialité | Vos démarches essentielles</title>
				<meta
					name="description"
					content={`Politique de confidentialité | Vos démarches essentielles`}
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
							Politique de confidentialité de Vos Démarches Essentielles
						</h1>
						{Object.keys(CGU).map(key => (
							<div key={key} className={cx(classes.blockWrapper)}>
								<h2>{CGU[key].title}</h2>
								<div className={'fr-col-lg-10'}>
									{CGU[key].content.map((line, index) => {
										const isLink =
											typeof line === 'object' && line.type === 'link';
										const isMailto =
											typeof line === 'object' && line.type === 'mailto';
										const isList =
											typeof line === 'object' && line.type === 'list';
										const hasNoSpaces =
											typeof line === 'object' && line.type === 'noSpaces';
										const isBold =
											typeof line === 'object' && line.type === 'bold';

										return (
											<React.Fragment key={index}>
												{isLink ? (
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
												) : isMailto ? (
													<p>
														<a href={line.href}>{line.text}</a>
													</p>
												) : isBold ? (
													<>
														<p
															dangerouslySetInnerHTML={{ __html: line.text }}
														/>
													</>
												) : isList ? (
													<ul>
														<li>{line.text}</li>
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
			margin: '2rem 0 2rem 2rem'
		}
	},
	noSpacesParagraph: {
		marginBottom: '0 !important'
	}
}));

export default GeneralConditions;
