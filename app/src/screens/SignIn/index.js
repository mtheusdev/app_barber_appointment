import React, {useState, useContext} from 'react';
import Api from '../../Api';
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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from './../../contexts/UserContext';

export default function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {dispatch: userDispatch} = useContext(UserContext);

  const handleMessageButtonClick = () => {
    navigation.reset({
      routes: [{name: 'SignUp'}],
    });
  };
  const handleSignClick = async () => {
    if (email && password) {
      let res = await Api.signIn(email, password);
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
        alert('Email e/ou senha incorretos');
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
          <CustomButtonText>LOGIN</CustomButtonText>
        </CustomButton>
      </InputArea>
      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>
          Ainda não possui uma conta?
        </SignMessageButtonText>
        <SignMessageButtonTextBold> Cadastro</SignMessageButtonTextBold>
      </SignMessageButton>
    </Container>
  );
}
