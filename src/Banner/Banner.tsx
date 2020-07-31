import React, { useState, FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppNexusBanner } from 'audienzz-rn-sdk';
import styles from './styles';

interface Props {
  allowVideo?: boolean;
  autoRefreshInterval?: number;
  keywords?: {
    environment: string;
  };
  lazyload?: boolean;
  onAdLoadFail?: (event: string) => any;
  onAdLoadSuccess?: () => any;
  onEventChange?: (event: any) => any;
  placementId: string;
  reloadOnAppStateChangeIfFailed?: boolean;
  sizes?: Array<Array<number>>;
  space?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

const Banner: FunctionComponent<Props> = ({
  allowVideo,
  autoRefreshInterval,
  keywords,
  lazyload,
  onAdLoadFail,
  onAdLoadSuccess,
  onEventChange,
  placementId,
  reloadOnAppStateChangeIfFailed,
  sizes,
  space,
}): JSX.Element => {
  const [loaded, setLoaded] = useState<boolean | undefined>(false);
  const bannerStyle = StyleSheet.flatten([
    space?.top && styles.spaceTop,
    space?.right && styles.spaceRight,
    space?.bottom && styles.spaceBottom,
    space?.left && styles.spaceLeft,
  ]);

  return (
    <View style={styles.mainContainer}>
      <AppNexusBanner
        allowVideo={allowVideo}
        autoRefreshInterval={autoRefreshInterval}
        keywords={keywords}
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
        placementId={String(placementId)}
        reloadOnAppStateChangeIfFailed={reloadOnAppStateChangeIfFailed}
        sizes={sizes}
        style={loaded && bannerStyle}
      />
    </View>
  );
};

Banner.defaultProps = {
  allowVideo: false,
  autoRefreshInterval: 60,
  keywords: undefined,
  lazyload: true,
  onAdLoadFail: undefined,
  onAdLoadSuccess: undefined,
  onEventChange: undefined,
  placementId: undefined,
  reloadOnAppStateChangeIfFailed: true,
  sizes: [[300, 250]],
  space: {
    top: false,
    right: false,
    bottom: false,
    left: false,
  },
};

export default React.memo(Banner, () => true);
