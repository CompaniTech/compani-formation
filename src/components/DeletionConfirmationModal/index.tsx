import { useState, useReducer, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';
import NiModal from '../Modal';
import NiInput from '../form/Input';
import Users from '../../api/users';
import asyncStorage from '../../core/helpers/asyncStorage';
import FeatherButton from '../icons/FeatherButton';
import { HIT_SLOP, ICON } from '../../styles/metrics';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../reducers/error';
import { GREY, ORANGE } from '../../styles/colors';
import commonStyle from '../../styles/common';

interface DeletionConfirmationModalProps {
  visible: boolean,
  loggedUserId: string,
  setVisible: (value: boolean) => void,
  setConfirmationModal: () => void,
}

const DeletionConfirmationModal = ({
  visible,
  loggedUserId,
  setVisible,
  setConfirmationModal,
}: DeletionConfirmationModalProps) => {
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const CONFIRMATION_WORD = 'supprimer';

  useEffect(() => {
    const isConfirmationInputInvalid = !(confirmationInput.toLowerCase().trim() === CONFIRMATION_WORD);
    if (isConfirmationInputInvalid) {
      const payload = isValidationAttempted
        ? `Vous devez écrire “${CONFIRMATION_WORD}” ici pour confirmer la suppression de compte`
        : '';
      dispatchError({ type: SET_ERROR, payload });
    } else { dispatchError({ type: RESET_ERROR }); }
  }, [confirmationInput, isValidationAttempted]);

  const deleteAccount = async () => {
    try {
      setIsValidationAttempted(true);
      if (!error.value) {
        setIsLoading(true);
        await Users.deleteAccount(loggedUserId);
        await asyncStorage.removeCompaniToken();
        await asyncStorage.removeRefreshToken();
        await asyncStorage.removeUserId();
        await asyncStorage.removeExpoToken();
        setVisible(false);
        setConfirmationModal();
      }
    } catch (e: any) {
      if (e.response.status === 403) dispatchError({ type: SET_ERROR, payload: e.response.data.message });
      else dispatchError({ type: SET_ERROR, payload: 'Oops, une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  const onRequestClose = () => {
    setIsValidationAttempted(false);
    setVisible(true);
    setConfirmationInput('');
  };

  return (
    <NiModal visible={visible}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>Êtes-vous sûr(e) de vouloir supprimer votre compte ?</Text>
          <FeatherButton name="x" onPress={onRequestClose} size={ICON.MD} color={GREY[600]} />
        </View>
        <View style={styles.warningMessage}>
          <AntDesign name="exclamation-circle" color={ORANGE[700]} size={ICON.MD} />
          <Text style={styles.warningText}>
            Votre historique de formation sera supprimé. Cette action est irréversible.
          </Text>
        </View>
        <Text style={styles.body}>Veuillez écrire “{CONFIRMATION_WORD}” pour confirmer cette action.</Text>
        <NiInput value={confirmationInput} onChangeText={setConfirmationInput} placeholder={CONFIRMATION_WORD}
          type="text" borderColor={GREY[200]} validationMessage={error.message} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={onRequestClose}>
            <Text style={styles.button}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={deleteAccount}>
            {!isLoading
              ? <Text style={styles.button}>Supprimer mon compte</Text>
              : <ActivityIndicator style={commonStyle.disabled} color={GREY[800]} size="small" />}
          </TouchableOpacity>
        </View>
      </>
    </NiModal>
  );
};

export default DeletionConfirmationModal;
