/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { object, bool, string, node, func } from 'prop-types';
import styled from 'styled-components';

const ActionButton = ({
  disabled,
  children,
  onClick,
  className,
  ...otherProps
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <StyledButton
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...otherProps}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: #102146 0.2rem solid;
  color: #102146;
  background: none;
  border-radius: 10rem;
  padding: 0 2rem;
  cursor: pointer;
  transition: all 0.2s;

  :active {
    transform: scale(0.95);
  }

  :focus {
    outline: none;
  }

  &:hover {
    background-color: #102146;
    color: white;
  }
`;

ActionButton.defaultProps = {
  disabled: false,
  className: '',
  onClick: () => {},
  otherProps: {},
};

ActionButton.propTypes = {
  className: string,
  disabled: bool,
  children: node.isRequired,
  onClick: func,
  otherProps: object,
};

export default ActionButton;
