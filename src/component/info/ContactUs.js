import React from 'react';
import { 
  StyleSheet,
  View,
  Text, 
  Content, 
  H2,
  Card,
  Body,
  CardItem} from 'native-base';
import globalStyle from '../../styles/globalStyle'; 

export const ContactUs = () => {
  return (
      <Content> 
        <CardItem>
          <View> 
            <Text>
              NRDCL, Thimphu Bhutan {'\n'}  
              Post Box 192 {'\n'}     
              Tel: 975-2-323834/323868/328959(Ext 139) {'\n'} 
              Mobile: 17884632/17316385/17315080/17692812 {'\n'} 
              Fax: 00975-2-325585 {'\n'}     
              E-mail: sonam.choden@nrdcl.bt / tashi.yangden@nrdcl.bt            
              </Text> 
          </View>
        </CardItem> 
    </Content>
  );
}; 
export default ContactUs;
