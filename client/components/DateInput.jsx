/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
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

const DateInput = ({
  name,
  className,
  children,
  disabled,
  error,
  value,
  onChange,
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    onChange({ name, value: `${day}/${month}/${year}` });
  }, [day, month, year]);

  useEffect(() => {
    if (value !== `${day}/${month}/${year}`) {
      setDay(value.split('/')[0]);
      setMonth(
        !isNaN(parseInt(value.split('/')[1])) ? value.split('/')[1] : ``,
      );
      setYear(!isNaN(parseInt(value.split('/')[2])) ? value.split('/')[2] : ``);
    }
  }, [value]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'day':
        if (e.target.value) {
          if (parseInt(e.target.value) && parseInt(e.target.value) > 31)
            setDay(31);
          else if (e.target.value.length <= 2) setDay(e.target.value);
        } else {
          setDay('');
        }
        break;
      case 'month':
        if (e.target.value) {
          if (parseInt(e.target.value) && parseInt(e.target.value) > 12)
            setMonth(12);
          else if (e.target.value.length <= 2) setMonth(e.target.value);
        } else {
          setMonth('');
        }
        break;
      case 'year':
        if (e.target.value) {
          if (e.target.value.length <= 4) setYear(e.target.value);
        } else {
          setYear('');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Container className={className}>
      <StyledLabel disabled={disabled}>
        <p>
          {children}
          <Error error={error} />
        </p>
        <InputContainer>
          <StyledInput
            name="day"
            type="number"
            disabled={disabled}
            placeholder="DD"
            error={error}
            value={day}
            onChange={handleChange}
          />
          <InputSeperator>{' / '}</InputSeperator>
          <StyledInput
            name="month"
            type="number"
            disabled={disabled}
            placeholder="MM"
            error={error}
            value={month}
            onChange={handleChange}
          />
          <InputSeperator>{' / '}</InputSeperator>
          <StyledYearInput
            name="year"
            type="number"
            disabled={disabled}
            placeholder="YYYY"
            error={error}
            value={year}
            onChange={handleChange}
          />
        </InputContainer>
      </StyledLabel>
    </Container>
  );
};

const InputSeperator = styled.div`
  margin-top: 0.5rem;
  font-size: 1.8rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-weight: 900;
`;

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
  font-style: normal;
  font-size: 2rem;
  line-height: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  ${'' /* background-color: ${(props) => (props.disabled ? '#F0F1F3' : 'white')}; */}
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 3.5rem;
  width: 4.5rem;
  margin-top: 1rem;
  font-size: 2.5rem;
  color: #102146;
  box-sizing: border-box;
  border-bottom: 2px solid ${({ error }) => getBorderColor(error)};
  font-family: sirenne-text-mvb, serif;
  font-style: normal;
  letter-spacing: 5px;
  padding: 0 3px;
  transition: all 0.2s;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #c4c4c4;
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
  }
`;

const StyledYearInput = styled.input`
  ${'' /* background-color: ${(props) => (props.disabled ? '#F0F1F3' : 'white')}; */}
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 3.5rem;
  width: 8rem;
  margin-top: 1rem;
  font-size: 2.5rem;
  color: #102146;
  box-sizing: border-box;
  border-bottom: 2px solid ${({ error }) => getBorderColor(error)};
  font-family: sirenne-text-mvb, serif;
  font-style: normal;
  letter-spacing: 5px;
  padding: 0 3px;
  transition: all 0.2s;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #c4c4c4;
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
  }
`;

DateInput.defaultProps = {
  disabled: false,
  placeholder: '',
  error: '',
  className: '',
  type: 'text',
  onChange: () => {},
  otherProps: {},
  value: '',
};

DateInput.propTypes = {
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

export default DateInput;
