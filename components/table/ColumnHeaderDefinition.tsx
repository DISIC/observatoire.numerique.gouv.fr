import {
	type FrIconClassName,
	type RiIconClassName,
	fr
} from '@codegouvfr/react-dsfr';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { ReactNode } from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Button } from '@codegouvfr/react-dsfr/Button';

type Props = {
	icon: FrIconClassName | RiIconClassName;
	text: ReactNode;
	infos: {
		title: string;
		content: ReactNode;
	};
};

export function ColumnHeaderDefinition(props: Props) {
	const { icon, text, infos } = props;
	const { classes, cx } = useStyles();

	const { InfosModal, infosModalButtonProps } = createModal({
		name: 'infos',
		isOpenedByDefault: false
	});

	return (
		<>
			<Button className={cx(classes.root)} {...infosModalButtonProps}>
				<i className={fr.cx(icon)} />
				<span role="text" className={cx(classes.text)}>
					{text}{' '}
					<i className={cx(fr.cx('ri-information-line'), classes.icon)} />
				</span>
			</Button>
			<InfosModal
				title={infos.title}
				buttons={[
					{
						onClick: () => console.log('en savoir plus clicked'),
						children: 'En savoir plus'
					}
				]}
			>
				{infos.content}
			</InfosModal>
		</>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: fr.spacing('4v'),
		color: theme.decisions.text.actionHigh.blueFrance.default,
		fontWeight: 'bold',
		textAlign: 'center',
		cursor: 'pointer',
		borderRadius: '8px',
		backgroundColor: 'transparent',
		[':hover']: {
			backgroundColor:
				theme.decisions.background.alt.blueFrance.default + ' !important'
		}
	},
	text: {
		marginTop: fr.spacing('3v')
	},
	icon: {
		['&::before']: {
			'--icon-size': fr.typography[18].style.fontSize
		}
	}
}));
