import React, { useEffect, useState } from 'react';
import { Container, Spinner, Content, Accordion } from 'native-base';

import { connect } from 'react-redux';
import {
  callAxios,
  handleError,
  setLoading,
} from '../../../redux/actions/commonActions';
import globalStyles from '../../../styles/globalStyle';

export const FaqAuth = ({ commonState, handleError, setLoading }) => {
  const [allFaq, setAllFaq] = useState([]);

  useEffect(() => {
    setLoading(true);
    getFaqList();
  }, []);

  const getFaqList = async () => {
    try {
      const response = await callAxios(
        `method/erpnext.crm_utils.get_faq`,
      );
      response.data.message.map((val) => {
        allFaq.push({
          title: val.question,
          content: val.answer,
        });
      });
      setAllFaq(allFaq);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <Container style={globalStyles.container}>
      <Spinner color="#356C92" />
    </Container>
  ) : (
      <Container>
        <Content padder>
          <Accordion
            dataArray={allFaq}
            expanded={0}
            headerStyle={{
              borderWidth: 0.5,
              fontcolor: "#12793e",
              borderColor: "gray",
              textAlign: 'justify'
            }}
            contentStyle={{ backgroundColor: "#F5F5F5", textAlign: 'justify', fontStyle: 'italic' }}
          />
        </Content>
      </Container>
    );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  handleError,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(FaqAuth);
