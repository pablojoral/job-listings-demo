import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'components/ui/ActivityIndicator/ActivityIndicator';
import { Button } from 'components/ui/Button/Button';
import { EmptyState } from 'components/ui/EmptyState/EmptyState';
import { IconLabel } from 'components/ui/IconLabel/IconLabel';
import { JobHeader } from 'components/domain/JobHeader/JobHeader';
import { Tag } from 'components/ui/Tag/Tag';
import { Text } from 'components/ui/Text/Text';

import { useJobDetailsScreen } from './hooks/useJobDetailsScreen';
import { useJobDetailsTheme } from './theme/useJobDetailsTheme';

export const JobDetails = () => {
  const { job, isLoading, isFavorite, description, postedDate, jobTypeLabel, handleToggleFavorite, handleOpenListing } =
    useJobDetailsScreen();
  const { styles } = useJobDetailsTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ActivityIndicator size="large" style={styles.centered} testID="job-details-loading-indicator" />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState icon="search" title="Job not found" message="This listing is no longer available." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <JobHeader
          logoUrl={job.companyLogoUrl || job.companyLogo}
          title={job.title}
          titleSize="font-size-xl"
          titleWeight="font-weight-bold"
        />

        <IconLabel icon="building" label={job.companyName} />
        <IconLabel icon="map-pin" label={job.candidateRequiredLocation} />
        {job.salary ? <IconLabel icon="dollar-sign" label={job.salary} /> : null}

        {postedDate ? (
          <Text color="font-secondary" size="font-size-xs">
            {postedDate}
          </Text>
        ) : null}

        <View style={styles.tagsRow}>
          <Tag label={job.category} />
          {jobTypeLabel ? <Tag label={jobTypeLabel} /> : null}
        </View>

        <View style={styles.actionsRow}>
          <Button
            label={isFavorite ? 'Saved' : 'Save job'}
            icon="heart"
            variant={isFavorite ? 'primary' : 'secondary'}
            onPress={handleToggleFavorite}
          />
          <Button label="Open on Remotive" variant="ghost" onPress={handleOpenListing} />
        </View>

        {description ? (
          <>
            <Text size="font-size-lg" weight="font-weight-semibold">
              About this role
            </Text>
            <Text color="font-secondary" size="font-size-sm">
              {description}
            </Text>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
