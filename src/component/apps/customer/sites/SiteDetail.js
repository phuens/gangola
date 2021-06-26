import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';
import Modal from 'react-native-modal';
import {
  Container,
  Text,
  Grid,
  Row,
  Col,
  Button,
  Icon,
  Content,
  View,
  Label,
  Item,
  Input,
  Card,
  CardItem, Body, ListItem, Right
} from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import globalStyle from '../../../../styles/globalStyle';
import {
  setLoading,
  callAxios,
  handleError,
} from '../../../../redux/actions/commonActions';
import { startSetSiteStatus } from '../../../../redux/actions/siteActions';
import { default as commaNumber } from 'comma-number';
export const SiteDetail = ({
  userState,
  commonState,
  navigation,
  startSetSiteStatus,
  handleError,
}) => {
  const [site, setSite] = useState({ items: [] });
  const [currentItem, setcurrentItem] = useState({});
  const [modalIsVisible, setVisible] = useState(false);
  const [showEnableAlert, setShowEnableAlert] = useState(false);
  const [showDisableAlert, setShowDisableAlert] = useState(false);
  const [product_type, setproduct_type] = useState(undefined);


  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getSiteDetail(navigation.state.params.id);
      setproduct_type(navigation.state.params.product_type);
    }
  }, []);

  const getSiteDetail = async id => {
    try {
      const response = await callAxios(`resource/Site/${id}`);
      console.log(response.data.data)
      setSite(response.data.data);
      console.log(site.enabled)
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const closeModal = () => {
    setcurrentItem({});
    setVisible(false);
  };

  const openModal = item => {
    setcurrentItem(item);
    setVisible(true);
  };

  const extendSiteQty = () => {
    navigation.navigate('ExtendQty', {
      id: site.name,
      current_item: currentItem,
      product_type: product_type
    });
    closeModal();
  };

  const toggleDisableAlert = () => {
    setShowDisableAlert(!showDisableAlert);
  };

  const toggleEnableAlert = () => {
    setShowEnableAlert(!showEnableAlert);
  };
  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        {showDisableAlert && (
          <View style={{ width: '100%', height: '100%' }}>
            <AwesomeAlert
              show={showDisableAlert}
              showProgress={false}
              title="Disable Site"
              message="Are you sure you want to disable site"
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="No, cancel"
              confirmText="Yes, disable it"
              confirmButtonColor="#DD6B55"
              onCancelPressed={() => {
                toggleDisableAlert();
              }}
              onConfirmPressed={() => {
                toggleDisableAlert();
                const site_data = {
                  site: site.name,
                  status: 0,
                };
                startSetSiteStatus(site_data, product_type);
              }}
            />
          </View>
        )}

        {showEnableAlert && (
          <View style={{ width: '100%', height: '100%' }}>
            <AwesomeAlert
              show={showEnableAlert}
              showProgress={false}
              title="Enable Site"
              message="Are you sure you want to enable site"
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="No, cancel"
              confirmText="Yes, enable it"
              confirmButtonColor="#12793e"
              onCancelPressed={() => {
                toggleEnableAlert();
              }}
              onConfirmPressed={() => {
                toggleEnableAlert();
                const site_data = {
                  site: site.name,
                  status: 1,
                };
                startSetSiteStatus(site_data, product_type);
              }}
            />
          </View>
        )}
        <Grid style={{ marginTop: 5 }}>
          <Row
            style={{
              height: 55,
              borderBottomWidth: 1,
              borderBottomColor: 'green',
            }}>
            {site.enabled ? (
              <Col>
                <Button
                  vertical
                  transparent
                  style={{ alignSelf: 'center' }}
                  onPress={() =>
                    navigation.navigate('ExtendSite', {
                      id: site.name,
                      start_date: site.construction_start_date,
                      end_date: site.construction_end_date,
                      product_type: product_type
                    })
                  }>
                  <Icon
                    name="format-text-wrapping-overflow"
                    type="MaterialCommunityIcons"
                    style={{ color: '#098fe3' }}
                  />
                  <Label style={{ color: '#098fe3' }}>Extend Date</Label>
                </Button>
              </Col>
            ) : (
                <Fragment />
              )}
            {site.enabled ? (
              <Col>
                <Button
                  vertical
                  transparent
                  style={{ alignSelf: 'center' }}
                  onPress={() => toggleDisableAlert()}>
                  <Icon
                    name="closesquareo"
                    type="AntDesign"
                    style={{ color: 'red' }}
                  />
                  <Label style={{ color: 'red' }}>Disable Site</Label>
                </Button>
              </Col>
            ) : (
                <Col>
                  <Button
                    vertical
                    transparent
                    style={{ alignSelf: 'center' }}
                    onPress={() => toggleEnableAlert()}>
                    <Icon
                      name="checksquareo"
                      type="AntDesign"
                      style={{ color: 'blue' }}
                    />
                    <Text style={{ color: 'blue' }}>Enable Site</Text>
                  </Button>
                </Col>
              )}
          </Row>

          <Content style={globalStyle.content}>
            <ScrollView>
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Site Status:</Label>
                  </Col>
                  <Col size={2.5}>
                    {site.enabled ? (
                      <Text style={{ alignSelf: "flex-start", color: "green" }}>Active</Text>
                    ) : (
                        <Text style={{ alignSelf: "flex-start", color: "red" }}>In Active</Text>
                      )}


                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Site ID:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.name}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Site Type:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.site_type}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Const. Type:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.construction_type}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Start Date:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{moment(site.extension_start_date)
                      .format('Do MMM YYYY')
                      .toString()}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >End Date:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{moment(site.extension_till_date)
                      .format('Do MMM YYYY')
                      .toString()}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >No. of Floors:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.number_of_floors}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Approval No.:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.approval_no}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Dzongkhag:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.dzongkhag}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Plot/Thram No.:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.plot_no}</Text>
                  </Col>
                </Row>
              </ListItem>

              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Location:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.location}</Text>
                  </Col>
                </Row>
              </ListItem>
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Remarks:</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{site.remarks}</Text>
                  </Col>
                </Row>
              </ListItem>



              <ListItem itemDivider>
                <Row>
                  <Col size={2.6} >
                    <Label >Material</Label>
                  </Col>
                  <Col size={1} >
                    <Label >Quantity</Label>
                  </Col>
                </Row>
                <Right>
                </Right>
              </ListItem>
              {site.items.map((item, idx) => (
                <ListItem key={idx} style={globalStyle.mb50} last>
                  <Row onPress={() => openModal(item)}>
                    <Col size={3} >
                      <Text style={{ alignSelf: "flex-start" }}>{item.product_category}</Text>
                    </Col>
                    <Col size={1}>
                      <Text >{item.overall_expected_quantity.toString() + item.uom}</Text>
                    </Col>
                  </Row>
                  <Right>
                    <Button
                      info
                      vertical
                      transparent
                      onPress={() => openModal(item)}>
                      <Icon name="info" type="SimpleLineIcons" />
                    </Button>
                  </Right>
                </ListItem>

              ))}
              {/* ========Model to display the materal detail======================== */}
              <View>
                <Modal isVisible={modalIsVisible}>
                  <Content padder >
                    <Card>
                      <CardItem header bordered>
                        <Text style={globalStyle.termsText}>MATERIAL DETAIL</Text>
                      </CardItem>
                      <ScrollView>


                        <View style={{ paddingRight: 15, paddingLeft: 5 }}>
                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Material:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.product_category}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >UoM:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.uom}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Initial Qty:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.expected_quantity}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Additional Qty:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.extended_quantity}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Overall Expected Qty:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.overall_expected_quantity}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Ordered Qty:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.ordered_quantity}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Balance Qty:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.balance_quantity}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Material Src:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.branch}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Transport Mode:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.transport_mode}</Text>
                              </Col>
                            </Row>
                          </ListItem>

                          <ListItem >
                            <Row >
                              <Col size={2} >
                                <Label >Remarks:</Label>
                              </Col>
                              <Col size={2.5}>
                                <Text style={{ alignSelf: "flex-start" }}>{currentItem.remarks}</Text>
                              </Col>
                            </Row>
                          </ListItem>
                        </View>
                      </ScrollView>

                      <CardItem footer bordered>
                        {site.enabled ? (
                          <Row style={{ padding: 20 }}>
                            <Col size={5}>
                              <Button
                                block
                                info
                                style={[globalStyle.mb10, globalStyle.button]}
                                onPress={extendSiteQty}>
                                <Text>Request Additional Qty</Text>
                              </Button>
                              <Button
                                block
                                warning
                                style={[globalStyle.mb10, globalStyle.button]}
                                onPress={() => closeModal()}>
                                <Text style={{}}>Close</Text>
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                            <Fragment />
                          )}

                      </CardItem>
                    </Card>
                  </Content>
                </Modal>
              </View>
            </ScrollView>
          </Content>
        </Grid>
      </Container>
    );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = { startSetSiteStatus, handleError };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SiteDetail);
