import React, { useState, FunctionComponent } from 'react';
import { View } from 'react-native';
import { AppNexusBanner } from 'audienzz-rn-sdk';
import styles from './styles';

interface Props {
  allowVideo?: boolean;
  autoRefreshInterval?: number;
  lazyload?: boolean;
  onAdLoadFail?: (event: string) => any;
  onAdLoadSuccess?: () => any;
  onEventChange?: (event: any) => any;
  placementId: string;
  reloadOnAppStateChangeIfFailed?: boolean;
  sizes?: Array<Array<number>>;
}

const Banner: FunctionComponent<Props> = ({
  allowVideo,
  autoRefreshInterval,
  lazyload,
  onAdLoadFail,
  onAdLoadSuccess,
  onEventChange,
  placementId,
  reloadOnAppStateChangeIfFailed,
  sizes,
}): JSX.Element => {
  const [loaded, setLoaded] = useState<boolean | undefined>(false);

  return (
    <View style={styles.mainContainer}>
      <AppNexusBanner
        allowVideo={allowVideo}
        autoRefreshInterval={autoRefreshInterval}
        lazyLoad={lazyload}
        onAdLoadFail={(event: string) => {
          setLoaded(false);
          onAdLoadFail && onAdLoadFail(event);
        }}
        onAdLoadSuccess={() => {
          setLoaded(true);
          onAdLoadSuccess && onAdLoadSuccess();
        }}
        onEventChange={(event: any) => {
          onEventChange && onEventChange(event);
        }}
        placementId={placementId}
        reloadOnAppStateChangeIfFailed={reloadOnAppStateChangeIfFailed}
        sizes={sizes}
        style={loaded && styles.banner}
      />
    </View>
  );
};

Banner.defaultProps = {
  allowVideo: false,
  autoRefreshInterval: 60,
  lazyload: true,
  onAdLoadFail: undefined,
  onAdLoadSuccess: undefined,
  onEventChange: undefined,
  placementId: undefined,
  reloadOnAppStateChangeIfFailed: true,
  sizes: [[300, 250]],
};

export default Banner;
