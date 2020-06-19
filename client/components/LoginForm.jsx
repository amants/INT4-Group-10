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
        closePopUp();
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
      <Title>{title || 'Already a member?'}</Title>
      <p>{subTitle || 'Welcome back, we missed you!'}</p>
      <Form onSubmit={formSubmitHandler}>
        <TextInput
          type="text"
          name="username"
          placeholder=""
          value={values.username}
          onChange={handleChange}
          error={errors.username}
        >
          Email or username
        </TextInput>
        <TextInput
          type="password"
          name="password"
          placeholder=""
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        >
          Password
        </TextInput>
        <ActionButton type="submit">Login</ActionButton>
      </Form>
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

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  & p {
    margin-bottom: 3rem;
  }
`;

export default inject('interfaceStore', 'userStore')(observer(LoginForm));
