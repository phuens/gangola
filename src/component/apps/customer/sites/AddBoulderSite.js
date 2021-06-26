import React, {useEffect, useState, Fragment} from 'react';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {View, Image, ScrollView} from 'react-native';
import moment from 'moment';
import Config from 'react-native-config';
import {Modal} from 'react-native';
import TimberSiteItemList from './TimberSiteItemList';
import {
  Container,
  Input,
  Content,
  Form,
  Picker,
  Item,
  Button,
  Text,
  Textarea,
  Card,
  CardItem,
  Icon,
  DeckSwiper,
} from 'native-base';
import {
  setLoading,
  callAxios,
  handleError,
  getImages,
} from '../../../../redux/actions/commonActions';
import {startBoulderSiteRegistration} from '../../../../redux/actions/siteActions';
import globalStyles from '../../../../styles/globalStyle';
import {getGPSLocation} from '../../../helper/Geolocation';
import SpinnerScreen from '../../../base/SpinnerScreen';

export const AddBoulderSite = ({
  userState,
  commonState,
  navigation,
  startBoulderSiteRegistration,
  handleError,
  getImages,
  setLoading,
}) => {
  //state info for forms
  const [approval_no, setapproval_no] = useState(undefined);
  const [approval_document, setapproval_document] = useState([]);
  const [construction_type, setconstruction_type] = useState(undefined);
  const [construction_start_date, setconstruction_start_date] = useState(
    undefined,
  );
  const [construction_end_date, setconstruction_end_date] = useState(undefined);
  const [number_of_floors, setnumber_of_floors] = useState(undefined);
  const [dzongkhag, setdzongkhag] = useState(undefined);
  const [plot_no, setplot_no] = useState(undefined);
  const [location, setlocation] = useState(undefined);
  const [remarks, setremarks] = useState(undefined);
  const [modalRemarks, setModalRemarks] = useState(undefined);
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [showDialog, setshowDialog] = useState(false);

  //Modal
  const [showModal, setShowModal] = useState(false);

  //all values for site
  const [all_construction_type, setall_construction_type] = useState([]);
  const [all_dzongkhag, setall_dzongkhag] = useState([]);
  const [all_sub_item, setall_sub_item] = useState([]);
  const [isBuilding, setIsBuilding] = useState(0);

  //all values for site item
  const [all_branch, setall_branch] = useState([]);
  const [product_category, setproduct_category] = useState(undefined);
  const [uom, setuom] = useState(null);
  const [branch, setBranch] = useState(undefined);
  const [expected_quantity, setexpected_quantity] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [idx, setidx] = useState(null);
  // const [remarks, setremarks] = useState(null);
  const [transport_mode, settransport_mode] = useState(undefined);
  const [allTransportMode, setAllTransportMode] = useState([]);

  //For proper navigation/auth settings
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      //get purpose, construction_type, dzongkhag
      getFormData();
    }
  }, []);

  useEffect(() => {
    if (approval_document) {
      setImages([]);
      setTimeout(() => {
        setImages(approval_document);
      }, 600);
    }
    if (product_category) {
      setItemUom(product_category);
      getAllBranch(product_category);
    } else {
      setuom(undefined);
      setall_branch([]);
    }
    setBranch(undefined);
  }, [approval_document, product_category]);

  useEffect(() => {
    settransport_mode(undefined);
    setAllTransportMode([]);
    getAllTransportMode();
  }, [branch]);
  const getIsBuilding = async id => {
    if (id !== undefined) {
      try {
        const response = await callAxios(`resource/Construction Type/${id}`);
        setIsBuilding(response.data.data.is_building);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      setIsBuilding(0);
    }
  };

  const removeImage = () => {
    setapproval_document(images.filter((_, ind) => ind > 0));
  };

  const getFormData = async () => {
    try {
      setLoading(true);
      const all_ct = await callAxios(
        'resource/Construction Type?filters=[["is_crm_item","=",1]]',
        'GET',
      );
      setall_construction_type(all_ct.data.data);
      const dz_all = await callAxios(
        'resource/Dzongkhags?filters=[["is_crm_item","=",1]]&limit_page_length=100&order_by=name',
        'get',
      );
      setall_dzongkhag(dz_all.data.data);

      getItemList();
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  //SET moment date
  const setStartDate = date => {
    setconstruction_start_date(moment(date, 'DD-MM-YYYY'));
  };

  const setEndDate = date => {
    setconstruction_end_date(moment(date, 'DD-MM-YYYY'));
  };

  //image picker
  const getSiteDocuments = async () => {
    const images = await getImages();
    setapproval_document(images);
  };

  const addItem = item => {
    setItems([...items, item]);
  };

  const removeItem = index => {
    setItems(items.filter((_, ind) => ind !== index));
  };

  const submitSiteInfo = async () => {
    const site_info = {
      approval_status: 'Pending',
      user: userState.login_id,
      construction_type,
      construction_start_date,
      construction_end_date,
      number_of_floors,
      approval_no,
      dzongkhag,
      plot_no,
      location,
      remarks,
      latitude: 0,
      longitude: 0,
      product_category,
      items,
    };

    startBoulderSiteRegistration(site_info, images, isBuilding);
  };

  const showAddItemModal = async () => {
    setshowDialog(true);
    getItemList();
  };

  const getItemList = async () => {
    const sg_all = await callAxios(
      'resource/Product Category?filters=[["is_crm_item","=",1]]&fields=["name", "uom"]',
      'GET',
    );
    setall_sub_item(sg_all.data.data);
    const actual_item = sg_all.data.data.find(
      val => val.name === Config.boulder_product_category,
    );
    setproduct_category(actual_item.name);
    setItemUom(actual_item.name);
    getAllBranch(actual_item.name);
  };

  const getAllTransportMode = async () => {
    if (branch === undefined) {
    } else {
      try {
        console.log(branch, product_category);
        const res = await callAxios(
          'method/erpnext.crm_utils.get_transport_mode',
          'post',
          {
            branch,
            product_category,
          },
        );
        setAllTransportMode(res.data.message);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const getAllBranch = async product_category => {
    try {
      const all_branches = await callAxios(
        'method/erpnext.crm_utils.get_branch_source',
        'post',
        {
          product_category: product_category,
        },
      );
      setall_branch(all_branches.data.message);
    } catch (error) {
      handleError(error);
    }
  };

  const setItemUom = item => {
    const actual_item = all_sub_item.find(val => val.name === item);
    if (actual_item) {
      setuom(actual_item.uom);
    }
  };
  const addItemToList = () => {
    if (product_category === undefined) {
      setErrorMsg('Please Select Item');
    } else if (branch === undefined || branch === null) {
      setErrorMsg('Select Source');
    } else if (transport_mode === undefined) {
      setErrorMsg('Transport mode is required');
    } else if (expected_quantity === undefined) {
      setErrorMsg('Total requirement in MT is required');
    } else if (expected_quantity < 1) {
      setexpected_quantity('');
      setErrorMsg('Total requirement in MT cannot be zero');
    } else {
      setErrorMsg('');
      const item = {
        idx,
        branch,
        product_category,
        uom,
        transport_mode,
        expected_quantity,
        remarks: modalRemarks,
      };
      addItem(item);
      resetState();
      setshowDialog(false);
    }
  };
  const resetState = () => {
    setBranch(undefined);
    setuom(undefined);
    setexpected_quantity(undefined);
    setModalRemarks(undefined);
    setall_branch([]);
    setidx(undefined);
  };

  const checkNumeric = val => {
    var isNum = isNaN(val);
    if (isNum) {
      setexpected_quantity('');
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container>
      <ScrollView>
        <Content>
          <CardItem>
            <Form>
              <View style={globalStyles.dropdown}>
                <Picker
                  mode="dropdown"
                  selectedValue={construction_type}
                  onValueChange={val => {
                    setconstruction_type(val), getIsBuilding(val);
                  }}>
                  <Picker.Item
                    label={'Select Construction Type'}
                    value={undefined}
                    key={-1}
                  />
                  {all_construction_type &&
                    all_construction_type.map((val, idx) => {
                      return (
                        <Picker.Item
                          label={val.name}
                          value={val.name}
                          key={idx}
                        />
                      );
                    })}
                </Picker>
              </View>
              <Item regular style={globalStyles.mb10}>
                <Input
                  value={approval_no}
                  onChangeText={val => setapproval_no(val)}
                  placeholder="Construction Approval No."
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>

              {isBuilding === 1 ? (
                <Item regular style={globalStyles.mb10}>
                  <Input
                    value={number_of_floors}
                    onChangeText={val => setnumber_of_floors(val)}
                    placeholder="Number of Floors"
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  />
                </Item>
              ) : (
                <Fragment />
              )}

              {isBuilding === 1 ? (
                <Item regular style={globalStyles.mb10}>
                  <Input
                    value={plot_no}
                    onChangeText={val => setplot_no(val)}
                    placeholder="Plot/Thram No."
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  />
                </Item>
              ) : (
                <Fragment />
              )}

              <Item regular style={globalStyles.mb11}>
                <DatePicker
                  style={{width: '50%'}}
                  date={construction_start_date}
                  mode="date"
                  customStyles={{dateInput: {borderWidth: 0}}}
                  placeholder="Construction Start Date"
                  format="DD-MM-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={date => setStartDate(date)}
                />
                <DatePicker
                  style={{width: '50%'}}
                  date={construction_end_date}
                  mode="date"
                  customStyles={{dateInput: {borderWidth: 0}}}
                  placeholder="Construction End Date"
                  format="DD-MM-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={date => setEndDate(date)}
                />
              </Item>
              <View style={globalStyles.dropdown}>
                <Picker
                  mode="dropdown"
                  selectedValue={dzongkhag}
                  onValueChange={val => setdzongkhag(val)}>
                  <Picker.Item
                    label={'Select Dzongkhag'}
                    value={undefined}
                    key={-1}
                  />
                  {all_dzongkhag &&
                    all_dzongkhag.map((val, idx) => {
                      return (
                        <Picker.Item
                          label={val.name}
                          value={val.name}
                          key={idx}
                        />
                      );
                    })}
                </Picker>
              </View>
              <Item regular style={globalStyles.mb10}>
                <Textarea
                  value={location}
                  rowSpan={3}
                  onChangeText={val => setlocation(val)}
                  placeholder="Location (Specific Location of Construction Site)"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>

              <Item regular style={globalStyles.mb10}>
                <Input
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                  value={remarks}
                  onChangeText={val => setremarks(val)}
                  placeholder="Remarks"
                />
              </Item>

              <Button
                info
                onPress={() => showAddItemModal()}
                style={globalStyles.mb10}>
                <Text>
                  {items.length == 0
                    ? 'Add Expected Materials'
                    : 'Add More Expected Materials'}
                </Text>
              </Button>

              <TimberSiteItemList data={items} removeItem={removeItem} />

              <Button info style={globalStyles.mb10} onPress={getSiteDocuments}>
                <Text>
                  Attach Construction approval/other relevant Documents
                </Text>
              </Button>
              {images.length === 0 ? (
                <Fragment />
              ) : (
                <View style={{height: 300, width: '100%', marginBottom: 15}}>
                  <Text style={{alignSelf: 'center', color: 'red'}}>
                    Swipe to review all images
                  </Text>
                  <DeckSwiper
                    dataSource={approval_document}
                    renderItem={image => (
                      <Card style={{elevation: 3}}>
                        <CardItem cardBody>
                          <Image
                            source={{
                              uri: image.path,
                            }}
                            style={{height: 250, width: '100%'}}
                          />
                        </CardItem>
                        <CardItem>
                          <Button
                            transparent
                            small
                            onPress={val => removeImage(val)}>
                            <Icon
                              name="delete"
                              type="AntDesign"
                              style={{color: 'red'}}
                            />
                          </Button>
                          <Text>
                            {image.path.substring(
                              image.path.lastIndexOf('/') + 1,
                            )}
                          </Text>
                        </CardItem>
                      </Card>
                    )}
                  />
                </View>
              )}
              <View style={{marginBottom: 15}} />

              <View style={{marginBottom: 15}} />
              <Button
                block
                info
                iconLeft
                success
                style={globalStyles.mb10}
                onPress={submitSiteInfo}>
                <Text>Submit for Approval</Text>
              </Button>
            </Form>
          </CardItem>

          <Modal
            animationType="slide"
            transparent={false}
            visible={showDialog}
            presentationStyle="formSheet">
            <Content style={globalStyles.content}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginBottom: 10,
                  color: Config.APP_HEADER_COLOR,
                }}>
                Add Item
              </Text>
              <View style={globalStyles.dropdown}>
                <Picker
                  mode="dropdown"
                  label={'Select Item'}
                  selectedValue={product_category}>
                  <Picker.Item
                    label={product_category}
                    value={product_category}
                    key={1}
                  />
                </Picker>
              </View>
              <Item regular style={globalStyles.mb10}>
                <Input
                  disabled
                  value={uom}
                  onChangeText={val => setuom(val)}
                  placeholder="Unit of Measurement"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>

              {product_category && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={branch}
                    onValueChange={val => setBranch(val)}>
                    <Picker.Item
                      label={'Select Source'}
                      value={undefined}
                      key={-1}
                    />
                    {all_branch &&
                      all_branch.map((val, idx) => {
                        return (
                          <Picker.Item
                            label={val.branch}
                            value={val.branch}
                            key={idx}
                          />
                        );
                      })}
                  </Picker>
                </View>
              )}

              {branch && (
                <View style={globalStyles.dropdown}>
                  <Picker
                    mode="dropdown"
                    selectedValue={transport_mode}
                    onValueChange={val => {
                      settransport_mode(val);
                    }}>
                    <Picker.Item
                      label={'Select Transport Mode'}
                      value={undefined}
                      key={-1}
                    />
                    {allTransportMode &&
                      allTransportMode.map((pur, idx) => {
                        return (
                          <Picker.Item label={pur} value={pur} key={idx} />
                        );
                      })}
                  </Picker>
                </View>
              )}

              <Item regular style={globalStyles.mb10}>
                <Input
                  value={expected_quantity}
                  onChangeText={val => {
                    setexpected_quantity(val),
                      checkNumeric(val),
                      setErrorMsg('');
                  }}
                  placeholder="Total requirement in MT"
                  keyboardType="numeric"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>
              <Item regular style={globalStyles.mb10}>
                <Input
                  value={modalRemarks}
                  onChangeText={val => setModalRemarks(val)}
                  placeholder="Remarks"
                  placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                />
              </Item>
              <Container
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  maxHeight: 50,
                }}>
                <Button success onPress={addItemToList}>
                  <Text>Add Item</Text>
                </Button>
                <Button danger onPress={() => setshowDialog(false)}>
                  <Text>Cancel</Text>
                </Button>
              </Container>
              <Container>
                <View>
                  <Text style={globalStyles.errorMsg}>{errorMsg}</Text>
                </View>
              </Container>
            </Content>
          </Modal>
        </Content>
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  startBoulderSiteRegistration,
  handleError,
  getImages,
  setLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddBoulderSite);
