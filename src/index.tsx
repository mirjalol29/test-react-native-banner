import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  FunctionComponent,
} from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  UIManager,
} from 'react-native';

export interface AppNexusBannerEvent {
  nativeEvent: {
    width?: number;
    height?: number;
    error?: string;
    eventType?: string;
    visible?: number;
  };
}

export type AppNexusBannerProps = {
  allowVideo?: boolean;
  autoRefreshInterval?: number;
  customUserAgent?: string | undefined;
  keywords?: object;
  percentVisibility?: number | undefined;
  placementId: string;
  reloadOnAppStateChangeIfFailed?: boolean;
  sizes: number[][];
  onAdLoadSuccess?: (event: AppNexusBannerEvent) => void;
  onAdLoadFail?: (event: string | undefined) => void;
  onEventChange?: (event: string | undefined) => void;
  onAdVisibleChange?: (event: number | undefined) => void;
};

const removeBanner = (bannerRef: any) => {
  if (bannerRef.current !== null && Platform.OS === 'ios') {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(bannerRef.current),
      UIManager.getViewManagerConfig('RCTAppNexusBanner').Commands.removeBanner,
      []
    );
  }
};

const loadAdBanner = (bannerRef: any) => {
  if (bannerRef.current !== null) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(bannerRef.current),
      UIManager.getViewManagerConfig('RCTAppNexusBanner').Commands
        .lazyLoadAdBanner,
      []
    );
  }
};

const viewLazyAdBanner = (bannerRef: any) => {
  if (bannerRef.current !== null) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(bannerRef.current),
      UIManager.getViewManagerConfig('RCTAppNexusBanner').Commands
        .viewLazyAdBanner,
      []
    );
  }
};

export const AppNexusBanner: FunctionComponent<AppNexusBannerProps> = ({
  allowVideo,
  autoRefreshInterval,
  customUserAgent,
  keywords,
  percentVisibility = 50,
  placementId,
  reloadOnAppStateChangeIfFailed,
  sizes = [[]],
  onAdLoadSuccess,
  onAdLoadFail,
  onEventChange,
  onAdVisibleChange,
  ...props
}) => {
  const bannerRef = useRef(null);
  const [bannerStyle, setBannerStyle] = useState({});

  /**
   * Initial preload banner
   */
  useEffect(() => {
    loadAdBanner(bannerRef);

    return () => {
      removeBanner(bannerRef);
    };
  }, []);

  /**
   * The banner was loaded successfully, we are updating the data
   * @param event
   */
  const onAdLoadSuccessHandler = useCallback(
    (event: AppNexusBannerEvent) => {
      const { width, height } = event.nativeEvent;
      setBannerStyle({ width, height });
      if (Platform.OS === 'android') {
        viewLazyAdBanner(bannerRef);
      }

      onAdLoadSuccess && onAdLoadSuccess(event);
    },
    [onAdLoadSuccess]
  );

  /**
   * Banner not loaded, hide the block
   * @param event
   */
  const onAdLoadFailHandler = useCallback(
    (event: AppNexusBannerEvent) => {
      onAdLoadFail && onAdLoadFail(event.nativeEvent.error);
    },
    [onAdLoadFail]
  );

  /**
   * Banner event handler
   * @param event
   */
  const onEventChangeHandler = useCallback(
    (event: AppNexusBannerEvent) => {
      onEventChange && onEventChange(event.nativeEvent.eventType);
    },
    [onEventChange]
  );

  /**
   * Banner visibility handler
   * @param event
   */
  const onAdVisibleChangeHandler = useCallback(
    (event: AppNexusBannerEvent) => {
      const { visible } = event.nativeEvent;
      if (Platform.OS === 'ios' && visible !== 0) {
        viewLazyAdBanner(bannerRef);
      }

      onAdVisibleChange && onAdVisibleChange(event.nativeEvent.visible);
    },
    [onAdVisibleChange]
  );

  /**
   * Displaying the component
   */
  return (
    <RCTAppNexusBanner
      {...props}
      ref={bannerRef}
      allowVideo={allowVideo}
      autoRefreshInterval={autoRefreshInterval}
      customUserAgent={customUserAgent}
      keywords={keywords}
      percentVisibility={percentVisibility}
      placementId={placementId}
      reloadOnAppStateChangeIfFailed={reloadOnAppStateChangeIfFailed}
      sizes={sizes}
      style={bannerStyle}
      // @ts-ignore
      onAdLoadSuccess={onAdLoadSuccessHandler}
      // @ts-ignore
      onAdLazyLoadSuccess={onAdLoadSuccessHandler}
      // @ts-ignore
      onAdLoadFail={onAdLoadFailHandler}
      // @ts-ignore
      onEventChange={onEventChangeHandler}
      // @ts-ignore
      onAdVisibleChange={onAdVisibleChangeHandler}
    />
  );
};

export default AppNexusBanner;

const RCTAppNexusBanner = requireNativeComponent<AppNexusBannerProps>(
  'RCTAppNexusBanner'
);
