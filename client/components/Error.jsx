import React from 'react';
import styled from 'styled-components';
import { string } from 'prop-types';

const Error = ({ error }) => {
  return error ? (
    <ErrorContainer error={error}> - {error}</ErrorContainer>
  ) : null;
};

const ErrorContainer = styled.span`
  display: inline;
  height: 1.2rem;
  flex-grow: 0;
  font-size: 1.1rem;
  color: ${({ error }) => (error ? 'red' : 'orange')};
`;

Error.defaultProps = {
  error: '',
};

Error.propTypes = {
  error: string,
};

export const getBorderColor = (error, touched) => {
  if (error) return '#ff0000';
  return '#102146';
};

export default Error;
