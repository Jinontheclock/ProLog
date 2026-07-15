import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

export default function DocumentScannerScreen() {
  const insets = useSafeAreaInsets();
  const appWidth = 393;
  const appHeight = 852;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={[styles.contentWrapper, { width: appWidth, height: appHeight, alignSelf: 'center' }]}>
          <Image 
            source={require('@/assets/images/Rectangle 12.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 47 }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
              <MaterialIcon name="icon-arrow-back" size={24} color={Colors.grey[900]} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => router.push('/paystubs/UploadingDocument')}
            >
              <Text style={styles.uploadButtonText}>Upload Doc</Text>
            </TouchableOpacity>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            <View style={styles.scanIconContainer}>
              <MaterialIcon name="document_scanner" size={48} color={Colors.white} />
            </View>
          </View>

          {/* Bottom Button */}
          <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={() => router.push('/paystubs/UploadingDocument')}
            >
              <Text style={styles.captureButtonText}>Capture Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: 120,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    ...Typography.buttonText,
    color: Colors.grey[900],
  },
  scanFrame: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 100,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.white,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.white,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.white,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.white,
    borderBottomRightRadius: 8,
  },
  scanIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  bottomContainer: {
    paddingHorizontal: 20,
    backgroundColor: Colors.grey[50],
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 20,
    width: 393,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: Colors.grey[700],
    borderRadius: 30,
    width: 353,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    ...Typography.buttonText,
    color: Colors.grey[50],
  },
});
