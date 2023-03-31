import { LoginForm } from '@/components/administration/LoginForm';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

type Props = {
	error?: string;
};

export default function Login(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={fr.cx('fr-container', 'fr-py-20v')}>
			<LoginForm error={error} />
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query
}) => {
	const { error } = query;

	return {
		props: {
			error: error ? (error as string) : null
		}
	};
};

const useStyles = makeStyles()(theme => ({
	root: {}
}));
