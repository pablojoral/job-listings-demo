import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ActivityIndicator/ActivityIndicator';
import { Button } from 'components/Button/Button';
import { Icon } from 'components/Icon/Icon';
import { Text } from 'components/Text/Text';

import { useComponentsShowcaseScreen } from './hooks/useComponentsShowcaseScreen';
import { useComponentsShowcaseTheme } from './theme/useComponentsShowcaseTheme';

export const ComponentsShowcase = () => {
  const { loading, handleToggleLoading, strings } = useComponentsShowcaseScreen();
  const { styles } = useComponentsShowcaseTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text size="font-size-xxl" weight="font-weight-bold">
          {strings.screenTitle}
        </Text>

        <View style={styles.section}>
          <Text size="font-size-lg" weight="font-weight-semibold">
            {strings.textSection}
          </Text>
          <View style={styles.card}>
            <Text size="font-size-xxl" weight="font-weight-bold">
              Title
            </Text>
            <Text size="font-size-lg" weight="font-weight-semibold">
              Subtitle
            </Text>
            <Text>{strings.sampleParagraph}</Text>
            <Text color="font-secondary" size="font-size-sm">
              Secondary, small
            </Text>
            <Text color="font-brand" weight="font-weight-semibold">
              Brand
            </Text>
            <Text color="font-danger" weight="font-weight-semibold">
              Danger
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text size="font-size-lg" weight="font-weight-semibold">
            {strings.activityIndicatorSection}
          </Text>
          <View style={styles.row}>
            <ActivityIndicator size="small" color="font-brand" />
            <ActivityIndicator size="large" color="font-brand" />
            <ActivityIndicator size="small" color="font-secondary" />
            <ActivityIndicator size="small" color="font-danger" />
          </View>
        </View>

        <View style={styles.section}>
          <Text size="font-size-lg" weight="font-weight-semibold">
            {strings.iconSection}
          </Text>
          <View style={styles.row}>
            <Icon name="search" size="icon-size-sm" />
            <Icon name="map-pin" size="icon-size-md" />
            <Icon name="chevron-down" size="icon-size-lg" />
            <Icon name="close" size="icon-size-md" color="font-danger" />
            <Icon name="search" size="icon-size-xl" color="font-brand" />
          </View>
        </View>

        <View style={styles.section}>
          <Text size="font-size-lg" weight="font-weight-semibold">
            {strings.buttonSection}
          </Text>
          <View style={styles.row}>
            <Button label={strings.primaryButtonLabel} onPress={() => {}} icon="search" />
            <Button label={strings.secondaryButtonLabel} variant="secondary" onPress={() => {}} />
            <Button label={strings.ghostButtonLabel} variant="ghost" onPress={() => {}} />
            <Button label={strings.disabledButtonLabel} onPress={() => {}} disabled />
            <Button label={strings.loadingButtonLabel} onPress={handleToggleLoading} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
