import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from './styles';

type pickerOptionType = {label: string, inputLabel: string, value: string}

interface NiPickerProps {
  value: string,
  options: pickerOptionType[],
  onValueChange: (value: string) => void,
}

const NiPicker: React.FC<NiPickerProps> = ({ value, options, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = options.find(c => c.value === value);

  const selectValue = (newValue: string) => {
    onValueChange(newValue); setModalVisible(false);
  };

  const itemModal = (item: pickerOptionType) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => selectValue(item.value)} >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.selectedContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedText}>{selectedItem?.inputLabel || ''}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)} >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)} >
          <View style={styles.modalContent}>
            <FlatList data={options} keyExtractor={item => item.value} renderItem={({ item }) => itemModal(item)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NiPicker;
