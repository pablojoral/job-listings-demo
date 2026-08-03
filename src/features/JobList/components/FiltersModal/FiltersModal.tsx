import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';

import { Button } from 'components/ui/Button/Button';
import { Icon } from 'components/ui/Icon/Icon';
import { Text } from 'components/ui/Text/Text';

import { JobFilters } from '../JobFilters/JobFilters';
import { useFiltersModalTheme } from './theme/useFiltersModalTheme';

// Android's adjustResize window mode already pushes the sheet above the
// keyboard; only iOS needs KeyboardAvoidingView to pad for it.
const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : undefined;

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  doneLabel: string;
}

export const FiltersModal = ({ visible, onClose, title, closeLabel, doneLabel }: FiltersModalProps) => {
  const { styles } = useFiltersModalTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={KEYBOARD_BEHAVIOR}>
        <Pressable style={styles.backdrop} onPress={onClose} testID="filters-modal-backdrop" />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text size="font-size-lg" weight="font-weight-bold">
              {title}
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel}>
              <Icon name="close" size="icon-size-sm" color="font-secondary" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <JobFilters />
          </ScrollView>
          <View style={styles.footer}>
            <Button label={doneLabel} fullWidth onPress={onClose} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
