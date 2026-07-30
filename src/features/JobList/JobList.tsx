import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ActivityIndicator/ActivityIndicator';

import { FiltersModal } from './components/FiltersModal/FiltersModal';
import { JobListHeader } from './components/JobListHeader/JobListHeader';
import { JobsEmptyState } from './components/JobsEmptyState/JobsEmptyState';
import { JobsErrorState } from './components/JobsErrorState/JobsErrorState';
import { useJobListScreen } from './hooks/useJobListScreen';
import { useJobListStrings } from './hooks/useJobListStrings';
import { useJobListTheme } from './theme/useJobListTheme';

export const JobList = () => {
  const {
    jobs,
    isLoading,
    isError,
    isRefetching,
    activeFiltersCount,
    emptyStateTitle,
    emptyStateMessage,
    filtersDoneLabel,
    isFiltersVisible,
    openFilters,
    closeFilters,
    handleRefresh,
    renderItem,
    keyExtractor,
  } = useJobListScreen();
  const strings = useJobListStrings();
  const { styles } = useJobListTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.centered} testID="jobs-loading-indicator" />
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
          <JobListHeader
            title={strings.screenTitle}
            filtersLabel={strings.filtersButtonLabel}
            activeFiltersCount={activeFiltersCount}
            onOpenFilters={openFilters}
          />
        }
        ListEmptyComponent={<JobsEmptyState title={emptyStateTitle} message={emptyStateMessage} />}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      />
      <FiltersModal
        visible={isFiltersVisible}
        onClose={closeFilters}
        title={strings.filtersTitle}
        closeLabel={strings.filtersCloseLabel}
        doneLabel={filtersDoneLabel}
      />
    </SafeAreaView>
  );
};
