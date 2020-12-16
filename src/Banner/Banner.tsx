import React, { FunctionComponent, ReactElement, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AppNexusBanner } from 'audienzz-rn-sdk';
import styles from './styles';

export interface Props {
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

const Banner: FunctionComponent<Props> = (props): ReactElement => {
  const [loaded, setLoaded] = useState<boolean | undefined>(false);
  const bannerStyle = StyleSheet.flatten<ViewStyle>([
    props.space?.top && styles.spaceTop,
    props.space?.right && styles.spaceRight,
    props.space?.bottom && styles.spaceBottom,
    props.space?.left && styles.spaceLeft,
  ]);

  return (
    <View style={styles.container}>
      <AppNexusBanner
        allowVideo={props.allowVideo}
        autoRefreshInterval={props.autoRefreshInterval}
        keywords={props.keywords}
        lazyLoad={props.lazyload}
        onAdLoadFail={(event: string) => {
          setLoaded(false);
          props.onAdLoadFail && props.onAdLoadFail(event);
        }}
        onAdLoadSuccess={() => {
          setLoaded(true);
          props.onAdLoadSuccess && props.onAdLoadSuccess();
        }}
        onEventChange={(event: any) => {
          props.onEventChange && props.onEventChange(event);
        }}
        placementId={String(props.placementId)}
        reloadOnAppStateChangeIfFailed={props.reloadOnAppStateChangeIfFailed}
        sizes={props.sizes}
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
