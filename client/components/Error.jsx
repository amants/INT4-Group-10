import React from 'react';
import styled from 'styled-components';
import { string } from 'prop-types';

const Error = ({ error, warning }) => {
  return error || warning ? (
    <ErrorContainer error={error}>
      <p>{error || warning}</p>
    </ErrorContainer>
  ) : null;
};

const ErrorContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: .5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: ${({ error }) =>
    error ? 'red' : 'orange'};
`;

Error.displayName = 'Error';

Error.defaultProps = {
  error: '',
  warning: '',
};

Error.propTypes = {
  /** string with errormessage */
  error: string,
  /** string with warningmessage */
  warning: string,
};

export const getBorderColor = (error, touched, theme, warning) => {
  if (error) return '#ff0000';
  if (warning) return 'orange';
  if (touched) return '#00ff00';
  return 'gray';
};

export default Error;
