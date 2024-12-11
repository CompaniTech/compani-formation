import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';
import QuestionnaireIcon from '../../../../assets/icons/QuestionnaireIcon';
import CompaniDate from '../../../core/helpers/dates/companiDates';
import { AttendanceSheetType } from '../../../types/AttendanceSheetTypes';
import Shadow from '../../design/Shadow';
import { DD_MM_YYYY } from '../../../core/data/constants';

interface LearnerAttendanceSheetCellProps {
  attendanceSheet: AttendanceSheetType,
}

const LearnerAttendanceSheetCell = ({ attendanceSheet }: LearnerAttendanceSheetCellProps) => (
  <View style={styles.container}>
    <TouchableOpacity>
      <View style={styles.iconContainer}>
        <QuestionnaireIcon />
        <Shadow customStyle={styles.shadow} />
      </View>
    </TouchableOpacity>
    <Text style={styles.AttendanceSheetName} lineBreakMode={'tail'} numberOfLines={2}>
      {[...new Set(attendanceSheet.slots!.map(slot => CompaniDate(slot.startDate).format(DD_MM_YYYY)))].join(', ')}
    </Text>
  </View>
);

export default LearnerAttendanceSheetCell;
