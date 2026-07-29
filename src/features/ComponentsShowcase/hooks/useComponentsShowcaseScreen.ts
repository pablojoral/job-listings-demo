import { useCallback, useState } from 'react';

import { useComponentsShowcaseStrings } from './useComponentsShowcaseStrings';

export const useComponentsShowcaseScreen = () => {
  const [loading, setLoading] = useState(false);
  const strings = useComponentsShowcaseStrings();

  const handleToggleLoading = useCallback(() => {
    setLoading(current => !current);
  }, []);

  return { loading, handleToggleLoading, strings };
};
