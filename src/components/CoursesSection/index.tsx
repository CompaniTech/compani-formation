// @ts-nocheck

import { View, Text, FlatList, StyleProp, ViewStyle } from 'react-native';
import styles from './styles';
import { CourseType, ProgramType, SubProgramType } from '../../types/CourseTypes';
import { NextSlotsStepType } from '../../types/StepTypes';
import { formatWordToPlural } from '../../core/helpers/utils';
import { IS_WEB } from '../../core/data/constants';

export const COURSE_SECTION = 'FORMATION';
export const EVENT_SECTION = 'ÉVÉNEMENT';

type CoursesSectionProps = {
  items: Array<ProgramType | CourseType | SubProgramType | NextSlotsStepType>,
  title: string,
  type?: string,
  countStyle: StyleProp<ViewStyle>
  renderItem: (item) => JSX.Element,
  renderEmptyState?: () => JSX.Element,
}

const renderSeparator = () => <View style={styles.separator} />;

const CoursesSection = ({
  items,
  title,
  type = COURSE_SECTION,
  countStyle,
  renderItem,
  renderEmptyState = () => <></>,
}: CoursesSectionProps) => {

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={[countStyle, styles.countContainer]}>
        {items.length} {formatWordToPlural(items, type).toUpperCase()}
      </Text>
      {
        items.length
          ? <FlatList horizontal data={items} keyExtractor={item => `${title}${item._id}`}
            contentContainerStyle={styles.container} renderItem={({ item }) => renderItem(item)}
            showsHorizontalScrollIndicator={IS_WEB} ItemSeparatorComponent={renderSeparator} />
          : renderEmptyState()
      }
    </>
  );
};

export default CoursesSection;
