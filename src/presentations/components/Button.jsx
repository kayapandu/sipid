import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const Button = ({btnText}) => {

  return (
    <TouchableOpacity style={styles.btnStyles}>
      <Text style={styles.textBtn}>{btnText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyles: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'blue',
    width: 150,
    alignItems: 'center',
    padding: 10,
  },
  textBtn: {
    color: 'blue',
  },
});

export default Button;