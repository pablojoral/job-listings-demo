import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ui/ActivityIndicator/ActivityIndicator';
import { EmptyState } from 'components/ui/EmptyState/EmptyState';
import { Text } from 'components/ui/Text/Text';

import { useFavoritesListScreen } from './hooks/useFavoritesListScreen';
import { useFavoritesListTheme } from './theme/useFavoritesListTheme';

export const FavoritesList = () => {
  const { jobs, isLoading, renderItem, keyExtractor } = useFavoritesListScreen();
  const { styles } = useFavoritesListTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.centered} testID="favorites-loading-indicator" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text size="font-size-xxl" weight="font-weight-bold">
            Favorites
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="No favorites yet"
            message="Tap the heart on a job to save it here."
          />
        }
      />
    </SafeAreaView>
  );
};
