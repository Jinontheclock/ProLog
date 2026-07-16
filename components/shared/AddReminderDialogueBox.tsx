import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from './Buttons';

interface AddReminderDialogueBoxProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, date: string) => void;
}

export const AddReminderDialogueBox: React.FC<AddReminderDialogueBoxProps> = ({ 
  visible, 
  onClose, 
  onAdd 
}) => {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Demo content for auto-fill
  const demoEventName = 'Test Next Week';
  const demoDate = 'Dec 05, 2026';
  
  const handleEventNameFocus = () => {
    // Auto-fill with demo content when focused
    // TODO: Commented out for this branch - remove autofill functionality
    // if (!eventName) {
    //   setEventName(demoEventName);
    //   setDate(demoDate);
    // }
  };

  const getDatePickerValue = () => {
    if (date) {
      // Parse the existing date string back to Date object
      // Handle format like "Dec 02, 2025"
      let parsedDate = new Date(date);
      
      // If direct parsing fails, try alternative parsing
      if (isNaN(parsedDate.getTime()) && date.includes(',')) {
        const parts = date.split(',');
        if (parts.length === 2) {
          const [monthDay, year] = parts;
          parsedDate = new Date(`${monthDay.trim()}, ${year.trim()}`);
        }
      }
      
      return !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    }
    return new Date();
  };

  if (!visible) return null;

  const handleDateSelect = (selectedDate: Date) => {
    // Use manual formatting to avoid locale issues on mobile
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[selectedDate.getMonth()];
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();
    // Use padStart to ensure consistent formatting like "Dec 02, 2025"
    const formatted = `${month} ${day.toString().padStart(2, '0')}, ${year}`;
    setDate(formatted);
    setShowDatePicker(false);
  };

  const handleAdd = () => {
    if (eventName && date) {
      onAdd(eventName, date);
      setEventName('');
      setDate('');
      onClose();
    }
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity 
        style={styles.closeIcon} 
        onPress={onClose} 
        accessibilityLabel="Close"
      >
        <MaterialCommunityIcons name="close" size={20} color={Colors.grey[900]} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Add Reminder</Text>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Tap to add event name"
            placeholderTextColor={Colors.grey[300]}
            value={eventName}
            onChangeText={setEventName}
            onFocus={handleEventNameFocus}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={{
                backgroundColor: Colors.grey[50],
                borderRadius: '8px',
                paddingLeft: 16,
                paddingRight: 16,
                height: 40,
                width: '100%',
                maxWidth: 316,
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: Colors.grey[900],
                border: '1px solid #E5E5E5',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                if (!isNaN(selectedDate.getTime())) {
                  handleDateSelect(selectedDate);
                }
              }}
            />
          ) : (
            <>
              <TouchableOpacity 
                style={styles.dateInputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[
                  styles.dateInputText,
                  !date && styles.placeholderText
                ]}>
                  {date || 'dd/mm/yyyy'}
                </Text>
                <MaterialCommunityIcons 
                  name="chevron-down" 
                  size={20} 
                  color={Colors.grey[500]} 
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={getDatePickerValue()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                      handleDateSelect(selectedDate);
                    }
                    setShowDatePicker(false);
                  }}
                />
              )}
            </>
          )}
        </View>

        <Button
          text="Add"
          variant="primary"
          onPress={handleAdd}
          centered={true}
          customStyle={styles.addButton}
          disabled={!eventName || !date}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 353,
    // height: 352,
    paddingVertical: 24,
    paddingHorizontal: 18.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 2,
  },
  content: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Typography.competencyTitle,
    color: Colors.grey[900],
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    ...Typography.contentTitle,
    color: Colors.grey[500],
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.grey[50],
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    width: 316,
    ...Typography.bigBody,
    color: Colors.grey[900],
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    width: 316,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateInput: {
    flex: 1,
    ...Typography.bigBody,
    color: Colors.grey[900],
  },
  dateInputText: {
    flex: 1,
    ...Typography.bigBody,
    color: Colors.grey[900],
  },
  placeholderText: {
    color: Colors.grey[300],
  },
  datePickerWrapper: {
    marginTop: 8,
  },
  addButton: {
    width: 197,
    height: 40,
    borderRadius: 30,
    marginTop: 10,
  },
});

export default AddReminderDialogueBox;
