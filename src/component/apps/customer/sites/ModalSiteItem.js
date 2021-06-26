import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import {
  Container,
  Input,
  Content,
  Picker,
  Item,
  Button,
  Text,
  Textarea,
  View,
  CardItem,
  CheckBox,
} from 'native-base';
import { callAxios, handleError } from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import Config from 'react-native-config';
const SiteItem = ({
  showModal,
  setShowModal,
  addItem,
  all_sub_item,
  data = null,
}) => {

  const [idx, setidx] = useState(null);
  const [branch, setBranch] = useState(undefined);
  const [product_category, setProduct_Category] = useState(Config.sand_product_category);
  const [uom, setuom] = useState('m3');
  const [expected_quantity, setexpected_quantity] = useState(null);
  const [transport_mode, settransport_mode] = useState(undefined);
  const [remarks, setremarks] = useState(null);

  const [common_pool, setcommon_pool] = useState(0);
  const [self_owned, setself_owned] = useState(0);
  const [others, setothers] = useState(0);

  const [all_branch, setall_branch] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [agreeCommonPoolTerms, setAgreeCommonPoolTerms] = useState(false);
  const [commonPoolTermsModal, setCommonPoolTermsModal] = useState(false);
  const [agreeSelfOnwedTerms, setAgreeSelfOnwedTerms] = useState(false);
  const [selfOwnedTermsModal, setSelfOwnedTermsModal] = useState(false);
  const [allTransportMode, setAllTransportMode] = useState([]);
  var commonPool = 'Common Pool';
  var selfOwned = 'Self Owned Transport';
  var othersLabel = 'Others';

  useEffect(() => {
  
    if (product_category) {
      setItemUom(product_category);
      getAllBranch(product_category);
    } else {
      setuom(undefined);
      setall_branch([]);
    }
    setexpected_quantity(undefined);
    settransport_mode(undefined);
    setBranch(undefined);
  }, [product_category]);

  useEffect(() => {
    if (branch) {
      setCommonPool(branch);
    } else {
      setcommon_pool(0);
    }
  }, [branch]);

  useEffect(() => {
    settransport_mode(undefined);
    setAllTransportMode([]);
    getAllTransportMode();
  }, [branch]);

  const getAllBranch = async sub_group => {
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

  const setCommonPool = selectedBranch => {
    const actual_branch = all_branch.find(val => val.branch === selectedBranch);
    if (actual_branch) {
      setcommon_pool(actual_branch.has_common_pool);
      setself_owned(actual_branch.allow_self_owned_transport);
      setothers(actual_branch.allow_other_transport);
    }
  };

  const resetState = () => {
    setBranch(undefined);
    // setProduct_Category(undefined);
    // setuom(undefined);
    // setall_branch([]);
    setexpected_quantity(undefined);
    settransport_mode(undefined);
    setremarks(undefined);
    setcommon_pool(undefined);
  
    setidx(undefined);
  };

  const addItemToList = () => {
    if (product_category === undefined) {
      setErrorMsg('Please Select Item');
    } else if (branch === undefined || branch === null) {
      setErrorMsg('Select Source');
    } else if (transport_mode == undefined || transport_mode === null) {
      setErrorMsg('Select Transportation Mode');
    } else if (transport_mode === commonPool && !agreeCommonPoolTerms) {
      setErrorMsg('Need to agree common pool terms and conditions');
    } else if (transport_mode === selfOwned && !agreeSelfOnwedTerms) {
      setErrorMsg('Need to agree self owned terms and conditions');
    } else if (expected_quantity === undefined) {
      setErrorMsg('Total requirement in M3 is required');
    } else if (expected_quantity < 1) {
      setexpected_quantity('');
      setErrorMsg('Total requirement in M3 cannot be zero');
    } else {
      setErrorMsg('');
      const item = {
        idx,
        branch,
        product_category,
        uom,
        expected_quantity,
        transport_mode,
        remarks,
      };
      addItem(item);
      resetState();
      setShowModal(false);
    }
  };

  const checkUncheckCommonPoolTerms = () => {
    if (agreeCommonPoolTerms == true) {
      setAgreeCommonPoolTerms(false);
    } else {
      setAgreeCommonPoolTerms(true);
    }
  };

  const checkUncheckSelfOwnedTerms = () => {
    if (agreeSelfOnwedTerms == true) {
      setAgreeSelfOnwedTerms(false);
    } else {
      setAgreeSelfOnwedTerms(true);
    }
  };
  const checkNumeric = val => {
    var isNum = isNaN(val);
    if (isNum) {
      setexpected_quantity('');
    }
  };


  const getAllTransportMode = async () => {
    if (branch === undefined) {
    } else {
      try {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_transport_mode',
          'post',
          {
            branch, 
            product_category
          },
        );
        setAllTransportMode(res.data.message);
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showModal}
      presentationStyle="formSheet"
      onRequestClose={() => setShowModal(false)}>
      <Content style={globalStyles.content}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 10,
            color: Config.APP_HEADER_COLOR,
          }}>
          {data ? 'Update Item' : 'Add Item'}
        </Text>
        <View style={globalStyles.dropdown}>
          <Picker
            mode="dropdown"
            label={'Select Item'}
            selectedValue={product_category}
            // onValueChange={val => setProduct_Category(val)}
            >
            <Picker.Item label={product_category} value={product_category} key={-1} />
            {/* {all_sub_item &&
              all_sub_item.map((val, idx) => {
                return (
                  <Picker.Item label={val.name} value={val.name} key={idx} />
                );
              })} */}
          </Picker>
        </View>

        <Item regular style={globalStyles.mb10BGGrayOut}>
          <Input
            disabled
            value={uom}
            // onChangeText={val => setuom(val)}
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
              <Picker.Item label={'Select Source'} value={undefined} key={-1} />
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
              {allTransportMode && allTransportMode.map((pur, idx) => {
                return (
                  <Picker.Item
                    label={pur}
                    value={pur}
                    key={idx}
                  />
                );
              })}
            </Picker>
          </View>
        )}

        {transport_mode === commonPool && (
          <CardItem>
            <CheckBox
              style={{
                borderColor: 'green',
                backgroundColor:
                  agreeCommonPoolTerms == true ? 'green' : 'white',
              }}
              checked={agreeCommonPoolTerms}
              onPress={() => checkUncheckCommonPoolTerms()}
            />
            <Text
              style={{
                paddingLeft: 15,
              }}>
              <Text onPress={() => checkUncheckCommonPoolTerms()}>
                I agree Common Pool
              </Text>
              <Text
                style={{ color: 'blue' }}
                onPress={() => {
                  setCommonPoolTermsModal(true);
                }}>
                {' '}
                Terms and Conditions{' '}
              </Text>
            </Text>
          </CardItem>
        )}

        {transport_mode === selfOwned && (
          <CardItem>
            <CheckBox
              style={{
                borderColor: 'green',
                backgroundColor:
                  agreeSelfOnwedTerms == true ? 'green' : 'white',
              }}
              checked={agreeSelfOnwedTerms}
              onPress={() => checkUncheckSelfOwnedTerms()}
            />
            <Text
              style={{
                paddingLeft: 15,
              }}>
              <Text onPress={() => checkUncheckSelfOwnedTerms()}>
                I agree Self Owned Transport{' '}
              </Text>
              <Text
                style={{ color: 'blue' }}
                onPress={() => {
                  setSelfOwnedTermsModal(true);
                }}>
                Terms and Conditions{' '}
              </Text>
            </Text>
          </CardItem>
        )}

        <Item regular style={globalStyles.mb10}>
          <Input
            value={expected_quantity}
            onChangeText={val => {
              setexpected_quantity(val), checkNumeric(val), setErrorMsg('');
            }}
            placeholder="Total requirement in M3"
            keyboardType="numeric"
            placeholderTextColor={Config.PLACE_HOLDER_COLOR}
          />
        </Item>
        <Item regular style={globalStyles.mb10}>
          <Input
            value={remarks}
            onChangeText={val => setremarks(val)}
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
          <Button danger onPress={() => setShowModal(false)}>
            <Text>Cancel</Text>
          </Button>
        </Container>
        <Container>
          <View>
            <Text style={globalStyles.errorMsg}>{errorMsg}</Text>
          </View>
        </Container>
      </Content>

      <Modal
        animationType="fade"
        transparent={false}
        visible={commonPoolTermsModal}
        onRequestClose={() => setCommonPoolTermsModal(false)}>
        <Content style={globalStyles.content}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 10,
              color: Config.APP_HEADER_COLOR,
            }}>
            Terms and Conditions for Common Pool Customers
          </Text>
          <Text>
            I would like to register as a common pool transportation user, i.e.,
            to have my sand transported through NRDCL registered
            trucks/transporters to my designated construction site. I have read
            and understood; and agree to be legally bound by the following terms
            and conditions governing the use of NRDCL common pool transportation
            services: {'\n\n'}
            1. The sand that I purchase from Wangdue/Punakha under Sha Branch
            shall be transported to my construction site through NRDCL arranged
            trucks under the common pool transportation service. {'\n\n'}
            2. I shall make payment for the cost of sand and the transportation
            cost at the rate fixed by NRDCL by bank transfer/online payment
            through My Resources or by paying cash at the nearest NRDCL Office.
            {'\n\n'}
            3. I understand that the cost of sand or the transportation cost may
            be revised by NRDCL from time to time.{'\n\n'}
            4. I understand that I will HAVE TO receive the sand once it is dispatched 
            and in transit, and that I will not be able to cancel it on grounds of
            space constraints or any other issues.{'\n\n'}            
            5. I agree to acknowledge delivery of the sand upon receipt at the
            site. I understand that without the delivery acknowledgement, my
            subsequent orders may be delayed or not processed.{'\n\n'}
          </Text>
          <Container
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              maxHeight: 'auto',
              alignSelf: 'center',
            }}>
            <Button
              success
              onPress={() => {
                setCommonPoolTermsModal(false);
              }}>
              <Text>OK</Text>
            </Button>
          </Container>
        </Content>
      </Modal>

      <Modal
        animationType="fade"
        transparent={false}
        visible={selfOwnedTermsModal}
        onRequestClose={() => setSelfOwnedTermsModal(false)}>
        <Content style={globalStyles.content}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 10,
              color: Config.APP_HEADER_COLOR,
            }}>
            Terms and Conditions for Self Owned Transport
          </Text>
          <Text>
            I would like to register my vehicle(s) for transportation of sand to
            my own construction site. I have read and understood; and agree to
            be legally bound by the following terms and conditions governing use
            of my vehicle for sand transportation referred to as Self Owned
            Transport: {'\n\n'}
            1. I understand that I shall have to provide required valid
            documents and correct information for registration of my vehicle
            with NRDCL. {'\n\n'}
            2. I understand that I shall be allowed to register only vehicle(s)
            registered in my name or the name of my spouse, and NRDCL shall not
            allow registration of vehicle(s) belonging to any other family
            member(s) for sand transportation under Self Owned Transport. Proof
            for authentication in the form of blue book, marriage certificate
            (if vehicle registered in the name of the spouse) are made mandatory
            for submission.{'\n\n'}
            3. I agree to use my vehicle for transportation of sand only to my
            own registered site, and not to any other site.{'\n\n'}
            4. I understand that in the event of non-availability of my
            vehicle(s), I can avail the common pool transportation service of
            NRDCL, in which case I agree to abide by the terms and conditions of
            its use.{' '}
            <Text
              style={{ color: 'blue', fontStyle: 'italic' }}
              onPress={() => {
                setCommonPoolTermsModal(true);
              }}>
              Click here to view the terms and conditions for common pool
              transportation.{' '}
            </Text>{' '}
            {'\n\n'}
            5. I understand that NRDCL shall not be held responsible for
            carrying overload or any mishap that may occur during journey, and
            that I shall be responsible for bearing any loss(es) that may arise
            from such an incident.{'\n\n'}
          </Text>
          <Container
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              maxHeight: 'auto',
              alignSelf: 'center',
            }}>
            <Button
              success
              onPress={() => {
                setSelfOwnedTermsModal(false);
              }}>
              <Text>OK</Text>
            </Button>
          </Container>
        </Content>
      </Modal>
    </Modal>
  );
};

export default SiteItem;
