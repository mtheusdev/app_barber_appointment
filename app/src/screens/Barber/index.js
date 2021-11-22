import React, {useEffect, useState} from 'react';

import {Container} from './styles';
import {Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <Container>
      <Text>Barber</Text>
    </Container>
  );
};
