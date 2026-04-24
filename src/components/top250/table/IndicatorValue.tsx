import { fr } from '@codegouvfr/react-dsfr';
import { Edition, IndicatorSlug } from '@prisma/client';
import Link from 'next/link';
import React, { ReactNode, useEffect, useRef } from 'react';
import { tss } from 'tss-react';

type Props = {
	slug: IndicatorSlug;
	procedureId: number | null;
	gristId: number | null;
	procedureTitle: string | null;
	edition?: Edition;
	value: string;
	noJdma?: boolean;
	label: string;
	onLinkFocus?: () => void;
};

const acceptedSlugValues: IndicatorSlug[] = [
	'online',
	'satisfaction',
	'handicap',
	'uptime',
	'performance'
];

function IndicatorValueDisplay(props: Props): ReactNode {
	const {
		slug,
		value,
		label,
		procedureId,
		gristId,
		procedureTitle,
		edition,
		noJdma,
		onLinkFocus
	} = props;
	const { classes, cx } = useStyles();

	const linkRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		const link = linkRef.current;

		if (link && onLinkFocus) {
			link.addEventListener('focus', onLinkFocus);

			// Clean up
			return () => {
				link.removeEventListener('focus', onLinkFocus);
			};
		}
	}, []);

	if (slug === 'online' && label !== 'À venir' && typeof value === 'string')
		return (
			<Link
				ref={linkRef}
				href={value}
				title={`Voir le service ${procedureTitle}`}
				target="_blank"
				rel="noreferrer"
			>
				Voir le service
			</Link>
		);

	if (slug === 'uptime' && !isNaN(parseInt(value))) return <>{value}%</>;
	if (slug === 'performance' && !isNaN(parseInt(value)))
		return <>{parseInt(value) / 1000}s</>;
	if (slug === 'handicap' && !isNaN(parseInt(value))) return <>{value}%</>;

	return <></>;
}

export const IndicatorValue = React.memo(function IndicatorValue(props: Props) {
	const { slug } = props;
	const { classes, cx } = useStyles();

	if (!acceptedSlugValues.includes(slug)) return <></>;

	return (
		<div className={classes.root}>
			<IndicatorValueDisplay {...props} />
		</div>
	);
});

const useStyles = tss.withName('IndicatorValue').create(() => ({
	root: {
		fontSize: fr.typography[17].style.fontSize,
		marginTop: fr.spacing('4v'),
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translateX(-50%)',
		width: '100%',
		['a::after']: {
			'--icon-size': 0,
			margin: 0
		},
		[fr.breakpoints.down('lg')]: {
			position: 'relative',
			top: 0,
			left: 0,
			transform: 'translateX(0)',
			marginTop: fr.spacing('2v')
		}
	}
}));
