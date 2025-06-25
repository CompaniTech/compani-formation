import { StyleSheet } from 'react-native';
import { GREY, PINK, TRANSPARENT_GREY, WHITE } from '../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN, PADDING } from '../../../styles/metrics';
import {
  FIRA_SANS_BOLD,
  FIRA_SANS_MEDIUM,
  FIRA_SANS_REGULAR,
  NUNITO_SEMI,
  NUNITO_LIGHT,
  FIRA_SANS_ITALIC,
  FIRA_SANS_BOLD_ITALIC,
} from '../../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    paddingHorizontal: PADDING.LG,
  },
  identityContainer: {
    marginBottom: MARGIN.XL,
    marginHorizontal: MARGIN.XL,
  },
  identityBackground: {
    minHeight: 264,
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    height: 88,
    width: 88,
    borderRadius: BORDER_RADIUS.XXL,
    borderWidth: BORDER_WIDTH,
    borderColor: TRANSPARENT_GREY,
  },
  profileImageEdit: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: BORDER_RADIUS.XXL,
    borderColor: GREY[200],
    borderWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    padding: PADDING.SM,
  },
  name: {
    ...FIRA_SANS_BOLD.LG,
  },
  company: {
    ...FIRA_SANS_MEDIUM.MD,
    textAlign: 'center',
    marginBottom: MARGIN.LG,
  },
  linkRequestButton: {
    marginTop: MARGIN.SM,
    marginBottom: MARGIN.LG,
  },
  linkRequestContainer: {
    width: 160,
    textAlign: 'center',
    marginVertical: MARGIN.MD,
  },
  linkRequestText: {
    ...FIRA_SANS_ITALIC.MD,
  },
  companyName: {
    ...FIRA_SANS_BOLD_ITALIC.MD,
  },
  coursesContainer: {
    flexDirection: 'row',
  },
  coursesContent: {
    alignItems: 'center',
    marginHorizontal: MARGIN.SM,
  },
  courses: {
    ...NUNITO_SEMI.XS,
    textAlign: 'center',
    width: 88,
  },
  numberOfCourses: {
    ...NUNITO_LIGHT.XL,
    color: PINK[500],
  },
  contact: {
    ...FIRA_SANS_BOLD.LG,
    marginBottom: MARGIN.MD,
  },
  subTitle: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[600],
  },
  contactsContainer: {
    marginHorizontal: MARGIN.XL,
    marginBottom: MARGIN.MD,
  },
  infos: {
    ...FIRA_SANS_MEDIUM.MD,
    marginBottom: MARGIN.MD,
  },
  logOutButton: {
    marginBottom: MARGIN.MD,
    marginHorizontal: MARGIN.XL,
  },
  passwordButton: {
    marginTop: MARGIN.SM,
  },
  legalNoticeContainer: {
    marginVertical: MARGIN.SM,
    marginHorizontal: MARGIN.XL,
    alignItems: 'center',
  },
  legalNotice: {
    ...FIRA_SANS_REGULAR.MD,
    color: PINK[500],
  },
});

export default styles;
