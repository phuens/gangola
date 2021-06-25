import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Config from 'react-native-config';
import {
  Container,
  Text,
  Body,
  Right,
  Icon,
  Button,
  List,
  ListItem,
  Content,
} from 'native-base';

import SpinnerScreen from '../../../base/SpinnerScreen';
import {
  callAxios,
  setLoading,
  handleError,
} from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import {FlatList} from 'react-native-gesture-handler';
import {NavigationEvents} from 'react-navigation';
import {SafeAreaView, ScrollView, RefreshControl} from 'react-native';
export const ListSite = ({
  userState,
  commonState,
  navigation,
  setLoading,
  handleError,
}) => {
  const [sites, setsites] = useState([]);
  const [reload, setReload] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const _refresh = React.useCallback(() => {
    wait(20).then(() => setRefreshing(false));
    getActiveSites();
  }, [refreshing]);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getActiveSites();
    }
  }, [reload]);

  const renderItem = ({item}) => {
    return (
      <List>
        <ListItem
          thumbnail
          onPress={() =>
            navigation.navigate('SiteDetail', {
              id: item.name,
              product_type: Config.sand_product_category,
            })
          }>
          <Icon
            style={globalStyles.homeIcon}
            name="check"
            type="SimpleLineIcons"
          />
          <Body>
            {item.enabled ? (
              <Text>{item.construction_type}</Text>
            ) : (
              <Text>{item.construction_type}</Text>
            )}
            <Text note numberOfLines={1}>
              Site ID : {item.name}
            </Text>
            <Text note numberOfLines={1}>
              Location : {item.location}
            </Text>
          </Body>
          <Right>
            {item.enabled ? (
              <Text style={{alignSelf: 'flex-start', color: 'green'}}>
                Active
              </Text>
            ) : (
              <Text style={{alignSelf: 'flex-start', color: 'red'}}>
                In Active
              </Text>
            )}
          </Right>
        </ListItem>
      </List>
    );
  };

  const getActiveSites = async () => {
    const params = {
      fields: JSON.stringify([
        'name',
        'location',
        'construction_type',
        'enabled',
      ]),
      filters: JSON.stringify([
        ['user', '=', userState.login_id],
        ['product_category', '=', Config.sand_product_category],
      ]),
    };
    try {
      const response = await callAxios(
        'resource/Site?order_by=enabled%20desc,creation%20desc',
        'GET',
        params,
      );
      setsites(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container style={globalStyles.listContent}>
      <Button
        info
        style={globalStyles.mb10}
        onPress={() => navigation.navigate('AddSite')}>
        <Text>Add New Site</Text>
        <Icon name="add-to-list" type="Entypo" />
      </Button>

      <NavigationEvents
        onWillFocus={_ => {
          setReload(1);
        }}
        onWillBlur={_ => {
          setReload(0);
        }}
      />
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <ScrollView
        contentContainerStyle={globalStyles.container}
        refreshControl={
          <RefreshControl
            colors={['#689F38', '#9Bd35A']}
            refreshing={refreshing}
            onRefresh={_refresh}
          />
        }>
        <Content>
          {sites.length > 0 ? (
            <FlatList
              data={sites}
              renderItem={renderItem}
              keyExtractor={item => item.name}
            />
          ) : (
            <Text style={globalStyles.emptyString}>No approved site yet</Text>
          )}
        </Content>
      </ScrollView>
      {/* </SafeAreaView> */}
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  setLoading,
  handleError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListSite);
