import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReminderItem {
  title: string;
  date: string;
  day: string;
  isNew?: boolean;
  deleted?: boolean;
}

interface ReminderFullViewProps {
  reminders?: ReminderItem[];
  monthIndex?: number; // 0-based
  year?: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onAddReminder?: () => void;
  onDeleteReminder?: (index: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_MAP: { [key: string]: number } = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// The demo lives on Dec 5, 2026 — the highlighted "today"
const DEMO_TODAY = { day: 5, monthIndex: 11, year: 2026 };

export const ReminderFullView: React.FC<ReminderFullViewProps> = ({
  reminders = [
    { title: 'BCIT Tuition Deadline', date: 'Dec 07, 2026', day: 'Monday' },
    { title: 'Apply For EI', date: 'Dec 31, 2026', day: 'Thursday' },
  ],
  monthIndex = 11,
  year = 2026,
  onPrevMonth,
  onNextMonth,
  onAddReminder,
  onDeleteReminder,
}) => {
  // Track selected date (number)
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Selection belongs to a month — clear it when the view moves on
  useEffect(() => {
    setSelectedDate(null);
  }, [monthIndex, year]);

  // Reminders that fall inside the displayed month, keeping each one's
  // index into the full list so deletes still hit the right item
  const monthReminders = reminders
    .map((reminder, index) => {
      const match = reminder.date.match(/(\w+) (\d{1,2}), (\d{4})/);
      if (!match) return null;
      const [, monthStr, dayStr, yearStr] = match;
      if (MONTH_MAP[monthStr] !== monthIndex || parseInt(yearStr, 10) !== year) {
        return null;
      }
      return { reminder, index, day: parseInt(dayStr, 10) };
    })
    .filter(Boolean) as { reminder: ReminderItem; index: number; day: number }[];

  // Day numbers that carry a reminder in the displayed month
  const reminderDates = monthReminders.map((entry) => entry.day);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Real calendar grid for any month: leading blanks up to the first
  // weekday, then the month's days, padded out to full weeks
  const generateCalendar = () => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const cells: { date: number | null }[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({ date: null });
    for (let day = 1; day <= daysInMonth; day++) cells.push({ date: day });
    while (cells.length % 7 !== 0) cells.push({ date: null });

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  };

  const calendar = generateCalendar();
  const isTodayMonth =
    monthIndex === DEMO_TODAY.monthIndex && year === DEMO_TODAY.year;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.chevronButton} onPress={onPrevMonth} accessibilityRole="button" accessibilityLabel="Previous month">
            <MaterialCommunityIcons name="chevron-left" size={30} color={Colors.grey[300]} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{MONTH_NAMES[monthIndex]} {year}</Text>
          <TouchableOpacity style={styles.chevronButton} onPress={onNextMonth} accessibilityRole="button" accessibilityLabel="Next month">
            <MaterialCommunityIcons name="chevron-right" size={30} color={Colors.grey[300]} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysRow}>
            {daysOfWeek.map((day, index) => (
              <View key={index} style={styles.weekDayContainer}>
                <Text style={[styles.weekDayText, index === 0 && styles.sundayText]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {calendar.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarRow}>
              {week.map((item, dayIndex) => (
                <View key={dayIndex} style={styles.dateContainer}>
                  {item.date ? (
                    <TouchableOpacity
                      style={[
                        styles.dateBox,
                        // "Today" keeps its filled background in its month
                        isTodayMonth && item.date === DEMO_TODAY.day && styles.selectedDateBox,
                        // Only show border for selected date
                        item.date === selectedDate && styles.borderedDateBox,
                      ]}
                      onPress={() => setSelectedDate(item.date!)}
                    >
                      <Text style={[
                        styles.dateText,
                        item.date === selectedDate && styles.selectedDateText,
                      ]}>
                        {item.date}
                      </Text>
                      {/* Show orange dot only if this date has a reminder */}
                      {reminderDates.includes(item.date) && <View style={styles.eventDot} />}
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyDateBox} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.remindersSectionHeader}>
        <Text style={styles.remindersTitle}>Reminders</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddReminder} accessibilityRole="button" accessibilityLabel="Add reminder">
          <MaterialCommunityIcons name="plus" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.remindersCard}>
        {monthReminders.length === 0 ? (
          <Text style={styles.emptyMonthText}>
            No reminders in {MONTH_NAMES[monthIndex]} {year}.
          </Text>
        ) : (
          <View style={styles.reminderList}>
            {monthReminders.map(({ reminder, index }, position) => (
              <View key={index}>
                <View style={styles.reminderItem}>
                  <View style={styles.reminderContent}>
                    <View style={styles.reminderTitleRow}>
                      <View style={styles.titleWithIndicator}>
                        <Text style={styles.reminderTitle}>{reminder.title}</Text>
                        {/* Orange circle for new reminders */}
                        {reminder.isNew && <View style={styles.newIndicator} />}
                      </View>
                      <TouchableOpacity onPress={() => onDeleteReminder?.(index)} accessibilityRole="button" accessibilityLabel={`Delete reminder: ${reminder.title}`}>
                        <MaterialCommunityIcons name="close" size={24} color={Colors.grey[300]} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.reminderDate}>
                      {reminder.date} | {reminder.day}
                    </Text>
                  </View>
                </View>
                {position < monthReminders.length - 1 && <View style={styles.reminderDivider} />}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    gap: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    padding: 24,
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chevronButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.grey[50],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    ...Typography.contentMedium,
    color: Colors.grey[700],
  },
  calendarContainer: {
    marginBottom: 24,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDayContainer: {
    width: 41,
    alignItems: 'center',
  },
  weekDayText: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  sundayText: {
    color: Colors.grey[500],
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateBox: {
    width: 41,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.grey[50],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emptyDateBox: {
    width: 41,
    height: 50,
  },
  selectedDateBox: {
    backgroundColor: Colors.grey[100],
  },
  borderedDateBox: {
    borderWidth: 1,
    borderColor: Colors.grey[700],
  },
  dateText: {
    ...Typography.buttonText,
    color: Colors.grey[700],
  },
  selectedDateText: {
    color: Colors.grey[900],
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
  remindersCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
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
  remindersSection: {
    marginTop: 24,
  },
  remindersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    width: '100%',
  },
  remindersTitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 20,
    lineHeight: 20 * 1.05,
    color: Colors.grey[700],
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.orange[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderList: {
    gap: 16,
  },
  reminderItem: {
    gap: 4,
  },
  reminderContent: {
    flex: 1,
    gap: 4,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  reminderTitle: {
    ...Typography.buttonText,
    color: Colors.grey[900],
  },
  newIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange[400],
  },
  reminderDate: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  reminderDivider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey[50],
    marginTop: 16,
  },
  emptyMonthText: {
    ...Typography.smBody,
    color: Colors.grey[400],
    textAlign: 'center',
    paddingVertical: 8,
  },
});

export default ReminderFullView;
