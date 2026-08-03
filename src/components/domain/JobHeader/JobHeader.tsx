import { View } from 'react-native';

import { CompanyLogo } from 'components/domain/CompanyLogo/CompanyLogo';
import { Text } from 'components/ui/Text/Text';
import type { FontSizeToken, FontWeightToken } from 'theme/tokens';

import { useJobHeaderTheme } from './theme/useJobHeaderTheme';

interface JobHeaderProps {
  logoUrl: string;
  title: string;
  titleSize?: FontSizeToken;
  titleWeight?: FontWeightToken;
}

/** A job's logo + title header row, shared by the card and the details screen. */
export const JobHeader = ({
  logoUrl,
  title,
  titleSize = 'font-size-lg',
  titleWeight = 'font-weight-semibold',
}: JobHeaderProps) => {
  const { styles } = useJobHeaderTheme();

  return (
    <View style={styles.container}>
      <CompanyLogo url={logoUrl} />
      <View style={styles.titleText}>
        <Text size={titleSize} weight={titleWeight}>
          {title}
        </Text>
      </View>
    </View>
  );
};
