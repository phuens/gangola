import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Icon, Button, Label, Content, Left, Right, ListItem } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import globalStyle from '../../../styles/globalStyle';
import Banner from '../../base/header/Banner';

export const BoulderAggreDashboard = ({ userState, navigation }) => {
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    }
    if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    }
  }, []);

  return (
    <Container>
      <Grid>
        <Row size={1}>
          <Col style={{ justifyContent: 'space-evenly' }}>
            <Banner />
          </Col>
        </Row>
        <Row size={1.4}>
          <Content style={globalStyle.p8}>
            <Button
              style={globalStyle.bMenu}
              onPress={() => navigation.navigate('BoulderSiteList')}
            >
              <Left>
                <Icon style={globalStyle.iconLeft} name="arrow-with-circle-right" type="Entypo" />
              </Left>
              <Label style={globalStyle.menuText}>Site Management</Label>
              <Right>
                <Icon style={globalStyle.iconRight} active name="chevron-small-right" type="Entypo" />
              </Right>
            </Button>
            <Text></Text>
            <Button
              style={globalStyle.bMenu}
              onPress={() => navigation.navigate('BoulderVehicleList')}
            >
              <Left>
                <Icon style={globalStyle.iconLeft} active name="arrow-with-circle-right" type="Entypo" />
              </Left>
              <Label style={globalStyle.menuText}>Self Vehicle</Label>
              <Right>
                <Icon style={globalStyle.iconRight} active name="chevron-small-right" type="Entypo" />
              </Right>
            </Button>
            <Text></Text>
            <Button
              onPress={() => navigation.navigate('BoulderOrderList')}
              style={globalStyle.bMenu}
            >
              <Left>
                <Icon style={globalStyle.iconLeft} active name="arrow-with-circle-right" type="Entypo" />
              </Left>
              <Label style={globalStyle.menuText}>Boulder & Aggregate Orders</Label>
              <Right>
                <Icon style={globalStyle.iconRight} active name="chevron-small-right" type="Entypo" />
              </Right>
            </Button>
          </Content>
        </Row>
      </Grid>

      <ListItem style={{ paddingTop: "20%" }}></ListItem>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BoulderAggreDashboard);
