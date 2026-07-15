import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudioPlayerProps {
  duration: string; // e.g. '5:20'
  currentTime: string; // e.g. '0:00', '1:12'
  isPlaying: boolean;
  isLoading?: boolean;
  isMuted?: boolean;
  onPlayPause: () => void;
  onMute: () => void;
  onRestart: () => void;
  progress: number; // 0~1
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  duration,
  currentTime,
  isPlaying,
  isLoading = false,
  isMuted = false,
  onPlayPause,
  onMute,
  onRestart,
  progress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Play/Pause/Loading Icon */}
        <TouchableOpacity onPress={onPlayPause} style={styles.iconButton} disabled={isLoading} accessibilityRole="button" accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}>
          {isLoading ? (
            <MaterialIcon
              name="cached"
              size={20}
              color={Colors.grey[500]}
            />
          ) : (
            <MaterialIcon
              name={isPlaying ? 'pause' : 'play_arrow'}
              size={20}
              color={Colors.grey[900]}
            />
          )}
        </TouchableOpacity>
        {/* Time Text */}
        <Text style={styles.timeText}>{currentTime} / {duration}</Text>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg} />
          <View style={[styles.progressBarFg, { width: `${progress * 100}%` }]} />
        </View>
        {/* Mute/Unmute Icon */}
        {/* <TouchableOpacity onPress={onMute} style={styles.iconButton}>
          <MaterialIcon 
            name={isMuted ? 'volume_off' : 'volume_down'} 
            size={20} 
            color={isMuted ? Colors.grey[400] : Colors.grey[900]} 
          />
        </TouchableOpacity> */}
        {/* Restart Icon */}
        <TouchableOpacity onPress={onRestart} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Restart audio">
          <MaterialIcon 
            name="restart" 
            size={20} 
            color={Colors.grey[900]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // width: 353,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light, // 보더그레이
    paddingHorizontal: 24,
    paddingVertical: 0,
    // marginBottom: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 간격 줄임
    paddingHorizontal: 0,
  },
  iconButton: {
    padding: 0, // 아이콘 주변 패딩 최소화
    marginHorizontal: 0,
  },
  timeText: {
    ...Typography.captionLight,
    color: Colors.grey[600],
    minWidth: 60, // 숫자 영역 줄임
    textAlign: 'left', // 왼쪽 정렬
    marginLeft: 4, // 왼쪽으로 이동
    marginRight: 0,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    justifyContent: 'center',
    marginHorizontal: 4, // 간격 줄임
  },
  progressBarBg: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.grey[50],
  },
  progressBarFg: {
    position: 'absolute',
    left: 0,
    // width: 36, // 진행된 바 크기
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.grey[500],
    top: 2,
  },
});
