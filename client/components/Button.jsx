/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { node, string } from 'prop-types';

const Button = ({ children, className, ...props }) => {

  return (
    <Container className={className} {...props}>
      {children}
    </Container>
  );
};

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  children: node.isRequired,
  className: string,
};

const Container = styled.button`
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 12px;
  padding-left: 12px;
  font-size: 12px;
  cursor: pointer;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  background-color: #3098dc;
  color: #fff!important;
  border: 1px solid #2b89c6;
  transition: all .1s ease;

  &:hover {
    background-color: #3ba4e8;
  }
`;

export default Button;