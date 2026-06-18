import { View, FlatList } from 'react-native';
import { ActivityType } from '../../../types/ActivityTypes';
import { CourseModeType } from '../../../types/CourseTypes';
import ActivityCell from '../ActivityCell';
import styles from './styles';

type ActivityListProps = {
  activities: ActivityType[],
  profileId: string,
  mode: CourseModeType,
}

const renderSeparator = () => <View style={styles.separator} />;

const ActivityList = ({ activities, profileId, mode }: ActivityListProps) => {
  const renderActivityCell = (activity: ActivityType) => (
    <ActivityCell activity={activity} profileId={profileId} mode={mode} />
  );

  return (
    <FlatList horizontal data={activities} keyExtractor={item => item._id}
      renderItem={({ item }) => renderActivityCell(item)} ItemSeparatorComponent={renderSeparator}
      contentContainerStyle={styles.cell} showsHorizontalScrollIndicator={false} initialNumToRender={5}
      maxToRenderPerBatch={10} windowSize={5} />
  );
};

export default ActivityList;
