import { View, Text } from 'react-native';
import { DataOptionsType } from '../../../store/attendanceSheets/slice';
import styles from './styles';
import Checkbox from '../Checkbox';

interface MultipleCheckboxListProps<T extends string[] | string[][]> {
  optionsGroups: DataOptionsType[][],
  groupTitles?: string[],
  checkedList: T,
  disabled?: boolean,
  setOptions?: (options: T) => void;
}

const MultipleCheckboxList = <T extends string[] | string[][]> ({
  optionsGroups,
  groupTitles = [],
  checkedList,
  disabled = false,
  setOptions = () => {},
}: MultipleCheckboxListProps<T>) => {
  const getArrayDepth = (value: Array<any>): 0 | 1 | 2 => {
    if (!Array.isArray(value)) return 0;
    if (Array.isArray(value[0])) return 2;
    return 1;
  };
  const onPressCheckbox = (value: string, index: number) => {
    if (getArrayDepth(checkedList) === 1) {
      const newList = [...(checkedList as string[])];
      const indexToRemove = newList.indexOf(value);
      if (indexToRemove !== -1) {
        newList.splice(indexToRemove, 1);
        setOptions(newList as T);
      } else {
        setOptions([...newList, value] as T);
      }
    } else {
      const newList = [...checkedList].map(list => [...(list || [])]);
      const indexToRemove = newList[index].indexOf(value);
      if (indexToRemove !== -1) {
        newList[index].splice(indexToRemove, 1);
        setOptions(newList as T);
      } else {
        newList[index].push(value);
        setOptions(newList as T);
      }
    }
  };

  return (
    <View style={styles.container}>
      {optionsGroups.map((options, index) => (
        <View key={index} style={styles.groupContainer}>
          <Text style={styles.groupLabel}>{groupTitles[index]}</Text>
          {options.map((item) => {
            const isChecked = getArrayDepth(checkedList) === 1
              ? (checkedList as string[]).includes(item.value as string)
              : checkedList[index].includes(item.value as string);
            return <Checkbox key={item.value} itemLabel={item.label} isChecked={isChecked} disabled={disabled}
              onPressCheckbox={() => onPressCheckbox(item.value, index)} />;
          })}
        </View>
      ))}
    </View>
  );
};

export default MultipleCheckboxList;
