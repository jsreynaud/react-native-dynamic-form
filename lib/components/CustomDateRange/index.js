import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text
} from 'react-native';
import PropTypes from 'prop-types';
import DateRange from 'react-native-date-ranges';
// import DatePicker from 'react-native-datepicker';
import LabelError from '../LabelError';
import styles from './styles';

export default class CustomDateRange extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onDateChange: PropTypes.func,
    dateFormat: PropTypes.string,
    error: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    value: '',
    placeholder: '',
    onDateRangeChange: () => { },
    dateFormat: 'DD/MM/YYYY',
    error: false,
  };


  onDateRangeChange = (value) => {
    const { onDateRangeChange } = this.props;
    onDateRangeChange(value);
  }

  onCancel = () => {
    this.picker.state.showContent = false;
    this.picker.setModalVisible(false)
  };

  customButton = (onConfirm) => {
    return (
      <View style={styles.parentButton}>
        <TouchableOpacity style={styles.childButton} onPress={onConfirm}>
          <Text style={styles.textButton}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.childButton} onPress={this.onCancel}>
          <Text style={styles.textButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {
      label,
      value,
      placeholder,
      dateFormat,
      error,
      isBlockBefore
    } = this.props;

    return (
      <View>
        <LabelError
          label={label}
          theme={styles}
          error={error}
        />
        <DateRange
          ref={(ref) => this.picker = ref}
          style={styles.dateContainer}
          blockBefore={isBlockBefore}
          markText={" "}
          mode={'range'}
          placeholder={placeholder}
          leftAlign
          allowFontScaling={false}
          selectedBgColor="#357EBD"
          selectedTextColor="blue"
          dateSplitter='-'
          returnFormat={'YYYY-MM-DDTHH:mm:ss.SSS[Z]'}
          outFormat={'DD/MM/YYYY'}
          headFormat={'DD/MM/YYYY'}
          customStyles={{
            placeholderText: { fontSize: 14, color: '#424242', textAlign: 'left' },
            headerStyle: {},
            headerMarkTitle: {},
            headerDateTitle: {},
            contentInput: { borderRadius: 0 },
            contentText: { fontSize: 14, color: '#424242' },
          }}
          onConfirm={this.onDateRangeChange}
          customButton={this.customButton}
        />
      </View>
    );
  }

}
