import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import MultiSelect from 'react-native-multiple-select';

import LabelError from '../LabelError';

export default class Select extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    label: PropTypes.string,
    values: PropTypes.array,
    onSelect: PropTypes.func,
    single: PropTypes.bool,
    searchInputPlaceholder: PropTypes.string,
    error: PropTypes.bool,
    textInputProps: PropTypes.object,
    selectDropdownDisable: PropTypes.string,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    label: '',
    values: [],
    single: true,
    searchInputPlaceholder: 'Search Items...',
    onSelect: () => { },
    error: false,
    textInputProps: {},
    selectDropdownDisable: 'auto',
  };


  onSelectedItemsChange = (selectedItems) => {
    const { onSelect } = this.props;
    onSelect(selectedItems);
  }

  render() {
    const {
      label,
      values,
      data,
      single,
      searchInputPlaceholder,
      error,
      textInputProps,
      selectDropdownDisable,
      theme: {
        select: {
          tagRemoveIconColor,
          tagBorderColor,
          tagTextColor,
          selectedItemTextColor,
          selectedItemIconColor,
          itemTextColor,
          submitButtonColor,
        },
      },
    } = this.props;
    return (
      <View style={{ opacity: selectDropdownDisable == 'none' ? 0.7 : 1, }}>
        <LabelError
          label={label}
          theme={styles}
          error={error}
        />
        <View pointerEvents={selectDropdownDisable} style={{ marginTop: 10 }}>
          <MultiSelect
            hideDropdown
            hideSubmitButton
            autoFocusInput={false}
            single={single}
            items={data}
            uniqueKey="value"
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={values}
            selectText={searchInputPlaceholder != '' ? searchInputPlaceholder : "Pick Item(s)"}
            searchInputPlaceholderText={searchInputPlaceholder}
            tagRemoveIconColor={tagRemoveIconColor}
            tagBorderColor={tagBorderColor}
            tagTextColor={tagTextColor}
            selectedItemTextColor={selectedItemTextColor}
            selectedItemIconColor={selectedItemIconColor}
            itemTextColor={itemTextColor}
            displayKey="label"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor={submitButtonColor}
            submitButtonText="OK"
            textInputProps={textInputProps}
          />
        </View>
      </View>
    );
  }
}
