import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import Config from 'react-native-config';
import {
  Container,
  Form,
  Item,
  Input,
  Button,
  Text,
  Content,
  Icon,
  Row, Col, ListItem,
  Label,
  Textarea,
} from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import { startQtyExtension } from '../../../../redux/actions/siteActions';
import { handleError, getImages } from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
export const ExtendQty = ({
  userState,
  commonState,
  navigation,
  startQtyExtension,
  handleError,
  getImages,
}) => {


  const [site, setSite] = useState('');
  const [extension_approval_document, setDocuments] = useState([]);
  const [current_item, setcurrent_item] = useState({});
  const [item, setItem] = useState('');
  const [additional_quantity, setAdditionalQuantity] = useState('0');
  const [remarks, setRemarks] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setSite(navigation.state.params.id);
      setItem(navigation.state.params.current_item.item_sub_group);
      setcurrent_item(navigation.state.params.current_item);

    }
  }, []);

  useEffect(() => {
    if (images) {
      setDocuments([]);
      setTimeout(() => {
        setDocuments(images);
      }, 600);
    }
  }, [images]);

  const setQty = num => {
    if (isNaN(num)) {
      setAdditionalQuantity('0');
      handleError({ message: 'Addditional Qty should be a number' });
    } else {
      setAdditionalQuantity(num);
    }
  };

  //image picker
  const getSupportingDocuments = async () => {
    const images = await getImages();
    setDocuments(images);
  };

  const extendQty = () => {
    const site_item = {
      site_item_name: current_item.name,
      additional_quantity,
      product_category: current_item.product_category,
      uom: current_item.uom,
      remarks,
    };

    const site_status = {
      approval_status: 'Pending',
      user: userState.login_id,
      site,
      items: [site_item],
    };
    startQtyExtension(site_status, current_item.product_category, images);
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        <ScrollView>
          <Content style={globalStyles.content}>

            <ListItem >
              <Row >
                <Col size={2} >
                  <Label >Site ID:</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{site}</Text>
                </Col>
              </Row>
            </ListItem>
            <ListItem>
              <Row >
                <Col size={2} >
                  <Label >Item:</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{current_item.product_category}</Text>
                </Col>
              </Row>
            </ListItem>

            <ListItem>
              <Row >
                <Col size={2}>
                  <Label >Additional Qty ({current_item.uom}):</Label>
                </Col>
                <Col size={2.5}>
                  <Input
                    placeholder="Enter additional qty."
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                    value={additional_quantity}
                    onChangeText={val => setQty(val)}
                    keyboardType="numeric"
                  />
                </Col>
              </Row>
            </ListItem>

            <ListItem>
              <Row >
                <Col size={2}>
                  <Label >Remarks:</Label>
                </Col>
                <Col size={2.5}>
                  <Textarea
                    rowSpan={3}
                    width="100%"
                    placeholder="Remarks"
                    placeholderTextColor={Config.PLACE_HOLDER_COLOR}
                    value={remarks}
                    onChangeText={val => setRemarks(val)}
                    style={globalStyles.mb10}
                  />
                </Col>
              </Row>
            </ListItem>
            <Form>
              <Row style={{ padding: 20 }}>
                <Col size={5}>
                  <Button
                    block
                    info
                    style={[globalStyles.mb10, globalStyles.button]}
                    onPress={extendQty}
                  >
                    <Text>Confirm</Text>
                  </Button>
                </Col>
              </Row>
            </Form>

          </Content>
        </ScrollView>
      </Container>
    );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = { startQtyExtension, handleError, getImages };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExtendQty);
