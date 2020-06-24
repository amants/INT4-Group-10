/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useDebouncedCallback } from 'use-debounce';
import { validateInput } from '../services/apiRouterService';
import { email } from '../constants/validationSchemas';
import useForm from '../hooks/useForm';
import TextInput from './TextInput';
import ActionButton from './ActionButton';

const RegisterEmailComponent = ({
  setRegisterStep,
  registerStep,
  setRegisterValues,
  registerValues,
  interfaceStore,
}) => {
  const SignupSchema = Yup.object().shape({
    email,
  });

  const { togglePopUp } = interfaceStore;

  const { handleChange, errors, handleSubmit, values, handleErrors } = useForm({
    validationSchema: SignupSchema,
    change: () => {},
  });

  const validateEmail = async () => {
    return new Promise(async (resolve) => {
      const [, status] = await validateInput('email', values.email);
      if (status !== 200) {
        resolve(false);
        handleErrors({ name: 'email', value: 'Email already exists' });
      } else {
        resolve(true);
        handleErrors({ name: 'email', value: undefined });
      }
    });
  };

  useEffect(() => {
    if (registerValues.email) {
      handleChange({ name: 'email', value: registerValues.email });
    }
  }, []);

  useEffect(() => {
    handleErrors({ name: 'email', value: undefined });
  }, [values.email]);

  const onSubmit = async (formValues) => {
    setRegisterValues((prevValue) => {
      const temp = { ...prevValue };
      temp.email = formValues.email;
      return temp;
    });
    setRegisterStep((prevValue) => prevValue + 1);
  };

  const goBack = () => {
    if (registerStep === 0) {
      togglePopUp('login', true);
      togglePopUp('register', false);
    } else {
      setRegisterStep((prevValue) => prevValue - 1);
    }
  };

  async function formSubmitHandler(e) {
    e.preventDefault();
    const validEmail = await validateEmail();
    if (validEmail) {
      handleSubmit(onSubmit);
    }
  }

  return (
    <>
      <Page>
        <img src="/assets/images/doodleEmail.png" />
      </Page>
      <Page>
        <HeaderContainer>
          <HeaderContent>
            <RegisterStep>Step {registerStep + 1}/5</RegisterStep>
            <Title>
              Which emailaddress <br />
              do you use?
            </Title>
          </HeaderContent>
        </HeaderContainer>
        <Form onSubmit={formSubmitHandler}>
          <TextInput
            type="text"
            name="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          >
            02. Email
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
  align-items: center;
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

export default RegisterEmailComponent;
