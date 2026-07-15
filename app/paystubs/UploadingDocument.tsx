import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/shared/Buttons';
import { LoadingQuiz } from '@/components/shared/LoadingQuiz';
import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

export default function UploadingDocumentScreen() {
  const insets = useSafeAreaInsets();
  const appWidth = 393;
  const appHeight = 852;
  const [isLoading, setIsLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.outerContainer}>
      <Image 
        source={require('@/assets/images/background-grid 1.svg')}
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.12 }}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <View style={[styles.contentWrapper, { width: appWidth, height: appHeight, alignSelf: 'center' }]}>
          {/* Header - Only show during loading */}
          {isLoading && (
            <View style={[styles.header, { paddingTop: insets.top + 47 }]}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowExitModal(true)} accessibilityRole="button" accessibilityLabel="Go back">
                <MaterialIcon name="icon-arrow-back" size={24} color={Colors.grey[900]} />
              </TouchableOpacity>
            </View>
          )}

          {/* Main Content */}
          <View style={styles.content}>
            {isLoading ? (
              <>
                <LoadingQuiz />
                <View style={styles.tipsCard}>
                  <MaterialIcon name="lightbulb" size={20} color={Colors.grey[700]} />
                  <View style={styles.tipsTextContainer}>
                    <Text style={styles.tipsTitle}>Tips to Remember</Text>
                    <Text style={styles.tipsMessage}>If a question feels tough, eliminate the answers you know are wrong first.</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.completedCard}>
                <MaterialIcon name="celebration" size={50} color={Colors.grey[500]} />
                <Text style={styles.completedTitle}>Upload Completed!</Text>
                <Text style={styles.completedMessage}>
                  The paystub document was successfully captured and can now be viewed in the paystub records section. All the related graphs will be updated accordingly with this new info in mind!
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Button - Only show after loading */}
          {!isLoading && (
            <View style={styles.bottomWhiteBox}>
              <Button
                text="Go to Records Page"
                variant="dark"
                centered={true}
                customStyle={{ width: 353, height: 42, borderRadius: 30 }}
                onPress={() => router.push('/paystubs/PaystubList')}
              />
            </View>
          )}
        </View>
      </View>

      {/* Exit Modal */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExitModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowExitModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <MaterialIcon name="icon-close" size={24} color={Colors.grey[900]} />
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Exit the Quiz?</Text>
              <Text style={styles.modalMessage}>
                Any progress made will be lost. Do you still wish to proceed to exit quiz?
              </Text>
              
              <View style={styles.modalButtonContainer}>
                <Button
                  text="Exit"
                  variant="dark"
                  centered={true}
                  customStyle={{ width: 197, height: 40, borderRadius: 30 }}
                  onPress={() => {
                    setShowExitModal(false);
                    router.back();
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    width: 353,
    height: 104,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  tipsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    ...Typography.contentTitle,
    color: Colors.grey[900],
    marginBottom: 4,
  },
  tipsMessage: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  completedCard: {
    width: 351,
    height: 398,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    paddingHorizontal: 40,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  completedTitle: {
    ...Typography.contentMedium,
    color: Colors.grey[900],
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  completedMessage: {
    ...Typography.contentSubtitle,
    color: Colors.grey[900],
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomWhiteBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: 393,
    height: 80,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 44, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 320,
    height: 236,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    ...Typography.competencyTitle,
    color: Colors.grey[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    ...Typography.bigBody,
    color: Colors.grey[900],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
