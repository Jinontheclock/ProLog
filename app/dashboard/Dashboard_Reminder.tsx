import { AddReminderDialogueBox } from '@/components/shared/AddReminderDialogueBox';
import { DeleteReminderDialogue } from '@/components/shared/DeleteReminderDialogue';
import { ReminderFullView } from '@/components/shared/ReminderFullView';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/design-tokens';
import { CommonStyles } from '@/lib/common-styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReminderItem {
  title: string;
  date: string;
  day: string;
  isNew?: boolean;
  deleted?: boolean;
}

const DEFAULT_REMINDERS: ReminderItem[] = [
  { title: 'BCIT Tuition Deadline', date: 'Dec 07, 2025', day: 'Sunday' },
  { title: 'Apply for EI', date: 'Dec 31, 2025', day: 'Wednesday' },
];

export default function DashboardReminderScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [reminderList, setReminderList] = useState<ReminderItem[]>(DEFAULT_REMINDERS);
  // Calendar view defaults to the demo month (December 2025) but can page
  // freely in both directions
  const [viewMonth, setViewMonth] = useState({ monthIndex: 11, year: 2025 });

  const stepMonth = (delta: number) => {
    setViewMonth(({ monthIndex, year }) => {
      let m = monthIndex + delta;
      let y = year;
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      return { monthIndex: m, year: y };
    });
  };

  // Helper: merge user reminders with defaults, removing deleted defaults
  function mergeReminders(userReminders: ReminderItem[]) {
    // If user deleted a default, don't show it
    const userTitles = userReminders.map((r: ReminderItem) => r.title);
    // Keep defaults not deleted, and add new user reminders
    const merged = [
      ...DEFAULT_REMINDERS.filter(def => userTitles.includes(def.title)),
      ...userReminders.filter((r: ReminderItem) => !DEFAULT_REMINDERS.some(def => def.title === r.title))
    ];
    return merged;
  }

  // Function to sort reminders by date (closest first)
  const sortRemindersByDate = (reminders: ReminderItem[]) => {
    return reminders.sort((a: ReminderItem, b: ReminderItem) => {
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

  // Load reminders from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('reminders');
        let userReminders: ReminderItem[] = [];
        if (stored) {
          userReminders = JSON.parse(stored).filter((r: ReminderItem) => !r.deleted).map((r: ReminderItem) => ({ ...r, isNew: true }));
        }
        // Always show defaults + user-added events (deleted defaults are restored)
        const merged = [
          ...DEFAULT_REMINDERS,
          ...userReminders.filter((r: ReminderItem) => !DEFAULT_REMINDERS.some(def => def.title === r.title))
        ];
        const sorted = sortRemindersByDate(merged);
        setReminderList(sorted);
      } catch (e) {
        setReminderList(DEFAULT_REMINDERS);
      }
    })();
  }, []);

  // Save reminders to AsyncStorage whenever they change
  useEffect(() => {
    // Only store user-added reminders (not defaults)
    const userReminders = reminderList.filter(r => !DEFAULT_REMINDERS.some(def => def.title === r.title));
    AsyncStorage.setItem('reminders', JSON.stringify(userReminders));
  }, [reminderList]);

  const handleAddReminder = (title: string, date: string) => {
    // More explicit date parsing for mobile reliability
    let parsedDate;
    
    if (date.includes(',')) {
      // Parse "Dec 02, 2025" format explicitly
      const [monthDay, yearStr] = date.split(',').map(s => s.trim());
      const [monthStr, dayStr] = monthDay.split(' ');
      
      // Map month names to numbers (0-based)
      const monthMap: {[key: string]: number} = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const monthIndex = monthMap[monthStr];
      const dayNum = parseInt(dayStr, 10);
      const yearNum = parseInt(yearStr, 10);
      
      if (monthIndex !== undefined && !isNaN(dayNum) && !isNaN(yearNum)) {
        // Use Date constructor with year, month, day parameters
        parsedDate = new Date(yearNum, monthIndex, dayNum);
      } else {
        parsedDate = new Date(date);
      }
    } else {
      parsedDate = new Date(date);
    }
    
    // Final fallback
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date();
    }
    
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parsedDate.getDay()];
    
    // Always use manual formatting for consistency
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const finalFormattedDate = `${months[parsedDate.getMonth()]} ${parsedDate.getDate().toString().padStart(2, '0')}, ${parsedDate.getFullYear()}`;
    
    const newReminder: ReminderItem = {
      title,
      date: finalFormattedDate,
      day: dayOfWeek,
      isNew: true,
    };
    const updatedList = [...reminderList, newReminder];
    const sortedList = sortRemindersByDate(updatedList);
    setReminderList(sortedList);
  };

  const handleDeleteReminder = (index: number) => {
    setPendingDeleteIndex(index);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      setReminderList(reminderList.filter((_, i) => i !== pendingDeleteIndex));
      setPendingDeleteIndex(null);
    }
    setIsDeleteModalVisible(false);
  };

  return (
    <SafeAreaView style={CommonStyles.container}>
      <Image 
        source={require('@/assets/images/background-grid 1.svg')}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />
      <ScrollView style={CommonStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Bar Spacer */}
        <View style={{ height: 47 }} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/Dashboard')} accessibilityRole="button" accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.grey[700]} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.pageTitle}>Event Calendar</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Calendar and Reminders */}
        <ReminderFullView
          reminders={reminderList.filter((r: ReminderItem) => !r.deleted)}
          monthIndex={viewMonth.monthIndex}
          year={viewMonth.year}
          onPrevMonth={() => stepMonth(-1)}
          onNextMonth={() => stepMonth(1)}
          onAddReminder={() => setIsModalVisible(true)}
          onDeleteReminder={handleDeleteReminder}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <AddReminderDialogueBox
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onAdd={handleAddReminder}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsDeleteModalVisible(false);
          setPendingDeleteIndex(null);
        }}
      >
        <DeleteReminderDialogue
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false);
            setPendingDeleteIndex(null);
          }}
          onDelete={confirmDelete}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    titleWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      pointerEvents: 'none',
    },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
     width: 40,
     height: 40,
     borderRadius: 20,
     backgroundColor: Colors.white,
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: Colors.grey[900],
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
     marginLeft: 20,
  },
  pageTitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 24,
    lineHeight: 28,
    color: Colors.grey[700],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
