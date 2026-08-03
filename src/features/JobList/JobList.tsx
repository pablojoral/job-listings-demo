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
    isRefetching,
    activeFiltersCount,
    emptyState,
    filtersDoneLabel,
    isFiltersVisible,
    openFilters,
    closeFilters,
    handleRefresh,
    renderItem,
    keyExtractor,
  } = useJobListScreen();
  const { styles } = useJobListTheme();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        testID="jobs-list"
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
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" style={styles.centered} testID="jobs-loading-indicator" />
          ) : (
            <EmptyState
              icon={emptyState.icon}
              iconColor={emptyState.iconColor}
              title={emptyState.title}
              message={emptyState.message}
            />
          )
        }
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
