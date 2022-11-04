import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  UIManager,
} from 'react-native';

interface INativeEvent {
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
  onAdLoadSuccess?: () => void;
  onAdLazyLoadSuccess?: () => void;
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

export const AppNexusBanner: React.FC<AppNexusBannerProps> = ({
  placementId,
  sizes = [[]],
  autoRefreshInterval,
  keywords,
  onAdLoadSuccess,
  onAdLazyLoadSuccess,
  onAdLoadFail,
  onEventChange,
  allowVideo,
  reloadOnAppStateChangeIfFailed,
  onAdVisibleChange,
  customUserAgent,
  percentVisibility = 50,
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
   * Banner appearance handler in the viewport
   * @param isVisible
   */
  const onViewportChangedHandler = useCallback(
    (isVisible: number | undefined) => {
      onViewportChangedHandler && onViewportChangedHandler(isVisible);
    },
    []
  );

  /**
   * The banner was loaded successfully, we are updating the data
   * @param event
   */
  const onAdLoadSuccessHandler = useCallback(
    (event: INativeEvent) => {
      const { width, height } = event.nativeEvent;
      setBannerStyle({ width, height });

      onAdLoadSuccess && onAdLoadSuccess();
    },
    [onAdLoadSuccess]
  );

  /**
   * The banner was lazy loaded successfully, we are updating the data
   * @param event
   */
  const onAdLazyLoadSuccessHandler = useCallback(
    (event) => {
      const { width, height } = event.nativeEvent;
      setBannerStyle({ width, height });
      viewLazyAdBanner(bannerRef);

      onAdLazyLoadSuccess && onAdLazyLoadSuccess();
    },
    [onAdLazyLoadSuccess]
  );

  /**
   * Banner not loaded, hide the block
   * @param event
   */
  const onAdLoadFailHandler = useCallback(
    (event: INativeEvent) => {
      onAdLoadFail && onAdLoadFail(event.nativeEvent.error);
    },
    [onAdLoadFail]
  );

  /**
   * Banner event handler
   * @param event
   */
  const onEventChangeHandler = useCallback(
    (event: INativeEvent) => {
      onEventChange && onEventChange(event.nativeEvent.eventType);
    },
    [onEventChange]
  );

  /**
   * Banner visibility handler
   * @param event
   */
  const onAdVisibleChangeHandler = useCallback(
    (event: INativeEvent) => {
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
      onAdLazyLoadSuccess={onAdLazyLoadSuccessHandler}
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
