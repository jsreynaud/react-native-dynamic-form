import React, { PureComponent } from 'react';
import {
  View,
  TextInput,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  textPrimary,
  error,
  iconDark,
  placeholderTextColor,
} from '../../../config/colors';
import createStyle from './styles';

export default class CustomInput extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    showBorder: PropTypes.bool,
    fontSize: PropTypes.number,
    icon: PropTypes.string,
    onChangeText: PropTypes.func,
    onChangeTextWithNewValue: PropTypes.func,
    validation: PropTypes.func,
    style: PropTypes.any,
    value: PropTypes.any,
    masked: PropTypes.bool,
    label: PropTypes.string,
    multiline: PropTypes.bool,
    error: PropTypes.bool,
    password: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    icon: '',
    onChangeText: null,
    onChangeTextWithNewValue: null,
    validation: () => {},
    style: {},
    value: null,
    masked: false,
    showBorder: true,
    fontSize: 16,
    label: '',
    multiline: false,
    error: false,
    password: false,
    placeholder: '',
  };

  state = {
    multiLineStyle: {},
  };

  getValue = () => {
    return this.state.value;
  };

  setValue = (value) => {
    this.setState({ value });
  };

  isValid = () => {
    return this.props.validation(this.getValue());
  };

  clear = () => {
    this.setState({ value: '' });
    this.clearError();
  };

  clearError = () => {
    this.setState({ error: false });
  };

  calculateInputHeight = (event) => {
    if (this.props.multiline) {
      this.setState({
        multiLineStyle: {
          height: event.nativeEvent.contentSize.height,
        },
      });
    }
  };

  render() {
    const styles = createStyle(
      this.props.fontSize,
      this.state.error,
      this.props.icon,
      this.props.disabled,
      this.props.showBorder,
      this.props.multiline,
      this.props.error,
    );

    return (
      <View style={styles.container}>
        {
          this.props.label
          ?
            <Text style={styles.label}>
              {this.props.label}
            </Text>
            :
            null
        }
        {
          this.props.error
          ?
            <Text style={styles.error}>
              Required
            </Text>
            :
            null
        }
        <TextInput
          editable={!this.props.disabled}
          {...this.props}
          onChangeText={(input) => {
            let value;
            if (this.props.onChangeTextWithNewValue) {
              value = this.props.onChangeTextWithNewValue(input);
            } else {
              value = input;
            }
            this.setState({ value }, () => {
              if (this.state.error) {
                this.setState({
                  error: !this.isValid(),
                });
              }
            });
            if (this.props.onChangeText) {
              this.props.onChangeText(value);
            }
          }}
          onContentSizeChange={this.calculateInputHeight}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.state.error ? error : placeholderTextColor}
          selectionColor={textPrimary}
          style={[styles.inputStyle, this.props.style, this.state.multiLineStyle]}
          underlineColorAndroid="transparent"
          value={this.props.masked ? this.props.value : this.state.value || this.props.value}
          secureTextEntry={this.props.password}
        />
        {
          !!this.props.icon
          &&
          <View style={styles.iconStyle}>
            <Icon
              color={iconDark}
              name={this.props.icon}
              size={20}
            />
          </View>
        }
      </View>
    );
  }
}