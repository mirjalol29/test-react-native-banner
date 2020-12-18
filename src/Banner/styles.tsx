import { StyleSheet, ViewStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  hide: ViewStyle;
  spaceTop: ViewStyle;
  spaceRight: ViewStyle;
  spaceBottom: ViewStyle;
  spaceLeft: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  hide: {
    minHeight: 0,
  },
  spaceTop: {
    paddingTop: 8,
  },
  spaceRight: {
    paddingRight: 8,
  },
  spaceBottom: {
    paddingBottom: 8,
  },
  spaceLeft: {
    paddingLeft: 8,
  },
});

export default styles;
