import { PayloadMedia } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import Image from 'next/image';

type PayloadImageProps = {
	image: string | PayloadMedia;
	width?: number;
	height?: number;
	isDecorative?: boolean;
};

const PayloadImage = (props: PayloadImageProps) => {
	const { image, width, height, isDecorative } = props;

	return (
		typeof image === 'object' && (
			/* @ts-ignore -- Intentionally leaving alt undefined (for decorative image) */
			<Image
				className={fr.cx('fr-responsive-img')}
				src={image.url || ''}
				{...(!isDecorative && { alt: image.alt || '' })}
				aria-hidden={isDecorative}
				width={width || image.width || 0}
				height={height || image.height || 0}
			/>
		)
	);
};

export default PayloadImage;
