import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const FloatActionButton = props => {
  const {icon, customStyle} = props;
  return (
    <TouchableOpacity {...props} style={[styles.container, customStyle]}>
      <Text>{icon}</Text>
    </TouchableOpacity>
  );
};

export default FloatActionButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99,
    width: 70,
    height: 70,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
