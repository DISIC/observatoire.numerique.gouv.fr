import UserCard from '@/components/administration/UserCard';
import { Loader } from '@/components/generic/Loader';
import { Modal } from '@/components/generic/Modal';
import { Pagination } from '@/components/generic/Pagination';
import { useUsers } from '@/utils/api';
import { getNbPages } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Prisma, User } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

export type OnButtonClickUserParams =
	| { type: 'update'; user: User }
	| { type: 'delete'; user: User };

type Props = {
	error?: string;
};

type UpsertUser =
	| (Prisma.UserUpdateInput & { id: string })
	| Prisma.UserCreateInput;

const defaultUserCreation: UpsertUser = {
	username: '',
	email: '',
	password: ''
};

export default function Editions(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	const [currentPage, setCurrentPage] = useState(1);
	const [numberPerPage, _] = useState(10);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] =
		useState<UpsertUser>(defaultUserCreation);
	const [alreadyExists, setAlreadyExists] = useState(false);

	const usernameInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (currentUser) {
			if (usernameInputRef)
				usernameInputRef.current?.setAttribute(
					'value',
					currentUser.username as string
				);
			if (emailInputRef)
				emailInputRef.current?.setAttribute(
					'value',
					currentUser.email as string
				);
			if (passwordInputRef)
				passwordInputRef.current?.setAttribute(
					'value',
					currentUser.password as string
				);
		}
	}, [currentUser]);

	const {
		data: usersResult,
		isError,
		isLoading,
		mutate: refetchUsers
	} = useUsers(currentPage, numberPerPage);
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading || !usersResult) return <div>...</div>;

	const {
		data: users,
		metadata: { count: usersCount }
	} = usersResult;

	if (!users) return <div>Aucun utilisateur</div>;

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const deleteUser = async (user: User) => {
		if (confirm('Êtes vous sûr de vouloir supprimer cet utilisateur ?')) {
			await fetch('/api/users', {
				method: 'DELETE',
				body: JSON.stringify({ id: user.id })
			});
			refetchUsers();
		}
	};

	const upsertUser = async () => {
		if (!usernameInputRef?.current?.value) {
			usernameInputRef?.current?.focus();
			return;
		}
		if (!emailInputRef?.current?.value) {
			emailInputRef?.current?.focus();
			return;
		}

		let response;
		if (currentUser.id) {
			response = await fetch('/api/users', {
				method: 'PUT',
				body: JSON.stringify({
					id: currentUser.id,
					username: usernameInputRef?.current?.value,
					email: emailInputRef?.current?.value
				})
			});
		} else {
			if (!passwordInputRef?.current?.value) {
				passwordInputRef?.current?.focus();
				return;
			}
			response = await fetch('/api/users', {
				method: 'POST',
				body: JSON.stringify({
					username: usernameInputRef?.current?.value,
					email: emailInputRef?.current?.value,
					password: passwordInputRef?.current?.value
				})
			});
		}

		if (response.status === 409) {
			setAlreadyExists(true);
		} else if ([201, 200].includes(response.status)) {
			setIsModalOpen(false);
			refetchUsers();
		}
	};

	const nbPages = getNbPages(usersCount, numberPerPage);

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
				<h2>Utilisateurs</h2>
				<p>
					Retrouvez sur cette page la liste des administrateurs de la
					plateforme.
				</p>
				<div
					onClick={() => {
						setCurrentUser(defaultUserCreation);
					}}
				>
					<Button
						iconId="fr-icon-add-circle-line"
						type="button"
						onClick={() => {
							setIsModalOpen(true);
						}}
						className={fr.cx('fr-btn--secondary')}
					>
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
									<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-5')}>
										<span>Utilisateur</span>
									</div>
									<div className={fr.cx('fr-col', 'fr-col-12', 'fr-col-md-2')}>
										<span>Date de création</span>
									</div>
								</div>
							</div>
							{users.map((user, index) => (
								<UserCard
									user={user}
									key={index}
									onButtonClick={({ type, user }) => {
										if (type === 'delete') deleteUser(user);
										if (type === 'update') {
											setCurrentUser(user);
											setIsModalOpen(true);
										}
									}}
								/>
							))}
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
			{isModalOpen && (
				<Modal
					onClose={() => {}}
					title={
						currentUser.id
							? "Modification d'un utilisateur"
							: "Création d'un utilisateur"
					}
					buttons={[
						{
							onClick: upsertUser,
							children: currentUser.id
								? "Modifier l'utilisateur"
								: "Créer l'utilisateur"
						}
					]}
				>
					<form
						onSubmit={e => {
							e.preventDefault();
							upsertUser();
						}}
					>
						<Input
							label="Nom complet"
							nativeInputProps={{
								name: 'username',
								ref: usernameInputRef
							}}
						/>
						<Input
							label="Email"
							disabled={!!currentUser.id}
							state={alreadyExists ? 'error' : 'default'}
							stateRelatedMessage="Un utilisateur avec cette adresse email existe déjà"
							nativeInputProps={{
								name: 'email',
								type: 'email',
								ref: emailInputRef,
								onChange: () => {
									setAlreadyExists(false);
								}
							}}
						/>
						{!currentUser.id && (
							<Input
								label="Mot de passe"
								nativeInputProps={{
									name: 'password',
									type: 'password',
									ref: passwordInputRef
								}}
							/>
						)}
						<button type="submit" style={{ display: 'none' }}></button>
					</form>
				</Modal>
			)}
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
