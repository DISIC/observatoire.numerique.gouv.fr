import { LoginForm } from '@/components/administration/LoginForm';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	error?: string;
};

export default function Editions(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	return <div className={fr.cx('fr-container', 'fr-py-20v')}></div>;
}

const useStyles = makeStyles()(theme => ({
	root: {}
}));
