import React, { useState, FC } from 'react';
import { AppNexusBanner } from 'audienzz-rn-sdk';
import styles from './styles';

export interface Props {
  placementId: string;
}

const Banner: FC<Props> = ({ placementId }) => {
  const [loaded, setLoaded] = useState<boolean | undefined>(false);

  const onAdLoadSuccess = () => {
    setLoaded(true);
  };

  const onAdLoadFail = () => {
    setLoaded(false);
  };

  return (
    <AppNexusBanner
      style={loaded && styles.mainContainer}
      lazyLoad={true}
      onAdLoadSuccess={onAdLoadSuccess}
      onAdLoadFail={onAdLoadFail}
      reloadOnAppStateChangeIfFailed={true}
      placementId={placementId}
      sizes={[[300, 250]]}
      autoRefreshInterval={60}
    />
  );
};

Banner.defaultProps = {
  placementId: '',
};

export default Banner;
