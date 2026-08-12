import { TouchableOpacity, Insets } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import commonStyle from '../../../styles/common';
import { IoniconsType } from '../../../types/IoniconsType';

interface IoniconsButtonProps {
  onPress: () => void,
  name: IoniconsType,
  color: string,
  size: number,
  style?: object,
  disabled?: boolean,
  hitSlop?: Insets,
}

const IoniconsButton = ({
  onPress,
  name,
  color,
  size,
  style,
  disabled = false,
  hitSlop = { top: 12, bottom: 12, left: 12, right: 12 },
}: IoniconsButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[style, disabled && commonStyle.disabled, commonStyle.iconButton]}
    disabled={disabled} hitSlop={hitSlop}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);

export default IoniconsButton;
