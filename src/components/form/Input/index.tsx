import { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Keyboard } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { GREY, WHITE } from '../../../styles/colors';
import { ICON } from '../../../styles/metrics';
import styles from './styles';
import Shadow from '../../design/Shadow';

interface InputProps {
  value: string,
  onChangeText: (string: string) => void,
  caption?: string,
  type: string,
  darkMode?: boolean,
  validationMessage?: string,
  required?: boolean,
  optional?: boolean,
  disabled?: boolean,
  placeholder?: string,
  borderColor?: string,
  isKeyboardOpen?: (value: boolean) => void,
  customStyle?: object,
}

const Input = ({
  value,
  onChangeText,
  caption = '',
  type,
  darkMode = false,
  validationMessage = '',
  required = false,
  optional = false,
  disabled = false,
  placeholder = '',
  borderColor = GREY[600],
  isKeyboardOpen,
  customStyle = {},
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const isPassword = type === 'password';
  const autoCapitalize = ['password', 'email'].includes(type) ? 'none' : 'sentences';
  const keyboradType = type === 'email' ? 'email-address' : 'default';
  const showPasswordIcon = showPassword ? 'eye' : 'eye-off';
  const secureTextEntry = isPassword && !showPassword;
  const togglePassword = () => { setShowPassword(previousShowPassword => !previousShowPassword); };
  const style = styles(isSelected, borderColor);
  const textStyle = darkMode ? { ...style.text, color: WHITE } : { ...style.text };

  const keyboardDidShow = () => {
    if (isKeyboardOpen) isKeyboardOpen(true);
  };

  const keyboardDidHide = () => {
    Keyboard.dismiss();
    if (isKeyboardOpen) isKeyboardOpen(false);
  };

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  });

  return (
    <>
      <View style={style.captionContainer}>
        <Text style={textStyle}>{caption}</Text>
        {required && <Text style={style.required}>*</Text>}
        {optional && <Text style={style.required}>(optionnel)</Text>}
      </View>
      <View style={[style.container, customStyle]}>
        <View style={style.input}>
          <TextInput value={value} onChangeText={onChangeText} onTouchStart={() => setIsSelected(true)}
            onBlur={() => setIsSelected(false)} testID={caption} secureTextEntry={secureTextEntry}
            style={style.innerInput} autoCapitalize={autoCapitalize} keyboardType={keyboradType} editable={!disabled}
            textContentType='oneTimeCode' placeholder={placeholder} placeholderTextColor={GREY[400]} />
          {isPassword &&
          <TouchableOpacity style={style.inputIcon} onPress={togglePassword}>
            <Feather name={showPasswordIcon} size={ICON.XS} />
          </TouchableOpacity>}
        </View>
        {isSelected && <Shadow customStyle={style.shadow} /> }
      </View>
      <Text style={style.unvalid}>{validationMessage}</Text>
    </>
  );
};

export default Input;
