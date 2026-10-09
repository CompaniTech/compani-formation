import NiButton from '../Button';
import { COPPER, WHITE } from '../../../styles/colors';
import { FontType } from '../../../types/FontType';
import { FIRA_SANS_BLACK } from '../../../styles/fonts';
import { FeatherType } from '../../../types/FeatherType';

interface PrimaryButtonProps {
  customStyle?: Object,
  caption: string,
  onPress: () => void,
  loading?: boolean,
  bgColor?: string,
  color?: string,
  font?: FontType,
  icon?: FeatherType,
  disabled?: boolean,
}

const PrimaryButton = ({
  customStyle,
  caption,
  onPress,
  loading = false,
  bgColor = COPPER[500],
  color = WHITE,
  font = FIRA_SANS_BLACK.MD,
  icon,
  disabled = false,
}: PrimaryButtonProps) => (
  <NiButton customStyle={customStyle} caption={caption} onPress={onPress} loading={loading} disabled={disabled}
    bgColor={bgColor} borderColor={bgColor} color={color} font={font} icon={icon} />
);

export default PrimaryButton;
