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
      setFieldTouched,
      error,
      warning,
      touched,
      value,
      symbol,
      symbolSide,
      symbolText,
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

    const handleChange = e => {
      e.persist();
      onChange({ name: e.target.name, value: e.target.value });
    };
    const handleBlur = () => {
      setFieldTouched(name, true);
    };

    return (
      <Container className={className}>
        <StyledLabel disabled={disabled}>
          {children}
          <StyledInput
            ref={ref}
            id={name}
            name={name}
            type={type}
            symbol={symbol}
            symbolSide={symbolSide}
            disabled={disabled}
            placeholder={placeholder}
            error={error}
            warning={warning}
            touched={touched}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...otherProps}
          />
        </StyledLabel>
        <Error error={error} warning={warning} />
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 9rem;
  margin-top: -1rem;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  font-size: 1.4rem;
  color: ${props => (props.disabled ? '#AEAEAE' : '#5B5550')};
  line-height: 1rem;
`;

const StyledInput = styled.input`
  background-color: ${props => (props.disabled ? '#F0F1F3' : 'white')};
  width: 100%;
  border: 0.1rem solid;
  border-color: ${({ error, touched, theme, warning }) =>
    getBorderColor(error, touched, theme, warning)};
  border-radius: 0.3rem;
  height: 4rem;
  font-size: 1.6rem;
  margin-top: 1rem;
  box-sizing: border-box;
  padding-right: 0.7rem;
  padding-left: 0.7rem;

  &:focus {
    outline: none;
    border-color: darkgray;
  }

  &::placeholder {
    color: gray;
  }
`;

TextInput.displayName = 'TextInput';

TextInput.defaultProps = {
  disabled: false,
  placeholder: '',
  error: '',
  warning: '',
  symbol: '',
  className: '',
  symbolSide: 'right',
  symbolText: false,
  touched: false,
  type: 'text',
  setFieldTouched: () => {},
  onChange: () => {},
  otherProps: {},
  value: '',
};

TextInput.propTypes = {
  /** Beeing able to use it in Styled Components */
  className: string,
  /** label above the input */
  children: node.isRequired,
  /** name of input and label */
  name: string.isRequired,
  /** type of input: email, text, ... */
  type: string,
  /** if true input is disabled */
  disabled: bool,
  /** example value in the input */
  placeholder: string,
  /** string with errormessage */
  error: string,
  /** string with warningmessage */
  warning: string,
  /** Pass an icon name to show said icon inside the input  */
  symbol: string,
  /** Choose a side at which the icon will be shown */
  symbolSide: string,
  /** Picks whether to show the symbol as an icon or as text */
  symbolText: bool,
  /** boolean to check if inputfield is touched */
  touched: bool,
  /** returns name and touched boolean */
  setFieldTouched: func,
  /** returns onChange event */
  onChange: func,
  /** Adds extra props to the element */
  otherProps: object,
  /** sets initial value */
  value: oneOfType([string, number]),
};

StyledInput.displayName = 'StyledInput';
TextInput.displayName = 'TextInput';

export default TextInput;
