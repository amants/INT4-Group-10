/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
// import { useDebouncedCallback } from 'use-debounce';
// import { validateInput } from '../services/apiRouterService';
import { number } from '../constants/validationSchemas';
import useForm from '../hooks/useForm';
import CountryInput from './CountryInput';
import ActionButton from './ActionButton';

const RegisterCountryComponent = ({
  setRegisterStep,
  registerStep,
  setRegisterValues,
  registerValues,
  interfaceStore,
}) => {
  const SignupSchema = Yup.object().shape({
    country_id: number.required,
  });

  const { togglePopUp } = interfaceStore;

  const { handleChange, errors, handleSubmit, values } = useForm({
    validationSchema: SignupSchema,
    change: () => {},
  });

  useEffect(() => {
    if (registerValues.country_id) {
      handleChange({ name: 'country_id', value: registerValues.country_id });
    }
  }, []);

  useEffect(() => {
    if (values.country_id && values.country_id.length > 0) {
      debounceValidate();
    }
  }, [values.country_id]);

  const onSubmit = async (formValues) => {
    setRegisterValues((prevValue) => {
      const temp = { ...prevValue };
      temp.country_id = formValues.country_id;
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

  console.log(values);

  function formSubmitHandler(e) {
    e.preventDefault();
    console.log(e);
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
            <Title>Where are you right now?</Title>
          </HeaderContent>
        </HeaderContainer>
        <Form onSubmit={formSubmitHandler}>
          <CountryInput
            type="text"
            name="country_id"
            placeholder="Search country"
            value={values.country_id}
            onChange={handleChange}
            error={errors.country_id}
          >
            03. Country
          </CountryInput>
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

export default RegisterCountryComponent;
