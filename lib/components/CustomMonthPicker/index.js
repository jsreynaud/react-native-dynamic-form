import React, { Component } from 'react';
import {
  View, TouchableOpacity, Text
} from 'react-native';
import PropTypes from 'prop-types';
import LabelError from '../LabelError';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import styles from './styles';
import moment from 'moment';


export default class CustomMonthPicker extends Component {
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
    onDayLongPress: () => { },
    error: false,
  };

  state = {
    isModalVisible: false,
    currentDate: this.props.currentDate,
    displayDate: this.props.displayDate
  }

  onDayLongPress = (value) => {
    const { onDayLongPress } = this.props;
    this.setState({
      isModalVisible: false
    })
    let displayDateFormat = `${value.day}/${value.month}/${value.year}`;
    this.setState({
      displayDate: displayDateFormat
    })
    onDayLongPress(value);
  }

  getDisabledDates = (startDate, endDate, daysToDisable) => {
    const disabledDates = {};
    const start = moment(startDate);
    const end = moment(endDate);

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      if (m.date() !== 1) {
        disabledDates[m.format('YYYY-MM-DD')] = { disabled: true, disableTouchEvent: true };
      }
    }
    return disabledDates;
  };

  modalVisible = () => {
    this.setState({
      isModalVisible: true
    })
  }


  render() {
    const {
      label,
      value,
      error,
    } = this.props;

    return (
      <View>
        <LabelError
          label={label}
          theme={styles}

          error={error}
        />
        <TouchableOpacity style={styles.inputContainer}
          onPress={this.modalVisible}
        >
          <Text style={styles.input}>{this.state.displayDate}</Text>
        </TouchableOpacity>
        {
          this.state.isModalVisible ?
            <Calendar
              current={this.state.currentDate}
              onDayLongPress={this.onDayLongPress}
              markedDates={{
                ...this.getDisabledDates('2000-01-02', '3030-12-31', [0 - 6])
              }}
            /> :
            null
        }

      </View>
    );
  }

}
