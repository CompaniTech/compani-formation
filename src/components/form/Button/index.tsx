import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import commonStyle from '../../../styles/common';
import { ICON } from '../../../styles/metrics';
import { FontType } from '../../../types/FontType';
import styles from './styles';
import { FeatherType } from '../../../types/FeatherType';

interface ButtonProps {
  customStyle?: Object,
  caption: string,
  onPress: () => void,
  loading: boolean,
  bgColor: string,
  borderColor: string,
  color: string,
  font: FontType,
  icon?: FeatherType,
  disabled: boolean,
  numberOfLines?: number,
}

const Button = ({
  customStyle,
  caption,
  onPress,
  loading,
  bgColor,
  borderColor,
  color,
  font,
  icon,
  disabled,
  numberOfLines = 0,
}: ButtonProps) => {
  const style = styles(bgColor, borderColor, color, font);

  return (
    <TouchableOpacity style={[style.button, customStyle]} onPress={onPress} disabled={loading || disabled}
      testID={caption}>
      {!loading && <>
        {icon && <Feather name={icon} color={color} size={ICON.MD} style={style.icon} />}
        <Text style={{ ...style.textButton, color }} numberOfLines={numberOfLines}>{caption}</Text>
      </>}
      {loading && <ActivityIndicator style={commonStyle.disabled} color={color} size="small" />}
    </TouchableOpacity>
  );
};

export default Button;
