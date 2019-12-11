import React, {useState} from 'react';
import {Query, ApolloConsumer} from 'react-apollo';
import {gql} from 'apollo-boost';
import {View, ScrollView, TouchableHighlight, FlatList} from 'react-native';

import Layout from './layout';
import {Context} from '../../usercontext';
import {
  Row,
  Icon,
  Input,
  Item,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';
import {STATIC_URL} from '../../config';
const Search = props => {
  const cuser = React.useContext(Context);
  const [searchText, setSearchText] = React.useState('');
  const [showsearchResults, setShowSearchResults] = React.useState(false);
  const handleGoToProfile = username => {
    setShowSearchResults(false);
    console.log(props);
    props.navigation.navigate('Profile', {username});
  };
  const goToHashtag = hastag => {
    setShowSearchResults(false);
    props.navigation.navigate('Hashtag', {hastag});
    console.log(props);
    // alert(hastag);
    /*     props.history.push(`/hashtag/${hastag}`); */
  };

  return (
    <Layout {...props} title="Search">
      <View style={{flexDirection: 'column', flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#ccc',
          }}>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              if (searchText != '' || searchText != ' ') {
                setShowSearchResults(true);
              } else setShowSearchResults(false);
            }}
            style={{flex: 1}}
          />
          <Icon style={{paddingRight: 10}} active name="swap" />
        </View>
        <View style={{flex: 1}}>
          {showsearchResults == true ? (
            searchText[0] == '#' ? (
              <SearchTags goToHashtag={goToHashtag} searchText={searchText} />
            ) : (
              <SearchResults
                goToProfile={handleGoToProfile}
                searchText={searchText}
              />
            )
          ) : null}
        </View>
      </View>
    </Layout>
  );
};

function SearchTags(props) {
  return (
    <Query
      query={GET_SEARCH_TAGS}
      variables={{searchtext: props.searchText.slice(1)}}>
      {({loading, error, data}) => {
        if (loading) return <Text>Loading</Text>;
        if (error) return <Text>Error</Text>;

        return (
          <View>
            {data.searchtags.length == 0 ? (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No Hashtag found
              </Text>
            ) : (
              <List style={{marginTop: 20}}>
                {data.searchtags.map(item => {
                  return (
                    <ListItem avatar>
                      <Body>
                        <TouchableHighlight
                          onPress={() => props.goToHashtag(item.hastag)}>
                          <Text>{item.hastag}</Text>
                        </TouchableHighlight>
                      </Body>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </View>
        );
      }}
    </Query>
  );
}

function SearchResults(props) {
  return (
    <Query query={GET_SEARCH_USER} variables={{searchtext: props.searchText}}>
      {({loading, error, data}) => {
        if (loading) return <Text>Loading</Text>;
        if (error) return <Text>Error</Text>;

        return (
          <View>
            {data.searchuser.length == 0 ? (
              <Text style={{textAlign: 'center', marginTop: 20}}>
                No User found
              </Text>
            ) : (
              <List style={{marginTop: 20}}>
                {data.searchuser.map(item => {
                  return (
                    <ListItem avatar>
                      <Left>
                        <Thumbnail
                          source={{
                            uri: `${STATIC_URL}${item.profileSet[0].profilePic}`,
                          }}
                        />
                      </Left>
                      <Body>
                        <TouchableHighlight
                          onPress={() => props.goToProfile(item.username)}>
                          <Text>{item.username}</Text>
                        </TouchableHighlight>
                      </Body>
                      <Right>
                        <Text note>3:43 pm</Text>
                      </Right>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </View>
        );
      }}
    </Query>
  );
}

const GET_SEARCH_USER = gql`
  query($searchtext: String!) {
    searchuser(searchtext: $searchtext) {
      username
      id
      profileSet {
        profilePic
      }
    }
  }
`;

const GET_SEARCH_TAGS = gql`
  query($searchtext: String!) {
    searchtags(searchtext: $searchtext) {
      hastag
      id
    }
  }
`;
const styles = theme => ({
  root: {
    padding: 20,
  },
  aside: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

export default Search;
