/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { object, bool, string, node, func } from 'prop-types';
import styled from 'styled-components';

const ActionButton = ({
  level,
  disabled,
  children,
  fullwidth,
  onClick,
  icon,
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
      level={level}
      onClick={handleClick}
      fullwidth={fullwidth}
      disabled={disabled}
      className={className}
      {...otherProps}
    >
      {icon ? <Image src={icon} /> : null}

      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  font-size: 1.6rem;
  border-radius: 0.5rem;
  min-width: 14rem;
  width: ${props => (props.fullwidth ? '100%' : '')};
  height: 4rem;
  transition: 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ disabled, level }) =>
    disabled && level === 'primary'
      ? 'lightgray'
      : (disabled && level === 'secondary') || level === 'secondary'
      ? 'transparent'
      : level === 'primary'
      ? '#3098dc'
      : level === 'default'
      ? '#3098dc'
      : '#3098dc'};

  color: ${({ disabled, level }) =>
    (disabled && level === 'primary') ||
    level === 'primary' ||
    level === 'default'
      ? 'white'
      : disabled && level === 'secondary'
      ? "lightgray"
      : level === 'secondary'
      ? '#3098dc'
      : 'white'};

  border: ${({ disabled, level }) =>
    (disabled && level === 'primary') ||
    level === 'primary' ||
    level === 'default'
      ? '0'
      : disabled && level === 'secondary'
      ? `2px solid gray`
      : level === 'secondary'
      ? `2px solid #2b89c6`
      : '0'};

  padding: ${({ padding }) => padding || '1rem 0.4rem'};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  :active {
    transform: scale(0.95);
  }

  :focus {
    outline: none;
  }

  :hover {
    background-color: ${({ level, disabled }) =>
      disabled
        ? 'gray'
        : level === 'primary'
        ? '#2b89c6'
        : level === 'secondary'
        ? '#3098dc'
        : level === 'default'
        ? 'gray'
        : ''};

    color: white;
  }
`;

const Image = styled.img`
  margin-right: 1rem;
  height: 2rem;
`;

ActionButton.defaultProps = {
  disabled: false,
  level: 'primary',
  className: '',
  fullwidth: false,
  icon: null,
  onClick: () => {},
  otherProps: {},
};

ActionButton.propTypes = {
  /** Beeing able to use it in Styled Components */
  className: string,
  /** If true button is disabled */
  disabled: bool,
  /** The color theme */
  level: string,
  /** The label of the button */
  children: node.isRequired,
  /** If true button width is 100% */
  fullwidth: bool,
  /** Triggered when button is clicked */
  onClick: func,
  /** Adds icon to button */
  icon: node,
  /** Adds extra props to the element */
  otherProps: object,
};

export default ActionButton;
