import {
    textPrimary,
    placeholderTextColor,
  } from '../../../config/colors';
  
  export default {
    inputContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        height:45,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: placeholderTextColor,
      },
    input: {
      fontSize: 18,
      textAlign: 'left',
      color: textPrimary,
      paddingLeft: 10,
      opacity: 0.8,
    },
  };