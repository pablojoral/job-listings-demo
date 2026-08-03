import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ui/ActivityIndicator/ActivityIndicator';
import { EmptyState } from 'components/ui/EmptyState/EmptyState';

import { FiltersModal } from './components/FiltersModal/FiltersModal';
import { JobListHeader } from './components/JobListHeader/JobListHeader';
import { useJobListScreen } from './hooks/useJobListScreen';
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
        <EmptyState
          icon="close"
          iconColor="font-danger"
          title="Something went wrong"
          message="We couldn't load job listings. Pull down to try again."
        />
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
            title="Job Listings"
            filtersLabel="Filters"
            activeFiltersCount={activeFiltersCount}
            onOpenFilters={openFilters}
          />
        }
        ListEmptyComponent={<EmptyState icon="search" title={emptyStateTitle} message={emptyStateMessage} />}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      />
      <FiltersModal
        visible={isFiltersVisible}
        onClose={closeFilters}
        title="Filters"
        closeLabel="Close filters"
        doneLabel={filtersDoneLabel}
      />
    </SafeAreaView>
  );
};
