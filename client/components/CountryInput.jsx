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
import { getCountries } from '../services/apiRouterService';
import SearchInput from './SearchInputWithLabel';

const CountryInput = forwardRef(
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
    const [countries, setCountries] = useState([]);
    const [countryFilter, setCountryFilter] = useState('');

    const retrieveCountries = async () => {
      const [resp, status] = await getCountries();
      if (status !== 200) setCountries([]);
      else setCountries(resp.countries);
    };

    useEffect(() => {
      retrieveCountries();
    }, []);

    const handleChange = (e) => {
      onChange(e);
    };

    return (
      <Container className={className}>
        <SearchInput
          className={className}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setCountryFilter(e.value)}
          error={error}
          touched={touched}
          value={countryFilter}
          {...otherProps}
        >
          {children}
        </SearchInput>
        <CountryList>
          {countries
            .filter((country) =>
              countryFilter
                ? country.name.toLowerCase().includes(countryFilter)
                : true,
            )
            .map((country) => (
              <CountryItem
                selected={country.country_id === value}
                onClick={() =>
                  handleChange({
                    name: 'country_id',
                    value: country.country_id,
                  })
                }
              >
                <Flag src={`/assets/images/flags/${country.flag_url}`} />
                {country.name}
              </CountryItem>
            ))}
        </CountryList>
      </Container>
    );
  },
);

const Flag = styled.img`
  height: 10px;
  margin-right: 5px;
  width: 10px;
`;

const CountryItem = styled.div`
  width: 100%;
  display: flex;
  font-family: sirenne-text-mvb, serif;
  font-style: normal;
  cursor: pointer;
  font-size: 1.8rem;
  line-height: 1.8rem;
  color: black;
  padding: 0.5rem;
  align-items: center;
  transition: all 0.1s;
  border-radius: 3px;

  &:hover {
    background-color: #eee;
  }

  ${({ selected }) =>
    selected
      ? `
    background-color: #102146;
    color: white;

    &:hover {
      background-color: #102146;
      color: white;
    }
  `
      : null}
`;

const CountryList = styled.div`
  display: flex;
  flex-direction: column;
  height: 20rem;
  user-select: none;
  overflow-y: scroll;
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 9rem;
  margin-bottom: 2rem;
`;

CountryInput.defaultProps = {
  disabled: false,
  placeholder: '',
  error: '',
  className: '',
  type: 'text',
  onChange: () => {},
  otherProps: {},
  value: '',
};

CountryInput.propTypes = {
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

export default CountryInput;
