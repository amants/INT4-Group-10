/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { username, password } from '../constants/validationSchemas';
import useForm from '../hooks/useForm';
import TextInput from './TextInput';
import ActionButton from './ActionButton';
import { auth, getMe } from '../services/apiRouterService';

const LoginForm = ({
  userStore,
  interfaceStore,
  title,
  subTitle,
  closePopUp,
}) => {
  const { setUser, setAuth } = userStore;
  // const { togglePopUp } = interfaceStore;
  const SignupSchema = Yup.object().shape({
    username,
    password,
  });

  const { handleChange, errors, handleSubmit, values } = useForm({
    validationSchema: SignupSchema,
    change: () => {},
  });

  const onSubmit = async (formValues) => {
    const [, status] = await auth({ ...formValues });
    if (status === 200) {
      const [resp2, status2] = await getMe();
      if (status2 === 200) {
        setUser(resp2);
        setAuth(true);
        location.reload();
      } else {
        setAuth(false);
      }
    }
  };

  function formSubmitHandler(e) {
    e.preventDefault();
    handleSubmit(onSubmit);
  }

  return (
    <Container>
      <Page>
        <HeaderContainer>
          <HeaderContent>
            <Title>{title || 'Log in'}</Title>
          </HeaderContent>
        </HeaderContainer>
        <Form onSubmit={formSubmitHandler}>
          <TextInput
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
            error={errors.username}
          >
            01. Username
          </TextInput>
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          >
            02. Password
          </TextInput>
          <ButtonContainer>
            <Hint>Log in if you already have a username and password.</Hint>
            <StyledActionButton type="submit">Login</StyledActionButton>
          </ButtonContainer>
        </Form>
      </Page>
      <Page>
        <HeaderContainer>
          <HeaderContent>
            <Title>{title || 'Register'}</Title>
          </HeaderContent>
        </HeaderContainer>
        <RegisterImageContainer>
          <RegisterImage src="/assets/images/registerIcon.png" />
        </RegisterImageContainer>
        <ButtonContainer>
          <Hint>Travel anywhere you want by creating your own passport.</Hint>
          <StyledRegisterActionButton type="submit">
            Create a passport
          </StyledRegisterActionButton>
        </ButtonContainer>
      </Page>
    </Container>
  );
};

LoginForm.getInitialProps = async ({
  store: { userStore, interfaceStore },
}) => {
  return {
    interfaceStore,
    userStore,
  };
};

const RegisterImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RegisterImage = styled.img``;

const StyledActionButton = styled(ActionButton)`
  padding: 1rem 2rem;
`;

const StyledRegisterActionButton = styled(ActionButton)`
  padding: 1rem 2rem;
  background-color: #102146;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  flex-wrap: wrap;
  bottom: 3rem;
  left: 0;
  right: 0;
`;

const HeaderContainer = styled.div`
  grid-column: 1 / span 2;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  height: 0;
  padding-bottom: calc(100% / 2);
  padding-left: 1rem;
`;

const Page = styled.div`
  width: 50%;
  height: 100%;
  flex-grow: 0;
  padding: 2rem;
  padding-top: 0;
  position: relative;
  padding-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-top: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  width: auto;
  flex-grow: 0;
  flex-shrink: 0;
  ${'' /* flex: 0 0 100%; */}
  position: relative;

  &::after {
    content: '';
    position: absolute;
    background-size: cover;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0.8rem;
    background-image: url('/assets/images/titleVector.svg');
  }
`;

const Hint = styled.p`
  text-align: center;
  width: 80%;
  margin: auto;
  margin-top: -2rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: #10214690;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  height: 100%;
`;

export default inject('interfaceStore', 'userStore')(observer(LoginForm));
