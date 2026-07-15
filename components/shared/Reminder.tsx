import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from './IconButton';

interface ReminderItem {
  title: string;
  date: string;
  day: string;
  isNew?: boolean;
  deleted?: boolean;
}

interface ReminderProps {
  reminders?: ReminderItem[];
  onViewMore?: () => void;
  onHeaderPress?: () => void;
  refreshTrigger?: number; // Add this to trigger refresh
}

export const Reminder: React.FC<ReminderProps> = ({
  reminders,
  onViewMore,
  onHeaderPress,
  refreshTrigger,
}) => {
  const DEFAULT_REMINDERS: ReminderItem[] = [
    { title: 'BCIT Tuition Deadline', date: 'Dec 07, 2025', day: 'Sunday' },
    { title: 'Apply for EI', date: 'Dec 31, 2025', day: 'Wednesday' },
  ];
  const [localReminders, setLocalReminders] = useState<ReminderItem[]>(reminders ?? DEFAULT_REMINDERS);

  // Function to sort reminders by date (closest first)
  const sortRemindersByDate = (reminders: ReminderItem[]) => {
    return reminders.sort((a, b) => {
      // Use the same parsing logic for consistency
      const parseDate = (dateStr: string) => {
        if (dateStr.includes(',')) {
          const [monthDay, yearStr] = dateStr.split(',').map(s => s.trim());
          const [monthStr, dayStr] = monthDay.split(' ');
          
          const monthMap: {[key: string]: number} = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          
          const monthIndex = monthMap[monthStr];
          const dayNum = parseInt(dayStr, 10);
          const yearNum = parseInt(yearStr, 10);
          
          if (monthIndex !== undefined && !isNaN(dayNum) && !isNaN(yearNum)) {
            return new Date(yearNum, monthIndex, dayNum);
          }
        }
        return new Date(dateStr);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Load reminders function
  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem('reminders');
      let userReminders: ReminderItem[] = [];
      if (stored) {
        userReminders = JSON.parse(stored).filter((r: ReminderItem) => !r.deleted).map((r: ReminderItem) => ({ ...r, isNew: true }));
      }
      // Merge defaults and user reminders, then sort by date
      const merged = [...DEFAULT_REMINDERS, ...userReminders.filter(r => !DEFAULT_REMINDERS.some(def => def.title === r.title))];
      const sorted = sortRemindersByDate(merged);
      setLocalReminders(sorted);
    } catch (e) {
      setLocalReminders(DEFAULT_REMINDERS);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  // Refresh when refreshTrigger changes (when parent component triggers refresh)
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      loadReminders();
    }
  }, [refreshTrigger]);

  // Refresh when app becomes active (e.g., returning from dashboard)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        loadReminders();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Get current date and generate week around it
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  
  const dates = [
    { date: 31, hasEvent: false },
    { date: 1, hasEvent: false },
    { date: 2, hasEvent: false },
    { date: 3, hasEvent: false },
    { date: 4, hasEvent: false },
    { date: 5, hasEvent: false }, // Mark date 5 as having an event
    { date: 6, hasEvent: false },
  ];
  
  // Auto-select current date if it exists in the dates array, otherwise select date 5 for demo
  const autoSelectedDate = dates.find(d => d.date === currentDay) ? currentDay : 5;
  const [selectedDate, setSelectedDate] = useState<number>(autoSelectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.header} onPress={onHeaderPress}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={Colors.grey[700]} />
          <Text style={styles.headerText}>Reminder</Text>
          <IconButton
            iconComponent={<MaterialCommunityIcons name="chevron-right" size={20} color={Colors.grey[900]} />}
            variant="light"
            onPress={onHeaderPress}
            accessibilityLabel="Open event calendar"
          />
        </TouchableOpacity>
        {/* Week date cards (calendarRow) restored */}
        <View style={styles.calendarRow}>
          {dates.map((item, index) => (
            <View key={index} style={styles.dateContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedDate(item.date)}
              >
                <View
                  style={[ 
                    styles.dateBox,
                    item.date === 5 && styles.dateBoxFive,
                    selectedDate === item.date && styles.selectedDateBox,
                    item.date === currentDay && styles.todayDateBox,
                  ]}
                >
                  <Text style={[styles.dateText, item.hasEvent && styles.dateTextActive]}>
                    {item.date}
                  </Text>
                  {item.hasEvent && <View style={styles.eventDot} />}
                </View>
              </TouchableOpacity>
              <Text style={[styles.dayText, index === 0 && styles.sundayText]}>
                {daysOfWeek[index]}
              </Text>
            </View>
          ))}
        </View>
        {/* Reminder list */}
        <View style={styles.reminderList}>
          {localReminders.slice(0, 2).map((reminder, index) => (
            <View key={index} style={styles.reminderItem}>
              <View style={styles.titleRow}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                {reminder.isNew && <View style={styles.newIndicator} />}
              </View>
              <Text style={styles.reminderDate}>
                {reminder.date} | {reminder.day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.dividerLine} />
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    height: 382,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  headerText: {
    ...Typography.sectionHeader,
    color: Colors.grey[700],
    flex: 1,
  },
  chevron: {
    padding: 4,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dateContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dateBox: {
    width: 42.4,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.grey[50],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dateBoxFive: {
    backgroundColor: Colors.grey[100],
  },
  selectedDateBox: {
    borderWidth: 1,
    borderColor: Colors.grey[700],
  },
  todayDateBox: {
    backgroundColor: Colors.orange[50],
  },
  dateText: {
    ...Typography.buttonText,
    color: Colors.grey[700],
  },
  dateTextActive: {
    color: Colors.grey[700],
  },
  eventDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange[400],
  },
  dayText: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  sundayText: {
    color: Colors.error,
  },
  reminderList: {
    gap: 16,
    marginBottom: 16,
  },
  reminderItem: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  reminderTitle: {
    ...Typography.buttonText,
    color: Colors.grey[900],
    // flex: 1,
  },
  newIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.orange[400],
  },
  reminderDate: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  dividerLine: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: Colors.grey[50],
    marginBottom: 16,
  },
  viewMoreButton: {
    backgroundColor: Colors.grey[50],
    borderRadius: 20,
    alignSelf: 'stretch',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMoreText: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
});

export default Reminder;
