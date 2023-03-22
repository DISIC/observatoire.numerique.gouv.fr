import { TProcedure } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorLabel } from './IndicatorLabel';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { proceduresTableHeaders } from '@/utils/mock';
import { IndicatorValue } from './IndicatorValue';

type Props = {
	procedure: TProcedure;
};

export function ProcedureMobileCard(props: Props) {
	const { procedure } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.mainInfos)}>
				<div className={fr.cx('fr-text--sm', 'fr-mb-0')}>{procedure.title}</div>
				<div className={fr.cx('fr-text--xs', 'fr-mb-0')}>
					<div>{procedure.ministere}</div>
					{procedure.volume && (
						<div className={fr.cx('fr-mt-3v')}>
							Total d&apos;utilisateur annuel : {procedure.volume}
						</div>
					)}
				</div>
			</div>
			<hr className={fr.cx('fr-pb-1v', 'fr-mt-3v')} />
			<div className={cx(classes.fields)}>
				{procedure.fields.map(field => {
					const procedureHeader = proceduresTableHeaders.find(
						pth => pth.slug === field.slug
					);
					return (
						<div key={field.slug} className={cx(classes.field)}>
							{procedureHeader && (
								<ColumnHeaderDefinition
									icon={procedureHeader.icon}
									text={procedureHeader.label}
									infos={{
										content:
											'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.',
										title: procedureHeader.label
									}}
								/>
							)}
							<IndicatorLabel {...field} />
							{field.value && (
								<IndicatorValue slug={field.slug} value={field.value} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		border: `1px solid ${theme.decisions.border.default.blueFrance.default}`,
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('2v'),
		paddingLeft: fr.spacing('4v'),
		paddingRight: fr.spacing('4v'),
		marginBottom: fr.spacing('4v'),
		backgroundColor: theme.decisions.background.default.grey.default
	},
	mainInfos: {
		['& > div:first-child']: {
			fontWeight: 500
		}
	},
	fields: {
		display: 'flex',
		flexDirection: 'column'
	},
	field: {
		position: 'relative',
		marginBottom: fr.spacing('4v')
	}
}));
