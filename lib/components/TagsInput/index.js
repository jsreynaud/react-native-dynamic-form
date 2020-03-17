import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Platform
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AutoTags from "react-native-tag-autocomplete";
import LabelError from '../LabelError';

export default class TagsInput extends React.Component {

  static propTypes = {
    //data: PropTypes.array.isRequired,
    data: PropTypes.array,
    label: PropTypes.string,
    values: PropTypes.array,
    onSelect: PropTypes.func,
    searchInputPlaceholder: PropTypes.string,
    error: PropTypes.bool,
    onFilterFunc: PropTypes.func,
    tagDisable: PropTypes.string,
  };

  static defaultProps = {
    label: '',
    values: [],
    data: [],
    searchInputPlaceholder: 'Search Items...',
    onSelect: () => { },
    error: false,
    onFilterFunc: () => { },
    tagDisable: 'auto',
  };

  state = {
    tagsSelected: [],
    suggestions: this.props.data,
    text:'',
    customHeight: 150
  };

  customFilterData = query => {
    //override suggestion filter, we can search by specific attributes
    console.log("QUERY", query);
    query = query.toUpperCase();
    let searchResults = this.state.suggestions.filter(s => {
      return (
        s.fullName.toUpperCase().includes(query) ||
        s.email.toUpperCase().includes(query)
      );
    });
    return searchResults;
  };

  customRenderTags = tags => {
    //override the tags render
    //this.state.tagsSelected.map((t, i) => {
    return (
      <View style={styles.customTagsContainer}>
        {tags.map((t, i) => {
          return (
            <TouchableHighlight
              key={i}
              style={styles.customTag}
              onPress={() => this.handleDelete(i)}
            >
              <View style={{ flex: 1, flexDirection: 'row', }}>
                <Text style={{ color: "white" }}>
                  {t.name}
                </Text>
                <AntDesign style={{ color: 'white', marginTop: 3 }} name='close' />
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  customRenderSuggestion = suggestion => {
    //override suggestion render the drop down
    console.log("MY Suggestion", suggestion)
    //const name = suggestion.fullName;
    return (
      <Text>
        {suggestion.name}
      </Text>
    );
  };

  handleDelete = index => {
    //tag deleted, remove from our tags array
    let tagsSelected = this.state.tagsSelected;
    tagsSelected.splice(index, 1);
    const { onSelect } = this.props;
    console.log("DELETE", tagsSelected)
    onSelect(tagsSelected);
    this.setState({ tagsSelected });
    this.setState({ customHeight : this.state.customHeight - 50})
  };

  handleAddition = contact => {
    //suggestion clicked, push it to our tags array
    this.setState({ tagsSelected: this.state.tagsSelected.concat([contact]) }, () => {
      // propagate back to parent component
      console.log("ADD", this.state.tagsSelected);
      this.setState({text:'',
      customHeight : this.state.customHeight + 50})

      const { onSelect } = this.props;

      onSelect(this.state.tagsSelected);
    });
  };

  onCustomTagCreated = userInput => {
    //user pressed enter, create a new tag from their input
    const contact = {
      name: userInput,
      value: null
    };
    this.handleAddition(contact);
  };

  render() {
    const {
      label,
      values,
      data,
      error,
      tagDisable,
    } = this.props;
    //console.log(" MY DATA", data);
    return (
      <View style={[styles.container, { opacity: tagDisable == 'none' ? 0.7 : 1, height: Platform.OS === 'android' ? this.state.customHeight : 150 }]}>
        <LabelError
          label={label}
          error={error}
        />
        <View pointerEvents={tagDisable} style={styles.autocompleteContainer}>
          <AutoTags
            //required
            suggestions={this.state.text ? data: ""}
            tagsSelected={values}
            handleAddition={this.handleAddition}
            handleDelete={this.handleDelete}
            //optional
            placeholder=""
            //filterData={this.customFilterData}
            //filterData={this.props.onFilterFunc}
            onChangeText={text => {
              this.setState({ text: text});
              this.props.onFilterFunc(text)
            }}
            value={this.state.text}
            renderSuggestion={this.customRenderSuggestion}
            renderTags={this.customRenderTags}
            onCustomTagCreated={this.onCustomTagCreated}
            createTagOnSpace
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  customTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: "#efeaea",
    width: 300
  },
  customTag: {
    backgroundColor: "#9d30a5",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 30,
    padding: 8
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
  header: {
    backgroundColor: "#9d30a5",
    height: 80,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    marginBottom: 10
  },
  autocompleteContainer: {
    flex: 1,
    //left: 20,
    left: 0,
    position: "absolute",
    overflow: 'visible',
    right: 20,
    top: 40,
    bottom: 20,
    //marginTop:10,
    zIndex: 1
  },
  label: {
    color: "#614b63",
    fontWeight: "bold",
    marginBottom: 10
  },
  messageContainer: {
    marginTop: 160,
    height: 200,
    alignSelf: "stretch",
    marginLeft: 20,
    marginRight: 20
  },
  message: {
    backgroundColor: "#efeaea",
    height: 200,
    textAlignVertical: "top"
  }
});
