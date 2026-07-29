import React from 'react';
import { View } from 'react-native';

import { Icon } from 'components/Icon/Icon';
import { Text } from 'components/Text/Text';
import type { Job } from 'models/models';

import { useJobCardTheme } from './theme/useJobCardTheme';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const { styles } = useJobCardTheme();

  return (
    <View style={styles.container}>
      <Text size="font-size-lg" weight="font-weight-semibold">
        {job.title}
      </Text>
      <Text color="font-secondary">{job.companyName}</Text>

      <View style={styles.metaRow}>
        <Icon name="map-pin" size="icon-size-xs" color="font-secondary" />
        <Text color="font-secondary" size="font-size-sm">
          {job.candidateRequiredLocation}
        </Text>
      </View>

      {job.salary ? (
        <Text color="font-brand" weight="font-weight-semibold" size="font-size-sm">
          {job.salary}
        </Text>
      ) : null}

      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text color="font-brand" size="font-size-xs" weight="font-weight-medium">
            {job.category}
          </Text>
        </View>
        {job.jobType ? (
          <View style={styles.tag}>
            <Text color="font-brand" size="font-size-xs" weight="font-weight-medium">
              {job.jobType}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
