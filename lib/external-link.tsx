import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PendingLink = { url: string; site: string };

// Everything in the demo that points outside the app funnels through here:
// a confirm sheet first, then the site opens in a fresh browser window
// (window.open on web breaks out of the portfolio iframe).
const ExternalLinkContext = createContext<(url: string, site: string) => void>(
  () => {}
);

export const useExternalLink = () => useContext(ExternalLinkContext);

export function ExternalLinkProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingLink | null>(null);

  const request = useCallback((url: string, site: string) => {
    setPending({ url, site });
  }, []);

  const openNow = () => {
    if (!pending) return;
    if (Platform.OS === 'web') {
      window.open(pending.url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(pending.url).catch(() => {});
    }
    setPending(null);
  };

  return (
    <ExternalLinkContext.Provider value={request}>
      {children}
      <Modal
        visible={!!pending}
        transparent
        animationType="fade"
        onRequestClose={() => setPending(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setPending(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.card}
          >
            <View style={styles.iconBadge}>
              <MaterialIcon name="open_in_new" size={22} color={Colors.orange[500]} />
            </View>
            <Text style={styles.title}>Leaving ProLog</Text>
            <Text style={styles.body}>
              You're about to open {pending?.site} in a new browser window.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPending(null)}
                accessibilityRole="button"
                accessibilityLabel="Stay in the app"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.openButton}
                onPress={openNow}
                accessibilityRole="button"
                accessibilityLabel={`Open ${pending?.site} in a new window`}
              >
                <Text style={styles.openText}>Open site</Text>
                <MaterialIcon name="open_in_new" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ExternalLinkContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 44, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.orange[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    ...Typography.contentMedium,
    color: Colors.grey[900],
  },
  body: {
    ...Typography.smBody,
    color: Colors.grey[500],
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 30,
    backgroundColor: Colors.grey[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    ...Typography.buttonText,
    color: Colors.grey[700],
  },
  openButton: {
    flex: 1.4,
    height: 42,
    borderRadius: 30,
    backgroundColor: Colors.orange[400],
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openText: {
    ...Typography.buttonText,
    color: Colors.white,
  },
});
