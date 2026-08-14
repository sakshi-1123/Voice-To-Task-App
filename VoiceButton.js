import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function VoiceButton({ isListening, onPress, disabled }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.25, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulse.setValue(1);
    }
  }, [isListening]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: isListening ? colors.recording : colors.primary },
          { transform: [{ scale: pulse }] },
          disabled && styles.disabled,
        ]}
      >
        <Ionicons name={isListening ? 'stop' : 'mic'} size={36} color="#fff" />
      </Animated.View>
      <Text style={styles.label}>
        {isListening ? 'Listening… tap to stop' : 'Tap to speak'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  button: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  disabled: { opacity: 0.5 },
  label: { marginTop: 12, color: colors.textSecondary, fontSize: 14 },
});
