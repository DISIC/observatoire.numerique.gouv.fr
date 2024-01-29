import { OnButtonClickUserParams } from '@/pages/administration/bo/users';
import { formatDateToFrenchString } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Prisma, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	user: User;
	onButtonClick: ({ type, user }: OnButtonClickUserParams) => void;
};

const UserCard = ({ user, onButtonClick }: Props) => {
	const { data: session } = useSession({ required: true });
	const { cx, classes } = useStyles();

	return (
		<div className={fr.cx('fr-card', 'fr-my-3w', 'fr-p-2w')}>
			<div
				className={fr.cx(
					'fr-grid-row',
					'fr-grid-row--gutters',
					'fr-grid-row--middle'
				)}
			>
				<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-3')}>
					<p className={cx(fr.cx('fr-mb-0'), classes.spanFullName)}>
						{user.username}
					</p>
					<span className={classes.userEmail}>{user.email}</span>
				</div>
				<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-3')}>
					{user.created_at ? (
						<span>{formatDateToFrenchString(user.created_at.toString())}</span>
					) : (
						'x'
					)}
				</div>
				<div
					className={cx(
						fr.cx('fr-col', 'fr-col-12', 'fr-col-md-4'),
						classes.wrapperButtons
					)}
				>
					<Button
						priority="tertiary"
						size="small"
						iconId="fr-icon-delete-bin-line"
						disabled={session?.user?.email === user.email}
						iconPosition="right"
						className={cx(fr.cx('fr-mr-5v'), classes.iconError)}
						onClick={() => onButtonClick({ type: 'delete', user })}
					>
						Supprimer
					</Button>
					<Button
						priority="secondary"
						size="small"
						iconId="fr-icon-edit-line"
						iconPosition="right"
						onClick={() => onButtonClick({ type: 'update', user })}
					>
						Modifier
					</Button>
				</div>
			</div>
		</div>
	);
};

const useStyles = makeStyles()(theme => ({
	spanFullName: {
		fontWeight: 'bold'
	},
	iconSuccess: {
		color: 'green'
	},
	iconError: {
		color: theme.decisions.text.default.error.default
	},
	wrapperButtons: {
		display: 'flex',
		justifyContent: 'end'
	},
	userEmail: {
		wordWrap: 'break-word'
	}
}));

export default UserCard;
