import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ActivityIndicator/ActivityIndicator';
import { Text } from 'components/Text/Text';

import { JobsEmptyState } from './components/JobsEmptyState/JobsEmptyState';
import { JobsErrorState } from './components/JobsErrorState/JobsErrorState';
import { useJobListScreen } from './hooks/useJobListScreen';
import { useJobListStrings } from './hooks/useJobListStrings';
import { useJobListTheme } from './theme/useJobListTheme';

export const JobList = () => {
  const { jobs, isLoading, isError, isRefetching, handleRefresh, renderItem, keyExtractor } = useJobListScreen();
  const strings = useJobListStrings();
  const { styles } = useJobListTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.centered} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <JobsErrorState title={strings.errorTitle} message={strings.errorMessage} />
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
            {strings.screenTitle}
          </Text>
        }
        ListEmptyComponent={<JobsEmptyState title={strings.emptyTitle} message={strings.emptyMessage} />}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};
