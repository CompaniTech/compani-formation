import { Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { GREY, PINK } from '../../../styles/colors';
import styles from './styles';

interface RenderItemProps {
  itemLabel: string,
  isChecked: boolean,
  onPressCheckbox: () => void
  disabled?: boolean,
}

const getColors = (isChecked: boolean, disabled: boolean) => {
  if (isChecked) return { icon: disabled ? PINK[300] : PINK[500], text: disabled ? GREY[300] : GREY[600] };
  return { icon: disabled ? GREY[300] : GREY[600], text: disabled ? GREY[300] : GREY[600] };
};

const Checkbox = ({ itemLabel, isChecked, onPressCheckbox, disabled = false }: RenderItemProps) => {
  const iconName = isChecked ? 'check-box' : 'check-box-outline-blank';
  const { icon: iconColor, text: textColor } = getColors(isChecked, disabled);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPressCheckbox} disabled={disabled}>
      <MaterialIcons style={styles.icon} size={24} name={iconName} color={iconColor} />
      <Text style={[styles.text, { color: textColor }]}>{itemLabel}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;