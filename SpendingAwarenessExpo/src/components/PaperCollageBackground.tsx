/**
 * Paper-collage style background: layered organic shapes with a tactile,
 * torn-paper feel. Theme-aware; works in light and dark.
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Organic blob (same style as StreakVisualization/Welcome) – viewBox ~ -100 to 100
const BLOB_PATH =
  'M47.1,-78.5C60.1,-71.5,69.3,-56.8,75.8,-41.3C82.3,-25.8,86.1,-9.5,84.8,6.3C83.5,22.1,77.1,37.4,67.8,49.8C58.5,62.2,46.3,71.7,32.4,76.8C18.5,81.9,2.9,82.6,-13.2,80.8C-29.3,79,-45.9,74.7,-58.8,65.2C-71.7,55.7,-80.9,41,-84.5,25.2C-88.1,9.4,-86.1,-7.5,-79.8,-21.9C-73.5,-36.3,-62.9,-48.2,-49.9,-55.1C-36.9,-62,-21.5,-63.9,-5.8,-64.9C9.9,-65.9,34.1,-85.5,47.1,-78.5Z';

const BLOBS = [
  { size: 200, left: -60, top: -40, opacity: 0.1 },
  { size: 160, left: SCREEN_WIDTH - 100, top: 60, opacity: 0.08 },
  { size: 220, left: SCREEN_WIDTH - 200, top: SCREEN_HEIGHT * 0.32, opacity: 0.07 },
  { size: 180, left: -30, top: SCREEN_HEIGHT * 0.38, opacity: 0.09 },
  { size: 190, left: SCREEN_WIDTH * 0.15, top: SCREEN_HEIGHT - 220, opacity: 0.08 },
  { size: 140, left: SCREEN_WIDTH * 0.55, top: SCREEN_HEIGHT * 0.12, opacity: 0.06 },
];

export default function PaperCollageBackground() {
  const { colors } = useTheme();
  const fillColors = [colors.sage, colors.terracotta, colors.golden, colors.dustyRose, colors.sage, colors.terracotta];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {BLOBS.map((blob, i) => (
        <View
          key={i}
          style={[
            styles.blobWrap,
            {
              left: blob.left,
              top: blob.top,
              width: blob.size,
              height: blob.size,
              opacity: blob.opacity,
            },
          ]}
        >
          <Svg width="100%" height="100%" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
            <Path fill={fillColors[i % fillColors.length]} d={BLOB_PATH} />
          </Svg>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blobWrap: {
    position: 'absolute',
  },
});
