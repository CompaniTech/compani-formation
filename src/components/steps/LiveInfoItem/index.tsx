import { View, Text, FlatList, Linking, TouchableOpacity } from 'react-native';
import get from 'lodash/get';
import { SlotType } from '../../../types/CourseTypes';
import CompaniDate from '../../../core/helpers/dates/companiDates';
import { ON_SITE, DAY_D_MONTH } from '../../../core/data/constants';
import LiveHoursDisplay from '../LiveHoursDisplay';
import styles from './styles';

type LiveInfoItemProps = {
  slots: SlotType[],
}

const hoursItem = (slot: SlotType) => <LiveHoursDisplay startDate={slot.startDate} endDate={slot.endDate} />;

const LiveInfoItem = ({ slots }: LiveInfoItemProps) => {
  const location = slots[0].step.type === ON_SITE
    ? (get(slots[0], 'address.fullAddress') || '')
    : (get(slots[0], 'meetingLink') || '');

  const openUrl = async (add: string) => (slots[0].step.type === ON_SITE
    ? Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${add}`)
    : Linking.openURL(add)
  );

  return (
    <>
      <Text style={styles.date}>{CompaniDate(slots[0].startDate).format(DAY_D_MONTH)}</Text>
      <FlatList horizontal ItemSeparatorComponent={() => <View style={styles.separator} />} data={slots}
        keyExtractor={item => item._id} renderItem={({ item }) => hoursItem(item)} />
      {!!location && (
        <TouchableOpacity onPress={() => openUrl(location)}>
          <Text style={styles.location}>{location}</Text>
        </TouchableOpacity>)}
    </>
  );
};

export default LiveInfoItem;
