// @ts-nocheck

import { useEffect, useRef, useState, useReducer } from 'react';
import {
  Text,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import FeatherButton from '../../../components/icons/FeatherButton';
import NiPrimaryButton from '../../../components/form/PrimaryButton';
import { GREY } from '../../../styles/colors';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../../styles/metrics';
import { PictureType } from '../../../types/PictureTypes';
import styles from './styles';
import NiInput from '../../../components/form/Input';
import { RootStackParamList, RootBottomTabParamList } from '../../../types/NavigationType';
import Users from '../../../api/users';
import { useGetLoggedUser, useSetLoggedUser } from '../../../store/main/hooks';
import { EMAIL_REGEX, IS_IOS, IS_WEB, PHONE_REGEX } from '../../../core/data/constants';
import ExitModal from '../../../components/ExitModal';
import NiErrorMessage from '../../../components/ErrorMessage';
import { formatPhoneForPayload } from '../../../core/helpers/utils';
import PictureModal from '../../../components/PictureModal';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../../reducers/error';
import { formatImage, formatPayload } from '../../../core/helpers/pictures';
import CameraModal from '../../../components/camera/CameraModal';
import ImagePickerManager from '../../../components/ImagePickerManager';
import PhoneSelect from '../../../components/form/PhoneSelect';

interface ProfileEditionProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList>,
StackScreenProps<RootBottomTabParamList>
> {
}

const FIRSTNAME = 'firstname';
const LASTNAME = 'lastname';

const ProfileEdition = ({ navigation }: ProfileEditionProps) => {
  const setLoggedUser = useSetLoggedUser();
  const loggedUser = useGetLoggedUser();

  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<any>({
    identity: {
      firstname: loggedUser.identity.firstname,
      lastname: loggedUser.identity.lastname,
    },
    contact: { phone: loggedUser.contact?.phone || '', countryCode: loggedUser.contact?.countryCode || '+33' },
    local: { email: loggedUser.local.email },
  });
  const [unvalid, setUnvalid] = useState({ lastName: false, phone: false, email: false, emptyEmail: false });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);
  const [source, setSource] = useState(require('../../../../assets/images/default_avatar.webp'));
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [pictureModal, setPictureModal] = useState<boolean>(false);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(false);
  const [imagePickerManager, setImagePickerManager] = useState<boolean>(false);

  const keyboardDidHide = () => Keyboard.dismiss();

  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => {
      hideListener.remove();
    };
  });

  const hardwareBackPress = () => {
    setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, []);

  useEffect(() => {
    setUnvalid({
      lastName: editedUser.identity.lastname === '',
      phone: !editedUser.contact.phone.match(PHONE_REGEX) && editedUser.contact.phone.length > 0,
      email: !editedUser.local.email.match(EMAIL_REGEX) && editedUser.local.email.length > 0,
      emptyEmail: editedUser.local.email === '',
    });
  }, [editedUser]);

  useEffect(() => {
    const { lastName, phone, email, emptyEmail } = unvalid;
    if (lastName || phone || email || emptyEmail) {
      setIsValid(false);
    } else setIsValid(true);
  }, [unvalid]);

  useEffect(() => {
    if (loggedUser?.picture?.link) {
      setSource({ uri: loggedUser.picture.link });
      setHasPhoto(true);
    } else {
      setSource(require('../../../../assets/images/default_avatar.webp'));
      setHasPhoto(false);
    }
  }, [loggedUser]);

  const scrollRef = useRef<ScrollView>(null);

  const goBack = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    navigation.goBack();
  };

  const saveData = async () => {
    try {
      setIsValidationAttempted(true);
      if (isValid) {
        setIsLoading(true);
        dispatchError({ type: RESET_ERROR });
        await Users.updateById(loggedUser._id, {
          ...editedUser,
          contact: formatPhoneForPayload(editedUser.contact),
        });
        const userId = loggedUser._id;
        const user = await Users.getById(userId);
        setLoggedUser(user);
        goBack();
      }
    } catch (e: any) {
      console.error(e);
      const payload = e.response.status === 409
        ? 'L\'email est déjà relié à un compte existant'
        : 'Erreur, si le problème persiste, contactez le support technique';
      dispatchError({ type: SET_ERROR, payload });
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeIdentity = (key: typeof LASTNAME | typeof FIRSTNAME, text: string) => {
    setEditedUser({
      ...editedUser,
      identity: { ...editedUser.identity, [key]: text },
    });
  };

  const emailValidation = () => {
    if (unvalid.email && isValidationAttempted) return 'Votre e-mail n\'est pas valide';
    if (unvalid.emptyEmail && isValidationAttempted) return 'Ce champ est obligatoire';

    return '';
  };

  const setContact = (value, path) => {
    setEditedUser({ ...editedUser, contact: { ...editedUser.contact, [path]: value } });
  };

  const savePicture = async (picture: PictureType) => {
    const { firstname, lastname } = loggedUser.identity;
    const fileName = `photo_${firstname}_${lastname}`;
    const file = await formatImage(picture, fileName);
    const data = formatPayload({ file, fileName });

    if (loggedUser.picture?.link) await Users.deleteImage(loggedUser._id);
    await Users.uploadImage(loggedUser._id, data);

    const user = await Users.getById(loggedUser._id);
    setLoggedUser(user);
  };

  const deletePicture = async () => {
    await Users.deleteImage(loggedUser._id);
    const user = await Users.getById(loggedUser._id);
    setLoggedUser(user);
    setPictureModal(false);
    goBack();
  };

  return !!loggedUser && (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS}>
        <View style={styles.goBack}>
          <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD}
            color={GREY[600]} />
          <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal}
            onPressCancelButton={() => setExitConfirmationModal(false)}
            title="Êtes-vous sûr(e) de cela ?" contentText="Vos modifications ne seront pas enregistrées." />
        </View>
        <ScrollView contentContainerStyle={styles.container} ref={scrollRef} showsVerticalScrollIndicator={IS_WEB}>
          <Text style={styles.title}>Modifier mes informations</Text>
          <View style={styles.imageContainer}>
            <Image style={styles.profileImage} source={source} />
            {!IS_WEB && <TouchableOpacity onPress={() => setPictureModal(true)}>
              <Text style={styles.profileEdit}>{hasPhoto ? 'MODIFIER LA PHOTO' : 'AJOUTER UNE PHOTO'}</Text>
            </TouchableOpacity>}
          </View>
          <NiInput caption="Prénom" value={editedUser.identity.firstname} type="firstname"
            onChangeText={text => onChangeIdentity(FIRSTNAME, text)} customStyle={styles.input} />
          <NiInput caption="Nom" value={editedUser.identity.lastname}
            type="lastname" onChangeText={text => onChangeIdentity(LASTNAME, text)} customStyle={styles.input}
            validationMessage={unvalid.lastName && isValidationAttempted ? 'Ce champ est obligatoire' : ''} />
          <PhoneSelect contact={editedUser.contact} setContact={setContact}
            validationMessage={unvalid.phone && isValidationAttempted
              ? 'Votre numéro de téléphone n\'est pas valide'
              : ''}/>
          <NiInput caption="E-mail" value={editedUser.local.email} type="email" validationMessage={emailValidation()}
            onChangeText={text => setEditedUser({ ...editedUser, local: { email: text.trim() } })}
            customStyle={styles.input} />
          <View style={styles.footer}>
            <NiErrorMessage message={error.message} show={error.value} />
            <NiPrimaryButton caption="Valider" onPress={saveData} loading={isLoading} />
          </View>
          <PictureModal visible={pictureModal} canDelete={hasPhoto} closePictureModal={() => setPictureModal(false)}
            deletePicture={deletePicture} openCamera={() => setCamera(true)}
            openImagePickerManager={() => setImagePickerManager(true)} />
          {camera && <CameraModal onRequestClose={() => setCamera(false)} savePicture={savePicture} visible={camera}
            goBack={goBack} />}
          {imagePickerManager && <ImagePickerManager onRequestClose={() => setImagePickerManager(false)}
            savePicture={savePicture} goBack={goBack} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileEdition;
