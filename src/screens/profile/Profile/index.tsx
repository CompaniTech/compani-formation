// @ts-nocheck

import { useContext, useEffect, useState } from 'react';
import { Text, ScrollView, Image, View, ImageBackground, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import get from 'lodash/get';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';
import { PictureType } from '../../../types/PictureTypes';
import { RootBottomTabParamList, RootStackParamList } from '../../../types/NavigationType';
import { formatPhone } from '../../../core/helpers/utils';
import NiSecondaryButton from '../../../components/form/SecondaryButton';
import NiPrimaryButton from '../../../components/form/PrimaryButton';
import commonStyles from '../../../styles/common';
import { AuthContextType, Context as AuthContext } from '../../../context/AuthContext';
import Courses from '../../../api/courses';
import CompanyLinkRequests from '../../../api/companyLinkRequests';
import Users from '../../../api/users';
import Companies from '../../../api/companies';
import { PINK } from '../../../styles/colors';
import { HIT_SLOP, ICON } from '../../../styles/metrics';
import FeatherButton from '../../../components/icons/FeatherButton';
import PictureModal from '../../../components/PictureModal';
import CompanySearchModal from '../../../components/CompanySearchModal';
import DeletionConfirmationModal from '../../../components/DeletionConfirmationModal';
import UserAccountDeletedModal from '../../../components/UserAccountDeletedModal';
import HomeScreenFooter from '../../../components/HomeScreenFooter';
import ImagePickerManager from '../../../components/ImagePickerManager';
import ValidationModal from '../../../components/companyLinkRequest/ValidationModal';
import { formatImage, formatPayload } from '../../../core/helpers/pictures';
import { useGetLoggedUser, useSetLoggedUser } from '../../../store/main/hooks';
import { PEDAGOGY, IS_WEB, DIRECTORY, CAMERA, GALLERY } from '../../../core/data/constants';
import { CompanyType } from '../../../types/CompanyType';
import { PedagogyCourseListResponseType } from '../../../types/AxiosTypes';
import styles from './styles';

interface ProfileProps extends CompositeScreenProps<
StackScreenProps<RootBottomTabParamList>,
StackScreenProps<RootStackParamList>
> {
}

const Profile = ({ navigation }: ProfileProps) => {
  const setLoggedUser = useSetLoggedUser();
  const loggedUser = useGetLoggedUser();

  const { signOut }: AuthContextType = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [onGoingCoursesCount, setOnGoingCoursesCount] = useState<number>();
  const [achievedCoursesCount, setAchievedCoursesCount] = useState<number>();
  const [source, setSource] = useState(require('../../../../assets/images/default_avatar.webp'));
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [pictureModal, setPictureModal] = useState<boolean>(false);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [deletionConfirmationModal, setDeletionConfirmationModal] = useState<boolean>(false);
  const [userAccountDeletedModal, setUserAccountDeletedModal] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [imagePickerManager, setImagePickerManager] = useState<boolean>(false);
  const [companyOptions, setCompanyOptions] = useState<CompanyType[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyType>({ _id: '', name: '' });
  const [isValidationModalOpened, setIsValidationModalOpened] = useState<boolean>(false);

  const editProfile = () => navigation.navigate('ProfileEdition');

  const editPassword = () => navigation.navigate('PasswordEdition', { userId: loggedUser._id });

  const clearExpoTokenAndSignOut = () => signOut(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { traineeCourses } = await Courses.getCourseList({ action: PEDAGOGY }) as PedagogyCourseListResponseType;
        setOnGoingCoursesCount(traineeCourses.onGoing.length);
        setAchievedCoursesCount(traineeCourses.achieved.length);
      } catch (e: any) {
        console.error(e);
        setOnGoingCoursesCount(0);
        setAchievedCoursesCount(0);
      }
    }

    if (isFocused) {
      fetchData();
    }
  }, [isFocused, loggedUser]);

  useEffect(() => {
    setUserFirstName(get(loggedUser, 'identity.firstname'));

    if (loggedUser?.picture?.link) {
      setSource({ uri: loggedUser.picture.link });
      setHasPhoto(true);
    } else {
      setSource(require('../../../../assets/images/default_avatar.webp'));
      setHasPhoto(false);
    }
  }, [loggedUser]);

  const openCompanyModal = async () => {
    try {
      const fetchCompanies = await Companies.list({ action: DIRECTORY });
      setCompanyOptions(fetchCompanies);
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalOpened(true);
    }
  };

  const openPicker = (pickerType: string) => {
    setType(pickerType);
    setImagePickerManager(true);
  };

  const onRequestClose = (value: CompanyType) => {
    if (value._id) {
      setSelectedCompany(value);
      setIsValidationModalOpened(true);
    }
    setIsModalOpened(false);
  };

  const createCompanyLinkRequest = async () => {
    try {
      await CompanyLinkRequests.createCompanyLinkRequest({ company: selectedCompany._id });
      const user = await Users.getById(loggedUser._id);
      setLoggedUser(user);
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidationModalOpened(false);
    }
  };

  const renderCompanyLinkRequest = () => {
    if (loggedUser.companyLinkRequest) {
      return (
        <Text style={styles.linkRequestContainer}>
          <Text style={styles.linkRequestText}>Demande de rattachement envoyée à </Text>
          <Text style={styles.companyName}>{loggedUser.companyLinkRequest.company.name}</Text>
        </Text>
      );
    }

    return (
      <View style={styles.linkRequestButton}>
        <NiPrimaryButton caption="Ajouter ma structure" onPress={openCompanyModal} />
      </View>
    );
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
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}>
        {!!loggedUser &&
          <>
            <Text style={[commonStyles.title, styles.title]}>Mon profil</Text>
            <View style={styles.identityContainer}>
              <ImageBackground imageStyle={{ resizeMode: 'contain' }} style={styles.identityBackground}
                source={require('../../../../assets/images/profile_background.webp')}>
                {IS_WEB
                  ? <Image style={styles.profileImage} source={source} />
                  : <TouchableOpacity onPress={() => setPictureModal(true)}>
                    <Image style={styles.profileImage} source={source} />
                    <FeatherButton name={hasPhoto ? 'edit-2' : 'plus'} onPress={() => setPictureModal(true)}
                      size={ICON.SM} color={PINK[500]} style={styles.profileImageEdit} />
                  </TouchableOpacity>}
                <Text style={styles.name}>{loggedUser.identity.firstname || ''} {loggedUser.identity.lastname}</Text>
                {loggedUser.company?.name
                  ? <Text style={styles.company}>{loggedUser.company.name}</Text>
                  : renderCompanyLinkRequest()}
                <View style={styles.coursesContainer}>
                  <View style={styles.coursesContent}>
                    <Text style={styles.courses}>FORMATIONS EN COURS</Text>
                    <Text style={styles.numberOfCourses}>{onGoingCoursesCount}</Text>
                  </View>
                  <View style={styles.coursesContent}>
                    <Text style={styles.courses}>FORMATIONS TERMINÉES</Text>
                    <Text style={styles.numberOfCourses}>{achievedCoursesCount}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={commonStyles.sectionDelimiter} />
            <View style={styles.contactsContainer}>
              <Text style={styles.contact}>Contact</Text>
              <Text style={styles.subTitle}>Téléphone</Text>
              <Text style={styles.infos}>
                {loggedUser.contact?.phone ? formatPhone(loggedUser.contact) : 'Non renseigné'}
              </Text>
              <Text style={styles.subTitle}>E-mail</Text>
              <Text style={styles.infos}>{loggedUser.local.email}</Text>
              <NiSecondaryButton caption="Modifier mes informations" onPress={editProfile} />
              <NiSecondaryButton customStyle={styles.passwordButton} caption="Modifier mon mot de passe"
                onPress={editPassword} />
            </View>
            <View style={commonStyles.sectionDelimiter} />
          </>
        }
        <NiSecondaryButton customStyle={styles.logOutButton} caption="Me déconnecter"
          onPress={clearExpoTokenAndSignOut} />
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={() => Linking.openURL('https://www.compani.fr/rgpd')}
          style={styles.legalNoticeContainer}>
          <Text style={styles.legalNotice}>Politique de confidentialité</Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={() => Linking.openURL('https://www.compani.fr/cgu-cgv')}
          style={styles.legalNoticeContainer}>
          <Text style={styles.legalNotice}>Conditions d’utilisation</Text>
        </TouchableOpacity>
        {!get(loggedUser, 'company') &&
          <TouchableOpacity hitSlop={HIT_SLOP} onPress={() => setDeletionConfirmationModal(true)}
            style={styles.legalNoticeContainer}>
            <Text style={styles.legalNotice}>Supprimer mon compte</Text>
          </TouchableOpacity>}
        <HomeScreenFooter source={require('../../../../assets/images/aux_joie.webp')} />
        <PictureModal visible={pictureModal} canDelete={hasPhoto} closePictureModal={() => setPictureModal(false)}
          openCamera={() => openPicker(CAMERA)} deletePicture={deletePicture} type={type}
          openImagePickerManager={() => openPicker(GALLERY)} />
        {imagePickerManager && <ImagePickerManager onRequestClose={() => setImagePickerManager(false)}
          savePicture={savePicture} />}
        <CompanySearchModal visible={isModalOpened} onRequestClose={onRequestClose} companyOptions={companyOptions} />
        <ValidationModal visible={isValidationModalOpened} onPressConfirmButton={createCompanyLinkRequest}
          companyName={selectedCompany.name} onPressCancelButton={() => setIsValidationModalOpened(false)} />
        <DeletionConfirmationModal visible={deletionConfirmationModal} loggedUserId={get(loggedUser, '_id')}
          setVisible={() => setDeletionConfirmationModal(false)}
          setConfirmationModal={() => setUserAccountDeletedModal(true)} />
        <UserAccountDeletedModal visible={userAccountDeletedModal} name={userFirstName} logout={() => signOut()} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
