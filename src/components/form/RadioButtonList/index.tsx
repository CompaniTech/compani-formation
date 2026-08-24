import { TouchableOpacity, Text } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import styles from './styles';
import { GREY, PINK } from '../../../styles/colors';
import { DataOptionsType } from '../../../store/attendanceSheets/slice';

interface RadioButtonProps {
  options: DataOptionsType[],
  setOption: (option: string) => void,
  checkedRadioButton: string
}

interface RenderItemProps {
  item: DataOptionsType,
  checkedRadioButton: string,
  onPressCheckbox: (value: string) => void
}

const renderItem = ({ item, checkedRadioButton, onPressCheckbox }: RenderItemProps) => {
  const iconName = checkedRadioButton === item.value ? 'radio-button-checked' : 'radio-button-unchecked';
  const iconColor = checkedRadioButton === item.value ? PINK[500] : GREY[600];
  const textStyle = checkedRadioButton === item.value ? styles.text : { ...styles.text, color: GREY[600] };

  return (
    <TouchableOpacity key={item.label} style={styles.container} onPress={() => onPressCheckbox(item.value)}>
      <MaterialIcons style={styles.icon} size={24} name={iconName} color={iconColor} />
      <Text style={textStyle}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const RadioButtonList = ({ options, checkedRadioButton, setOption }: RadioButtonProps) => {
  const onPressCheckbox = (value: string) => {
    setOption(checkedRadioButton === value ? '' : value);
  };

  return (
    <>
      {options.map(item => renderItem({ item, checkedRadioButton, onPressCheckbox }))}
    </>
  );
};

export default RadioButtonList;
