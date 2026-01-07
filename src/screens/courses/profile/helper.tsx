// @ts-nocheck

import { View } from 'react-native';
import get from 'lodash/get';
import { E_LEARNING, IS_WEB, ON_SITE, REMOTE, TESTER } from '../../../core/data/constants';
import LiveCell from '../../../components/steps/LiveCell';
import ELearningCell from '../../../components/ELearningCell';
import styles from './styles';
import { BlendedCourseType } from '../../../types/CourseTypes';

const renderStepCell = (item, index, mode, route) => {
  if ([ON_SITE, REMOTE].includes(item.type)) {
    return <LiveCell step={item} index={index} mode={mode} />;
  }

  if (item.type === E_LEARNING) {
    const profileId = mode === TESTER ? route.params.subProgramId : route.params.courseId;

    return <ELearningCell step={item} index={index} profileId={profileId}
      endedActivity={route.params.endedActivity} mode={mode} />;
  }

  return null;
};

const renderSeparator = () => <View style={styles.separator} />;

export const renderStepList = (mode, route, item, index) => (
  <>
    {renderSeparator()}
    {renderStepCell(item, index, mode, route)}
  </>
);

export const renderFooter = () => <View style={styles.buttonContainer} />;

export const getTitle = (course) => {
  if (!course) return '';
  const programName = get(course, 'subProgram.program.name') || '';
  if (course?.subProgram.isStrictlyELearning) return programName;

  const { misc } = (course as BlendedCourseType);
  return `${programName}${misc ? ` - ${misc}` : ''}`;
};

const base64ToBlob = (base64Data: string, contentType: string) => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
};

export const generateSignatureFile = (signature, courseId, mode) => {
  let file;
  const contentType = 'image/png';
  if (IS_WEB) {
    const blob = base64ToBlob(signature, contentType);
    file = new File([blob], `${mode}_signature_${courseId}.png`, { type: contentType });
  } else file = { uri: signature, type: contentType, name: `${mode}_signature_${courseId}` };

  return file;
};
