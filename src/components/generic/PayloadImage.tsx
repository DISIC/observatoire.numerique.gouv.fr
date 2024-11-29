import { PayloadMedia } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import Image from 'next/image';

type PayloadImageProps = {
	image: string | PayloadMedia;
	width?: number;
	height?: number;
};

const PayloadImage = (props: PayloadImageProps) => {
	const { image, width, height } = props;

	return (
		typeof image === 'object' && (
			<Image
				className={fr.cx('fr-responsive-img')}
				src={image.url || ''}
				alt={image.alt || ''}
				width={width || image.width || 0}
				height={height || image.height || 0}
			/>
		)
	);
};

export default PayloadImage;
