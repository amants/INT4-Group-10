/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { password } from '../constants/validationSchemas';
import useForm from '../hooks/useForm';
import TextInput from './TextInput';
import ActionButton from './ActionButton';

const RegisterUsernameComponent = ({
  setRegisterStep,
  registerStep,
  setRegisterValues,
  registerValues,
  interfaceStore,
  addUser,
}) => {
  const SignupSchema = Yup.object().shape({
    password: password,
    confirm_password: password,
  });

  const { togglePopUp } = interfaceStore;

  const { handleChange, errors, handleSubmit, values, handleErrors } = useForm({
    validationSchema: SignupSchema,
    change: () => {},
  });

  useEffect(() => {
    if (registerValues.password) {
      handleChange({ name: 'password', value: registerValues.password });
    }
    if (registerValues.confirm_password) {
      handleChange({
        name: 'confirm_password',
        value: registerValues.confirm_password,
      });
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
      temp.password = formValues?.password;
      temp.confirm_password = formValues?.confirm_password;
      return temp;
    });
    addUser(
      registerValues.username,
      formValues.password,
      registerValues.country_id,
      registerValues.email,
    );
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
    console.log(values);
    if (values.confirm_password !== values.password) {
      return handleErrors({
        name: 'confirm_password',
        value: "Passwords don't match",
      });
    } else {
      handleSubmit(onSubmit);
    }
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
            <Title>
              Secure your passport <br />
              with a password
            </Title>
          </HeaderContent>
        </HeaderContainer>
        <Form onSubmit={formSubmitHandler}>
          <TextInput
            type="password"
            name="password"
            placeholder="************"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          >
            04. Password
          </TextInput>
          <TextInput
            type="password"
            name="confirm_password"
            placeholder="************"
            value={values.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          >
            05. Confirm password
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
  padding: 2rem;
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
