import { Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { GREY, PINK } from '../../../styles/colors';
import styles from './styles';

interface RenderItemProps {
  itemLabel: string,
  isChecked: boolean,
  onPressCheckbox: () => void
  disabled?: boolean,
}

const Checkbox = ({ itemLabel, isChecked, onPressCheckbox, disabled = false }: RenderItemProps) => {
  const iconName = isChecked ? 'check-box' : 'check-box-outline-blank';
  const [iconColor, setIconColor] = useState<string>(GREY[600]);
  const [textStyle, setTextStyle] = useState<object>({ ...styles.text, color: GREY[600] });

  useEffect(() => {
    if (isChecked) {
      if (disabled) {
        setIconColor(PINK[300]);
        setTextStyle({ ...styles.text, color: GREY[300] });
      } else {
        setIconColor(PINK[500]);
        setTextStyle({ ...styles.text, color: GREY[600] });
      }
    } else if (disabled) {
      setIconColor(GREY[300]);
      setTextStyle({ ...styles.text, color: GREY[300] });
    } else {
      setIconColor(GREY[600]);
      setTextStyle({ ...styles.text, color: GREY[600] });
    }
  }, [disabled, isChecked]);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPressCheckbox} disabled={disabled}>
      <MaterialIcons style={styles.icon} size={24} name={iconName} color={iconColor} />
      <Text style={textStyle}>{itemLabel}</Text>
    </TouchableOpacity>
  );
};
export default Checkbox;
