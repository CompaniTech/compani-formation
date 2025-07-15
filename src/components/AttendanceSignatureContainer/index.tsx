import { ActionDispatch, useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import FeatherButton from '../../components/icons/FeatherButton';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import NiSecondaryButton from '../../components/form/SecondaryButton';
import NiErrorMessage from '../../components/ErrorMessage';
import { ATTENDANCE_SUMMARY, IS_WEB } from '../../core/data/constants';
import { ErrorActionType, ErrorStateType, RESET_ERROR, SET_ERROR } from '../../reducers/error';
import ExitModal from '../ExitModal';
import { htmlContent } from './canvas';
import styles from './styles';

interface AttendanceSignatureContainerProps {
  signature: string,
  error: ErrorStateType,
  resetError: () => void,
  setSignature: (img: string) => void,
  setSelectedSlotsOptions?: () => void,
  dispatchErrorSignature: ActionDispatch<[action: ErrorActionType]>
}

const AttendanceSignatureContainer = ({
  signature,
  error,
  resetError,
  setSignature,
  setSelectedSlotsOptions = () => {},
  dispatchErrorSignature,
}: AttendanceSignatureContainerProps) => {
  const navigation = useNavigation();
  const iframeRef = useRef<any>(null);
  const webViewRef = useRef<WebView>(null);
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const onMessage = (event: WebViewMessageEvent) => {
    const dataURI = event.nativeEvent.data;
    setSignature(dataURI);
    if (dataURI) resetError();
  };

  const handleIframeMessage = useCallback((event: MessageEvent<string>) => {
    // eslint-disable-next-line no-undef
    if ((event.origin !== window.location.origin && event.origin !== 'null') || !isFocused) return;
    const dataURI = event.data;
    setSignature(dataURI);
    if (dataURI) resetError();
  }, [isFocused, resetError, setSignature]);

  useEffect(() => {
    if (IS_WEB) {
      // eslint-disable-next-line no-undef
      window.addEventListener('message', handleIframeMessage);
    }
    return () => {
      if (IS_WEB) {
        // eslint-disable-next-line no-undef
        window.removeEventListener('message', handleIframeMessage);
      }
    };
  }, [handleIframeMessage]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setExitConfirmationModal(true);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [setExitConfirmationModal])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (exitConfirmationModal || !isFocused) return;

      e.preventDefault();
      setExitConfirmationModal(true);
    });

    return unsubscribe;
  }, [navigation, exitConfirmationModal, isFocused]);

  const sendMessageToWebView = (message: string) => {
    webViewRef.current?.injectJavaScript(`handleMessage("${message}"); true;`);
  };

  const sendMessageToIframe = (message: string) => {
    iframeRef.current?.contentWindow.postMessage(message, '*');
  };

  const clearCanvas = () => (IS_WEB ? sendMessageToIframe('clear') : sendMessageToWebView('clear'));

  const undoCanvas = () => (IS_WEB ? sendMessageToIframe('undo') : sendMessageToWebView('undo'));

  const toggleModal = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    setSignature('');
    resetError();
    navigation.goBack();
  };

  const goToSummary = () => {
    if (!signature) {
      dispatchErrorSignature({ type: SET_ERROR, payload: 'Veuillez signer dans l\'encadré' });
    } else {
      dispatchErrorSignature({ type: RESET_ERROR });
      setSelectedSlotsOptions();
      navigation.navigate(ATTENDANCE_SUMMARY);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.LG}
          color={GREY[600]} />
        <ExitModal onPressConfirmButton={toggleModal} visible={exitConfirmationModal}
          title="Êtes-vous sûr(e) de cela ?" onPressCancelButton={() => setExitConfirmationModal(false)}
          contentText="Votre signature ne sera pas enregistrée" />
        {
          IS_WEB
            ? <View style={styles.iframeContainer}>
              <iframe ref={iframeRef} src={`data:text/html,${encodeURIComponent(htmlContent)}`}
                style={styles.iframeContent} />
            </View>
            : <View style={styles.webviewContainer}>
              <WebView
                ref={webViewRef}
                source={{ html: htmlContent, baseUrl: '' }}
                onMessage={onMessage}
                javaScriptEnabled
                originWhitelist={['*']}
              />
            </View>

        }
        <View style={styles.buttonContainer}>
          <NiSecondaryButton customStyle={styles.button} caption="Tout effacer" onPress={clearCanvas} />
          <NiSecondaryButton customStyle={styles.button} caption="Annuler" onPress={undoCanvas} />
        </View>
        <View style={styles.footer}>
          <NiErrorMessage message={error.message} show={error.value} />
          <NiPrimaryButton caption='Suivant' onPress={goToSummary} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AttendanceSignatureContainer;
