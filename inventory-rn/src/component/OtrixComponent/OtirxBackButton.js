import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { back } from '@common';

function BackButton() {
  return (
    <View style={styles.backRound}>
      <Image source={back} style={styles.backButton} />
    </View>
  );
}

export default React.memo(BackButton);

const styles = StyleSheet.create({
  backRound: {
    justifyContent: 'center',
    alignItems: 'center',
    height: _roundDimensions()._height * 0.042,
    width: _roundDimensions()._height * 0.04,
    borderRadius: _roundDimensions()._borderRadius,
    backgroundColor: Colors.white,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 10,
  },
  backButton: {
    height: _roundDimensions()._height * 0.022,
    width: _roundDimensions()._height * 0.022,
  },
});
