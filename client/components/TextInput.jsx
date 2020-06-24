/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useState, useEffect } from 'react';
import {
  bool,
  node,
  number,
  func,
  string,
  object,
  oneOfType,
} from 'prop-types';
import styled from 'styled-components';
import Error, { getBorderColor } from './Error';

const TextInput = forwardRef(
  (
    {
      className,
      children,
      name,
      type,
      disabled,
      placeholder,
      onChange,
      error,
      warning,
      touched,
      value,
      ...otherProps
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      if (inputValue !== value) {
        setInputValue(value);
      }
    }, [value]);

    const handleChange = (e) => {
      e.persist();
      onChange({ name: e.target.name, value: e.target.value });
    };

    return (
      <Container className={className}>
        <StyledLabel disabled={disabled} error={error}>
          <p>
            {children}
            <Error error={error} />
          </p>
          <StyledInput
            ref={ref}
            id={name}
            name={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            error={error}
            touched={touched}
            value={inputValue}
            onChange={handleChange}
            {...otherProps}
          />
        </StyledLabel>
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 9rem;
  margin-bottom: 2rem;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  font-family: sirenne-text-mvb, serif;
  font-weight: bold;
  color: #102146;
  font-style: normal;
  font-size: 2rem;
  line-height: 2.4rem;
  transition: all 0.2s;
  border-bottom: 2px solid ${({ error }) => getBorderColor(error)};
  line-height: 1rem;
`;

const StyledInput = styled.input`
  ${'' /* background-color: ${(props) => (props.disabled ? '#F0F1F3' : 'white')}; */}
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 3.5rem;
  width: 100%;
  margin-top: 1rem;
  font-size: 2rem;
  color: #102146;
  box-sizing: border-box;
  font-family: sirenne-text-mvb, serif;
  font-style: normal;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #c4c4c4;
    font-weight: bold;
  }
`;

TextInput.defaultProps = {
  disabled: false,
  placeholder: '',
  error: '',
  className: '',
  type: 'text',
  onChange: () => {},
  otherProps: {},
  value: '',
};

TextInput.propTypes = {
  className: string,
  children: node.isRequired,
  name: string.isRequired,
  type: string,
  disabled: bool,
  placeholder: string,
  error: string,
  onChange: func,
  otherProps: object,
  value: oneOfType([string, number]),
};

export default TextInput;
