import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import { IconLabel } from 'components/ui/IconLabel/IconLabel';
import { JobHeader } from 'components/domain/JobHeader/JobHeader';
import { Tag } from 'components/ui/Tag/Tag';
import { Text } from 'components/ui/Text/Text';
import type { Job } from 'models/Job';

import { useJobCard } from './hooks/useJobCard';
import { useJobCardTheme } from './theme/useJobCardTheme';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
}

/**
 * Memoized: rendered per FlatList row, and `job` objects keep stable
 * references from the query cache, so shallow prop comparison skips
 * re-rendering untouched rows when the list re-renders (e.g. on filter
 * changes).
 */
export const JobCard = memo(({ job, onPress }: JobCardProps) => {
  const { postedDate, jobTypeLabel, isFavorite } = useJobCard(job);
  const { styles } = useJobCardTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={job.title}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerFlex}>
          <JobHeader logoUrl={job.companyLogoUrl || job.companyLogo} title={job.title} />
        </View>
        {isFavorite ? (
          <Icon name="heart" size="icon-size-sm" color="font-brand" filled testID="favorite-indicator" />
        ) : null}
      </View>

      <IconLabel icon="building" label={job.companyName} />
      <IconLabel icon="map-pin" label={job.candidateRequiredLocation} />

      {postedDate ? (
        <Text color="font-secondary" size="font-size-xs">
          {postedDate}
        </Text>
      ) : null}

      <View style={styles.tagsRow}>
        <Tag label={job.category} />
        {jobTypeLabel ? <Tag label={jobTypeLabel} /> : null}
      </View>
    </Pressable>
  );
});
