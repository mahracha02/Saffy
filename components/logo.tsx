import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ImageStyle;
}

const sizes = {
  small: {
    width: 80,
    height: 80,
  },
  medium: {
    width: 120,
    height: 120,
  },
  large: {
    width: 160,
    height: 160,
  },
};

export function Logo({ size = 'medium', style }: LogoProps) {
  const dimensions = sizes[size];

  return (
    <Image
      source={require('../assets/images/splash-icon.png')}
      style={[
        styles.logo,
        dimensions,
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    aspectRatio: 1,
  },
});
