import React from 'react';
import { SafeAreaView } from 'react-native';
import Banner from 'react-native-banner';

export default function App() {
  return (
    <SafeAreaView>
      <Banner
        placementId={'14460918'}
        space={{
          top: true,
          right: true,
          bottom: true,
          left: true,
        }}
      />
    </SafeAreaView>
  );
}
