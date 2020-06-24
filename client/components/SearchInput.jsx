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

const SeachInput = forwardRef(
  (
    {
      className,
      name,
      type,
      disabled,
      placeholder,
      onChange,
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
      <StyledLabel disabled={disabled}>
        <StyledInput
          ref={ref}
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          {...otherProps}
        />
        <SearchImg src="/assets/images/search-icon.png" alt="search icon" />
      </StyledLabel>
    );
  },
);

const SearchImg = styled.img`
  flex-grow: 0;
  flex-shrink: 0;
  width: 25px;
  height: 25px;
`;

const StyledLabel = styled.label`
  display: flex;
  margin-top: 1rem;
  position: relative;
  width: 100%;
  border-bottom: 2px solid #102146;
  align-items: center;
`;

const StyledInput = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 3.5rem;
  width: 100%;
  font-size: 2rem;
  box-sizing: border-box;
  font-family: sirenne-text-mvb, serif;
  font-style: normal;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: gray;
  }
`;

SeachInput.defaultProps = {
  disabled: false,
  placeholder: '',
  className: '',
  type: 'text',
  onChange: () => {},
  otherProps: {},
  value: '',
};

SeachInput.propTypes = {
  className: string,
  name: string.isRequired,
  type: string,
  disabled: bool,
  placeholder: string,
  onChange: func,
  otherProps: object,
  value: oneOfType([string, number]),
};

export default SeachInput;
