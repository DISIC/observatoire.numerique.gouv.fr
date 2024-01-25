import UserCard from '@/components/administration/UserCard';
import { Loader } from '@/components/generic/Loader';
import { Pagination } from '@/components/generic/Pagination';
import { useUsers } from '@/utils/api';
import { getNbPages } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { User } from '@prisma/client';
import { useState } from 'react';

export type OnButtonClickUserParams =
	| { type: 'create'; user?: User }
	| { type: 'delete'; user: User };

type Props = {
	error?: string;
};

export default function Editions(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	const [currentPage, setCurrentPage] = useState(1);
	const [numberPerPage, _] = useState(10);

	const [currentUser, setCurrentUser] = useState<User>();

	const { data: usersResult, isError, isLoading, mutate: refetchUsers } = useUsers(currentPage, numberPerPage,);
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading || !usersResult) return <div>...</div>;

	const { data: users, metadata: { count: usersCount } } = usersResult;

	if (!users) return <div>Aucun utilisateur</div>;

	const { UserModal, userModalButtonProps } = createModal({
		name: 'user',
		isOpenedByDefault: false
	})

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const deleteUser = async (user: User) => {
		if (confirm('Êtes vous sûr de vouloir supprimer cet utilisateur ?')) {
			await fetch('/api/users', {
				method: 'DELETE',
				body: JSON.stringify({ id: user.id })
			})
			refetchUsers()
		}
	}

	const upsertUser = async () => {

	}

	const nbPages = getNbPages(usersCount, numberPerPage);

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
				<h2>Utilisateurs</h2>
				<p>Retrouvez sur cette page la liste des administrateurs de la plateforme.</p>
				<div onClick={() => {
					setCurrentUser(undefined)
				}}>
					<Button iconId="fr-icon-add-circle-line" type="button" {...userModalButtonProps} className={fr.cx('fr-btn--secondary')}>
						Ajouter un utilisateur
					</Button>
				</div>
			</div>
			<div className={cx(fr.cx('fr-container'))}>
				{isLoading ? (
					<div className={fr.cx('fr-py-20v', 'fr-mt-4w')}>
						<Loader loadingMessage="Chargement des utilisateurs en cours..." />
					</div>
				) : (
					<div>
						<div className={fr.cx('fr-col-8')}>
							{nbPages > 1 && (
								<span className={fr.cx('fr-ml-0')}>
									Utilisateurs de{' '}
									<span className={cx(classes.boldText)}>
										{numberPerPage * (currentPage - 1) + 1}
									</span>{' '}
									à{' '}
									<span className={cx(classes.boldText)}>
										{numberPerPage * (currentPage - 1) + users.length}
									</span>{' '}
									de{' '}
									<span className={cx(classes.boldText)}>
										{usersResult.metadata.count}
									</span>
								</span>
							)}
						</div>
						<div
							className={cx(users.length === 0 ? classes.usersContainer : '')}
						>
							<div className={fr.cx('fr-mt-2v')}>
								<div
									className={cx(
										fr.cx(
											'fr-grid-row',
											'fr-grid-row--gutters',
											'fr-grid-row--middle'
										),
										classes.boldText
									)}
								>
									<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-3')}>
										<span>Utilisateur</span>
									</div>
									<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-3')}>
										<span>Date de création</span>
									</div>
								</div>
							</div>
							{
								users.map((user, index) => (
									<UserCard
										user={user}
										key={index}
										setCurrentUser={setCurrentUser}
										modalProps={userModalButtonProps}
										onButtonClick={({ type, user }) => {
											if (type === 'delete') deleteUser(user)
										}}
									/>
								))
							}
							{users.length === 0 && (
								<div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
									<div
										className={cx(
											fr.cx('fr-col-12', 'fr-col-md-5', 'fr-mt-30v'),
											classes.textContainer
										)}
										role="status"
									>
										<p>Aucun utilisateur trouvé</p>
									</div>
								</div>
							)}
						</div>
						<div
							className={fr.cx(
								'fr-grid-row--center',
								'fr-grid-row',
								'fr-mb-15w'
							)}
						>
							{nbPages > 1 && (
								<Pagination
									showFirstLast
									count={nbPages}
									defaultPage={currentPage}
									getPageLinkProps={pageNumber => ({
										onClick: event => {
											event.preventDefault();
											handlePageChange(pageNumber);
										},
										href: '#',
										classes: { link: fr.cx('fr-pagination__link') },
										key: `pagination-link-user-${pageNumber}`
									})}
									className={fr.cx('fr-mt-1w')}
								/>
							)}
						</div>
					</div>
				)}
			</div>
			<UserModal
				title="Création d'une édition"
				buttons={[
					{
						onClick: upsertUser,
						children: "Créer l'utilisateur"
					}
				]}
			>
				<form onSubmit={e => e.preventDefault()}>
					{JSON.stringify(currentUser)}
				</form>
			</UserModal>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingTop: fr.spacing('10v'),
		paddingBottom: fr.spacing('10v')
	},
	buttonContainer: {
		[fr.breakpoints.up('md')]: {
			display: 'flex',
			alignSelf: 'flex-end',
			justifyContent: 'flex-end',
			'.fr-btn': {
				justifySelf: 'flex-end',
				'&:first-of-type': {
					marginRight: '1rem'
				}
			}
		},
		[fr.breakpoints.down('md')]: {
			'.fr-btn:first-of-type': {
				marginBottom: '1rem'
			}
		}
	},
	usersContainer: {
		minHeight: '20rem'
	},
	textContainer: {
		textAlign: 'center',
		p: {
			margin: 0,
			fontWeight: 'bold'
		}
	},
	searchForm: {
		'.fr-search-bar': {
			'.fr-input-group': {
				width: '100%',
				marginBottom: 0
			}
		}
	},
	boldText: {
		fontWeight: 'bold'
	}
}));
