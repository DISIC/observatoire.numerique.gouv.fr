import { fr } from "@codegouvfr/react-dsfr";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";

type WysiwygInterpretorProps = {
	wysiwyg_html: string;
}

const WysiwygInterpretor = (props: WysiwygInterpretorProps) => {
	const { wysiwyg_html } = props;

	const { classes, cx } = useStyles();

	return (
		<div dangerouslySetInnerHTML={{ __html: wysiwyg_html }} className={cx(classes.wysiwyg)} />
	)
}

const useStyles = makeStyles()(theme => ({
	wysiwyg: {
		ul: {
			paddingInlineStart: '2.5rem',
			marginBottom: fr.spacing('4v')
		},
		'a': {
			color: theme.decisions.background.actionHigh.blueFrance.hover
		},
		'a[target="_blank"]': {
			marginRight: '0.5rem',
			':after': {
				content: '""',
				'--icon-size': '1rem',
				marginRight: '-0.125rem',
				marginLeft: '0.5rem',
				flex: "0 0 auto",
				display: "inline-block",
				verticalAlign: "calc((0.75em - var(--icon-size)) * 0.5)",
				maskSize: "100% 100%",
				maskImage: "url(/_next/static/media/external-link-line.24fd6719.svg)"
			}
		}
	}
}));

export default WysiwygInterpretor