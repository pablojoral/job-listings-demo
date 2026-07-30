/** @format */

import { memo } from "react";
import { View } from "react-native";

import { CompanyLogo } from "components/CompanyLogo/CompanyLogo";
import { Icon } from "components/Icon/Icon";
import { Tag } from "components/Tag/Tag";
import { Text } from "components/Text/Text";
import type { Job } from "models/models";

import { useJobCard } from "./hooks/useJobCard";
import { useJobCardTheme } from "./theme/useJobCardTheme";

interface JobCardProps {
  job: Job;
}

/**
 * Memoized: rendered per FlatList row, and `job` objects keep stable
 * references from the query cache, so shallow prop comparison skips
 * re-rendering untouched rows when the list re-renders (e.g. on filter
 * changes).
 */
export const JobCard = memo(({ job }: JobCardProps) => {
  const { postedDate } = useJobCard(job);
  const { styles } = useJobCardTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <CompanyLogo url={job.companyLogoUrl || job.companyLogo} />
        <View style={styles.headerText}>
          <Text size="font-size-lg" weight="font-weight-semibold">
            {job.title}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Icon name="building" size="icon-size-xs" color="font-secondary" />
        <Text color="font-secondary" size="font-size-sm">
          {job.companyName}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Icon name="map-pin" size="icon-size-xs" color="font-secondary" />
        <Text color="font-secondary" size="font-size-sm">
          {job.candidateRequiredLocation}
        </Text>
      </View>

      {postedDate ? (
        <Text color="font-secondary" size="font-size-xs">
          {postedDate}
        </Text>
      ) : null}

      <View style={styles.tagsRow}>
        <Tag label={job.category} />
        {job.jobType ? <Tag label={job.jobType} /> : null}
      </View>
    </View>
  );
});
