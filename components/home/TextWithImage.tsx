import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Image from 'next/image';
import { useRouter } from 'next/router';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	button: {
		text: string;
		link: string;
	};
	image: {
		alt: string;
		src: string;
		width: number;
		height: number;
	};
	imageRight?: boolean;
	blueBackground?: boolean;
};

export function TextWithImage(props: Props) {
	const { title, description, blueBackground, imageRight, image, button } =
		props;
	const { classes, cx } = useStyles();
	const router = useRouter();

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
					<Button
						type="button"
						priority="secondary"
						className={classes.contactButton}
						onClick={() => {
							router.push(button.link);
						}}
					>
						{button.text}
					</Button>
				</div>
				<div className={classes.secondSection}>
					<Image
						alt={image.alt}
						src={image.src}
						title={image.alt}
						width={image.width}
						height={image.height}
					/>
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
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
		backgroundColor: theme.decisions.background.alt.blueFrance.default
	},
	firstSection: {
		h2: {
			...fr.typography[4].style,
			color: theme.decisions.background.actionHigh.blueFrance.default
		},
		p: {
			marginTop: fr.spacing('2v')
		},
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	secondSection: {
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	contactButton: {
		backgroundColor: theme.decisions.background.default.grey.default
	}
}));
