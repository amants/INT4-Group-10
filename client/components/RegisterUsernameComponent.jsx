/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useDebouncedCallback } from 'use-debounce';
import { validateInput } from '../services/apiRouterService';
import { username } from '../constants/validationSchemas';
import useForm from '../hooks/useForm';
import TextInput from './TextInput';
import ActionButton from './ActionButton';

const RegisterUsernameComponent = ({
  setRegisterStep,
  registerStep,
  setRegisterValues,
  registerValues,
  interfaceStore,
}) => {
  const SignupSchema = Yup.object().shape({
    username,
  });

  const { togglePopUp } = interfaceStore;

  const { handleChange, errors, handleSubmit, values, handleErrors } = useForm({
    validationSchema: SignupSchema,
    change: () => {},
  });

  const validateUsername = async () => {
    if (values.username.length < 2) {
      return handleErrors({ name: 'username', value: 'Too short' });
    }
    if (values.username.length > 12) {
      return handleErrors({ name: 'username', value: 'Too long' });
    }
    handleErrors({
      name: 'username',
      value: 'Checking username availability ...',
    });
    const [, status] = await validateInput('username', values.username);
    if (status !== 200) {
      handleErrors({ name: 'username', value: 'Username already exists' });
    } else {
      handleErrors({ name: 'username', value: undefined });
    }
  };

  const [debounceValidate] = useDebouncedCallback(validateUsername, 500);

  useEffect(() => {
    if (registerValues.username) {
      handleChange({ name: 'username', value: registerValues.username });
    }
  }, []);

  useEffect(() => {
    if (values.username && values.username.length > 0) {
      debounceValidate();
    }
  }, [values.username]);

  const onSubmit = async (formValues) => {
    setRegisterValues((prevValue) => {
      const temp = { ...prevValue };
      temp.username = formValues.username;
      return temp;
    });
    setRegisterStep((prevValue) => prevValue + 1);
  };

  const goBack = (e) => {
    e.preventDefault();
    if (registerStep === 0) {
      togglePopUp('login', true);
      togglePopUp('register', false);
    } else {
      setRegisterStep((prevValue) => prevValue - 1);
    }
  };

  function formSubmitHandler(e) {
    e.preventDefault();
    if (errors.username) return;
    handleSubmit(onSubmit);
  }

  return (
    <>
      <Page>
        <img src="/assets/images/Signature.png" />
      </Page>
      <Page>
        <HeaderContainer>
          <HeaderContent>
            <RegisterStep>Step {registerStep + 1}/5</RegisterStep>
            <Title>How can we call you?</Title>
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
          <ButtonContainer>
            <StyledGoBackButton onClick={goBack}>
              {'<'} Go back
            </StyledGoBackButton>
            <StyledActionButton type="submit">Next</StyledActionButton>
          </ButtonContainer>
        </Form>
      </Page>
    </>
  );
};

const StyledActionButton = styled(ActionButton)`
  padding: 1rem 2rem;
`;

const StyledGoBackButton = styled.a`
  border: none;
  margin-right: 2rem;
  cursor: pointer;
`;

const RegisterStep = styled.p`
  margin-top: 4rem;
  color: rgba(16, 33, 70, 0.4);
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  align-items: center;
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
`;

const Page = styled.div`
  width: 50%;
  height: 100%;
  flex-grow: 0;
  padding: 4rem;
  padding-top: 0;
  position: relative;
  padding-bottom: 4rem;
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  width: auto;
  text-align: left;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  color: #102146;
  font-family: sirenne-text-mvb, serif;
  font-weight: bold;
  font-style: normal;
  font-size: 2.8rem;
  line-height: 2.4rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default RegisterUsernameComponent;
