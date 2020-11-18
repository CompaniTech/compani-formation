import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import IconButton from '../../../components/IconButton';
import NiButton from '../../../components/form/Button';
import { GREY, PINK, WHITE } from '../../../styles/colors';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../../styles/metrics';
import { UserType } from '../../../types/UserType';
import styles from './styles';
import NiInput from '../../../components/form/Input';
import { NavigationType } from '../../../types/NavigationType';
import Users from '../../../api/users';
import { Context as AuthContext } from '../../../context/AuthContext';
import ExitModal from '../../../components/ExitModal';

interface PasswordEditionProps {
  loggedUser: UserType,
  navigation: NavigationType,
}

const PasswordEdition = ({ loggedUser, navigation }: PasswordEditionProps) => {
  const isIOS = Platform.OS === 'ios';
  const { signOut } = useContext(AuthContext);
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [password, setPassword] = useState({ newPassword: '', confirmedPassword: '' });
  const [unvalid, setUnvalid] = useState({ newPassword: false, confirmedPassword: false });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState({ newPassword: false, confirmedPassword: false });

  const keyboardDidHide = () => Keyboard.dismiss();
  Keyboard.addListener('keyboardDidHide', keyboardDidHide);

  const hardwareBackPress = () => {
    setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => { BackHandler.addEventListener('hardwareBackPress', hardwareBackPress); });

  useEffect(() => {
    setUnvalid({
      newPassword: password.newPassword.length < 6,
      confirmedPassword: password.confirmedPassword !== password.newPassword,
    });
  }, [password]);

  useEffect(() => {
    const { newPassword, confirmedPassword } = unvalid;
    setIsValid(!(newPassword || confirmedPassword));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unvalid]);

  const scrollRef = useRef<ScrollView>(null);

  const goBack = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    navigation.navigate('Home', { screen: 'Profile', params: { screen: 'Profile' } });
  };

  const savePassword = async () => {
    try {
      setIsLoading(true);
      if (isValid) await Users.updatePassword(loggedUser._id, { local: { password: password.newPassword } });
      goBack();
    } catch (e) {
      if (e.status === 401) signOut();
    }
  };

  const setPasswordField = (text, key) => {
    setPassword({ ...password, [key]: text });
    setIsTouch({ ...isTouch, [key]: true });
  };

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
      <View style={styles.goBack}>
        <TouchableOpacity>
          <IconButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD} color={GREY[600]} />
        </TouchableOpacity>
        <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal}
          onPressCancelButton={() => setExitConfirmationModal(false)}
          title='Es-tu sûr de cela ?' contentText='Tes modifications ne seront pas enregistrées.' />
      </View>
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Modifier mon mot de passe</Text>
        <View style={styles.input}>
          <NiInput caption="Nouveau mot de passe" value={password.newPassword}
            type="password" darkMode={false} onChangeText={text => setPasswordField(text, 'newPassword')}
            validationMessage={unvalid.newPassword && isTouch.newPassword
              ? 'Le mot de passe doit comporter au minimum 6 caractères'
              : ''} />
        </View>
        <View style={styles.input}>
          <NiInput caption="Confirmer mot de passe" value={password.confirmedPassword}
            type="password" darkMode={false} onChangeText={text => setPasswordField(text, 'confirmedPassword')}
            validationMessage={unvalid.confirmedPassword && isTouch.confirmedPassword
              ? 'Ton nouveau mot de passe et sa confirmation ne correspondent pas'
              : ''} />
        </View>
        <View style={styles.footer}>
          <NiButton caption="Valider" onPress={savePassword} disabled={!isValid} loading={isLoading}
            bgColor={isValid ? PINK[500] : GREY[500]} color={WHITE} borderColor={isValid ? PINK[500] : GREY[500]} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const mapStateToProps = state => ({ loggedUser: state.main.loggedUser });

export default connect(mapStateToProps)(PasswordEdition);
