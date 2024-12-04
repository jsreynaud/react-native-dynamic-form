import React, { PureComponent } from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';


export default class LabelError extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.bool,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    label: '',
    error: false,
  };

  render() {
    const { error, label, theme } = this.props;
    return (
      <View>
        {
          label
            ?
            <Text style={theme.label}>
              {label}
            </Text>
            :
            null
        }
        {
          error
            ?
            <Text style={theme.error}>
              Required
            </Text>
            :
            null
        }
      </View>
    );
  }
}
