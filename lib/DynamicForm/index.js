import React, { Component } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import _ from 'lodash';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import CustomInput from '../components/CustomInput';
import Rating from '../components/Rating';
import RadioGroup from '../components/RadioGroup';
import CheckboxGroup from '../components/CheckboxGroup';
import CustomDate from '../components/CustomDate';
import NumberSelector from '../components/NumberSelector';
import Select from '../components/Select';
import Button from '../components/Button';
import TagsInput from '../components/TagsInput';
import CustomDateRange from '../components/CustomDateRange';
import CustomMonthPicker from '../components/CustomMonthPicker';

import { getInputType } from '../util';
import { buildTheme } from '../../config/styles';
import styles from './styles';

const uiTheme = {};
const defaultTheme = buildTheme();

export default class DynamicForm extends Component {
  static propTypes = {
    form: PropTypes.array.isRequired,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    theme: PropTypes.object,
    onFormDataChange: PropTypes.func,
    submitButton: PropTypes.object,
    onFilterTags: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    theme: defaultTheme,
    onFormDataChange: () => { },
    onFilterTags: () => { },
    submitButton: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      responses: this.poupulateDefaultFormFields(),
    };
  }
  getFormElementLabel = item => (

    `${item.label} ${item.required ? '*' : ''}`
  );

  getFormElementValue = (key, element) => {
    const { responses } = this.state;
    const formAnswer = _.get(responses, key);
    if (!_.isEmpty(formAnswer)) {
      return _.get(formAnswer, 'userAnswer');
    }
    return _.get(element, 'value');
  };

  _getFormResponses = () => (
    this.state.responses
  );

  poupulateDefaultFormFields = () => {
    const { form } = this.props;
    // empty responses object
    const responses = {};
    // loop through form to populate default values
    _.each(form, (element) => {
      switch (element.type) {
        case 'radio-group':
          const selectedValue = _.find(element.values, value => (value.selected));
          if (selectedValue) {
            _.set(
              responses,
              element.key,
              {
                ...element,
                userAnswer: selectedValue.value,
              },
            );
          }
          break;
        case 'starRating':
        case 'number':
        case 'date':
        case 'text':
        case 'textarea':
          if (element.value) {
            _.set(
              responses,
              element.key,
              {
                ...element,
                userAnswer: element.value,
              },
            );
          }
          break;
        case 'select':
          const selectedValues = _.filter(element.values, value => (value.selected));
          if (!_.isEmpty(selectedValues)) {
            _.set(
              responses,
              element.key,
              {
                ...element,
                userAnswer: [],
              },
            );
            _.each(selectedValues, (value) => {
              responses[element.key].userAnswer.push(value.value);
            });
          }
          break;
        case 'tags':
          if (element.values) {
            _.set(
              responses,
              element.key,
              {
                ...element,
                userAnswer: element.values,
              },
            );
          }
          break;
        case 'checkbox-group':
          const valuesSelected = _.filter(element.values, value => (value.selected));
          if (!_.isEmpty(valuesSelected)) {
            _.set(
              responses,
              element.key,
              {
                ...element,
                userAnswer: {
                  regular: [],
                },
              },
            );
            _.each(valuesSelected, (value) => {
              responses[element.key].userAnswer.regular.push(value.value);
            });
          }
          break;
        default:
          break;
      }
    });
    return responses;
  };

  updateFormElement = (value, element) => {
    const { onFormDataChange } = this.props;
    const { responses } = this.state;
    const clonedResponses = _.cloneDeep(responses);
    const formAnswer = _.get(clonedResponses, element.key);
    if (!_.isEmpty(formAnswer)) {
      formAnswer.userAnswer = value;
    } else {
      _.set(
        clonedResponses,
        element.key,
        {
          ...element,
          userAnswer: value,
        },
      );
    }
    console.log('Data changes...');
    this.setState({
      responses: clonedResponses,
    }, () => {
      // if listener is set on form data changes,
      // propagate back to parent component
      if (onFormDataChange) {
        onFormDataChange(this.state.responses);
      }
    });
  };

  submitButtonPress = () => {
    const { action } = this.props.submitButton;
    action(this.state.responses);
  }

  renderForm = () => {
    const { form, submitButton } = this.props;
    const formElements = _.map(form, (element) => {
      const {
        key,
        type,
        subtype,
        style,
      } = element;
      const label = this.getFormElementLabel(element);
      // const hasError = errors.indexOf(key) !== -1 && this.submitTriggered;
      switch (type) {
        case 'header':
          return (
            <View key={key} style={styles.row}>
              <Header
                theme={this.props.theme}
                label={label}
                subType={subtype}
                style={style}
              />
            </View>
          );
        case 'paragraph':
          return (
            <View key={key} style={styles.row}>
              <Paragraph
                theme={this.props.theme}

                label={label}
                style={style}
              />
            </View>
          );
        case 'text':
          const moreOptions = {};
          if (element.maxlength) {
            moreOptions.maxLength = Number(element.maxlength);
          }
          return (
            <View key={key} style={styles.row}>
              <CustomInput
                theme={this.props.theme}

                {...moreOptions}
                onChangeText={(value) => {
                  this.updateFormElement(value, element);
                }}
                value={this.getFormElementValue(key, element)}
                label={label}
                keyboardType={getInputType(element.subtype)}
                validation={element.validationFunc}
                password={element.subtype === 'password'}
                placeholder={element.placeholder}
                disabled={element.disabled}
                icon={element.icon}
                masked
              />
            </View>
          );
        case 'textarea':
          const textAreaOptions = {};
          if (element.maxlength) {
            textAreaOptions.maxLength = Number(element.maxlength);
          }
          return (
            <View key={key} style={styles.row}>
              <CustomInput
                theme={this.props.theme}

                {...textAreaOptions}
                onChangeText={(value) => {
                  this.updateFormElement(value, element);
                }}
                multiline
                value={this.getFormElementValue(key, element)}
                label={label}
                keyboardType="default"
                validation={element.validationFunc}
                placeholder={element.placeholder}
                disabled={element.disabled}
              />
            </View>
          );
        case 'starRating':
          return (
            <View key={key} style={styles.row}>
              <Rating
                theme={this.props.theme}

                starCount={(() => {
                  const maxStars = element.maxStars || 5;
                  const starCount = Number(this.getFormElementValue(key, element));
                  if (isNaN(starCount)) {
                    return 0;
                  }
                  return starCount > maxStars ? 0 : starCount;
                })()}
                label={label}
                onStarRatingChange={(starCount) => {
                  this.updateFormElement(starCount, element);
                }}
                maxStars={element.maxStars}
                config={element.config}
              />
            </View>
          );
        case 'radio-group':
          const radioOptions = {};
          if (element.other) {
            radioOptions.other = element.other;
          }
          if (element.otherlabel) {
            radioOptions.otherlabel = element.otherlabel;
          }
          return (
            <View key={key} style={styles.row}>
              <RadioGroup
                theme={this.props.theme}

                {...radioOptions}
                label={label}
                options={element.values}
                value={this.getFormElementValue(key, element)}
                onRadioValueChanged={(value) => {
                  this.updateFormElement(value, element);
                }}
                disabled={element.disabled}
              />
            </View>
          );
        case 'checkbox-group':
          const checkOptions = {};
          if (element.other) {
            checkOptions.other = element.other;
          }
          if (element.otherlabel) {
            checkOptions.otherlabel = element.otherlabel;
          }
          if (element.toggle) {
            checkOptions.toggle = element.toggle;
          }
          return (
            <View key={key} style={styles.row}>
              <CheckboxGroup
                {...checkOptions}
                theme={this.props.theme}
                label={label}
                options={element.values}
                disabled={element.disabled}
                onCheckboxValueChanged={(value) => {
                  this.updateFormElement(value, element);
                }}
                value={this.getFormElementValue(key, element)}
              />
            </View>
          );
        case 'date':
          return (
            <View key={key} style={styles.row}>
              <CustomDate
                theme={this.props.theme}

                placeholder={element.placeholder}
                label={label}
                value={this.getFormElementValue(key, element)}
                onDateChange={(value) => {
                  this.updateFormElement(value, element);
                }}
                disabled={element.disabled}
                minDate={element.minDate}
                maxDate={element.maxDate}
                dateFormat={element.dateFormat}
              />
            </View>
          );
        case 'daterange':
          return (
            <View key={key} style={styles.row}>
              <CustomDateRange
                theme={this.props.theme}
                placeholder={element.searchInputPlaceholder}
                label={label}
                value={this.getFormElementValue(key, element)}
                onDateRangeChange={(value) => {
                  this.updateFormElement(value, element);
                }}
                dateRangeDisabled={element.dateRangeDisabled}
                dateFormat={element.dateFormat}
                disabled={element.disabled}
                isBlockBefore={element.blockBefore}
              />
            </View>
          );
        case 'monthPicker':
          return (
            <View key={key} style={styles.row}>
              <CustomMonthPicker
                theme={this.props.theme}
                placeholder={element.searchInputPlaceholder}
                label={label}
                value={this.getFormElementValue(key, element)}
                onDayLongPress={(value) => {
                  this.updateFormElement(value, element);
                }}
                currentDate={element.currentDate}
                displayDate={element.currentDisplayDate}
              />
            </View>
          );
        case 'tags':
          return (
            <View key={key} style={styles.row}>
              <TagsInput
                theme={this.props.theme}
                searchInputPlaceholder={element.searchInputPlaceholder}
                data={element.data}
                tagDisable={element.tagDisable}
                label={label}
                values={this.getFormElementValue(key, element)}
                onSelect={(value) => {
                  this.updateFormElement(value, element);
                }}
                //onFilterFunc={this.props.onFilterTags}
                onFilterFunc={element.filterForTags}
              />
            </View>
          );
        case 'select':
          const multiOptions = {
            single: !element.multiple,
          };
          return (
            <View key={key} style={styles.row}>
              <Select
                {...multiOptions}
                theme={this.props.theme}
                searchInputPlaceholder={element.searchInputPlaceholder}
                data={element.values}
                disabled={element.disabled}
                label={label}
                values={this.getFormElementValue(key, element)}
                onSelect={(value) => {
                  this.updateFormElement(value, element);
                }}
                textInputProps={element.textInputProps}
                selectDropdownDisable={element.selectDropdownDisable}
              />
            </View>
          );
        case 'number':
          return (
            <View key={key} style={styles.row}>
              <NumberSelector
                theme={this.props.theme}
                label={label}
                disabled={element.disabled}
                placeholder={element.placeholder}
                onNumberChanged={(value) => {
                  this.updateFormElement(value, element);
                }}
                min={element.min}
                max={element.max}
                step={element.step}
                directTextEdit={element.directTextEdit}
                value={(() => {
                  const number = Number(this.getFormElementValue(key, element));
                  if (isNaN(number)) {
                    return element.min;
                  }
                  if (number < element.min) {
                    return element.min;
                  }
                  if (number > element.max) {
                    return element.max;
                  }
                  return number;
                })()}
              />
            </View>
          );
        default:
          return null;
      }
    });
    // push submit button if specified
    if (!_.isEmpty(submitButton)) {
      const {
        label,
        buttonStyle,
        buttonTextStyle,
        disabled,
      } = submitButton;
      formElements.push(
        <View
          key="submitButton"
          style={styles.row}
        >
          <Button
            label={label}
            onPress={this.submitButtonPress}
            buttonStyle={buttonStyle}
            buttonTextStyle={buttonTextStyle}
            disabled={disabled}
          />
        </View>);
    }
    return formElements;
  };

  render() {
    return (
      <ThemeContext.Provider value={getTheme(uiTheme)}>
        <View style={[styles.container, this.props.style]}>
          <ScrollView>
            {this.renderForm()}
          </ScrollView>
        </View>
      </ThemeContext.Provider>
    );
  }
}
