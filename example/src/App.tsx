import React from 'react';
import { SafeAreaView } from 'react-native';
import { AppNexusBanner } from 'react-native-banner';

export default function App() {
  return (
    <SafeAreaView>
      <AppNexusBanner placementId={'14460918'} sizes={[[300, 250]]} />
    </SafeAreaView>
  );
}
