import { IconButton } from '@/components/shared/IconButton';
import MaterialIcon from '@/components/shared/MaterialIcon';
import { Tags } from '@/components/shared/Tags';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DetailsHeadingProps {
  onBack?: () => void;
  lineLabel: string;
  title: string;
  tag?: string;
}

export const DetailsHeading: React.FC<DetailsHeadingProps> = ({
  onBack,
  lineLabel,
  title,
  tag = 'Theoretical',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ alignSelf: 'flex-start', flex: 1 }}>
          <IconButton
            iconComponent={<MaterialIcon name="icon-arrow-back" size={24} color={Colors.grey[900]} />}
            variant="light"
            size={48}
            onPress={onBack}
            accessibilityLabel="Go back"
          />
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <Tags label={tag} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.lineLabel}>{lineLabel}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 48, // Increased top padding
    paddingBottom: 40, // Increased bottom padding
    // width: 393,
    // height: 278,
    // minHeight: 278,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // marginBottom: 16,
  },
  textContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 24,
    width: '100%',
    paddingHorizontal: 12
  },
  lineLabel: {
    ...Typography.contentSubtitle,
    color: Colors.grey[600],
    marginBottom: 8,
  },
  title: {
    ...Typography.competencyTitle,
    color: Colors.grey[900],
    // fontWeight: 'bold',
    // textAlign: 'left',
    // flexWrap: 'wrap',
    width: '100%',
    // lineHeight: 28,
    // fontSize: 28,
    // marginTop: 2,
  },
});

export default DetailsHeading;
