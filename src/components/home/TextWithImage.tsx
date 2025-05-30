import { PayloadMedia } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import { push } from '@socialgouv/matomo-next';
import Link from 'next/link';
import PayloadImage from '../generic/PayloadImage';
import { tss } from 'tss-react';

type Props = {
	title: string;
	description: string;
	buttonText: string;
	buttonLink: string;
	image: string | PayloadMedia;
	imageRight?: boolean;
	blueBackground?: boolean;
};

export function TextWithImage(props: Props) {
	const {
		title,
		description,
		blueBackground,
		imageRight,
		image,
		buttonText,
		buttonLink
	} = props;
	const { classes, cx } = useStyles();

	const isExternalLink = buttonLink.startsWith('http');

	return (
		<div className={cx(blueBackground ? classes.blueBackground : {})}>
			<div
				className={cx(
					fr.cx('fr-container'),
					classes.root,
					imageRight ? classes.imageRight : {}
				)}
			>
				<div className={classes.firstSection}>
					<h2>{title}</h2>
					<p>{description}</p>
					<Link
						href={buttonLink}
						target={isExternalLink ? '_blank' : undefined}
						title={
							isExternalLink ? `${buttonText}, nouvelle fenêtre` : undefined
						}
						onClick={() => {
							push(['trackEvent', 'home', 'formDemand']);
						}}
						className={fr.cx('fr-btn', 'fr-btn--secondary')}
					>
						{buttonText}
					</Link>
				</div>
				<div className={classes.secondSection}>
					<PayloadImage image={image} width={327} height={255} isDecorative />
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(TextWithImage.name).create(() => ({
	root: {
		maxWidth: '62rem',
		paddingTop: fr.spacing('14v'),
		paddingBottom: fr.spacing('14v'),
		display: 'flex',
		alignItems: 'center',
		gap: fr.spacing('17v'),
		[fr.breakpoints.down('sm')]: {
			flexWrap: 'wrap',
			textAlign: 'center'
		}
	},
	imageRight: {
		flexDirection: 'row-reverse',
		[fr.breakpoints.down('sm')]: {
			flexDirection: 'row'
		}
	},
	blueBackground: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default
	},
	firstSection: {
		h2: {
			...fr.typography[4].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			paddingRight: fr.spacing('20v')
		},
		p: {
			marginTop: fr.spacing('2v')
		},
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	secondSection: {
		width: '60%',
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	contactButton: {
		backgroundColor: fr.colors.decisions.background.default.grey.default
	}
}));
