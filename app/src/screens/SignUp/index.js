import React, {useState, useContext} from 'react';
import Api from '../../Api';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from './../../contexts/UserContext';
import {
  Container,
  InputArea,
  CustomButton,
  CustomButtonText,
  SignMessageButtonTextBold,
  SignMessageButtonText,
  SignMessageButton,
} from './styles';
import SignInput from '../../components/SignInput';
import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';
import PersonIcon from '../../assets/person.svg';
import {useNavigation} from '@react-navigation/native';

export default function () {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {dispatch: userDispatch} = useContext(UserContext);
  const handleMessageButtonClick = () => {
    navigation.reset({
      routes: [{name: 'SignIn'}],
    });
  };

  const handleSignClick = async () => {
    if (email && password && name) {
      let res = await Api.signUp(name, email, password);
      if (res.token) {
        await AsyncStorage.setItem('token', res.token);
        userDispatch({
          type: 'setAvatar',
          payload: {
            avatar: res.data.avatar,
          },
        });
        navigation.reset({
          routes: [{name: 'MainTab'}],
        });
      } else {
        alert('Erro: ' + res.error);
      }
    } else {
      alert('Preencha os campos corretamente');
    }
  };

  return (
    <Container>
      <BarberLogo width="100%" height="160" />

      <InputArea>
        <SignInput
          value={name}
          IconSvg={PersonIcon}
          placeholder="Digite seu nome"
          onChangeText={t => setName(t)}
        />
        <SignInput
          value={email}
          IconSvg={EmailIcon}
          placeholder="Digite seu e-mail"
          onChangeText={t => setEmail(t)}
        />
        <SignInput
          value={password}
          IconSvg={LockIcon}
          placeholder="Digite sua senha"
          password
          onChangeText={t => setPassword(t)}
        />
        <CustomButton onPress={handleSignClick}>
          <CustomButtonText>CADASTRAR</CustomButtonText>
        </CustomButton>
      </InputArea>
      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
        <SignMessageButtonTextBold> Faça login</SignMessageButtonTextBold>
      </SignMessageButton>
    </Container>
  );
}
