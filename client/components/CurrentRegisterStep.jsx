import React from 'react';
import RegisterUsernameComponent from './RegisterUsernameComponent';
import RegisterEmailComponent from './RegisterEmailComponent';
import RegisterCountryComponent from './RegisterCountryComponent';
import RegisterPasswordComponent from './RegisterPasswordComponent';

const CurrentRegisterStep = (props) => {
  console.log(props.registerStep);
  switch (props.registerStep) {
    case 0:
      return <RegisterUsernameComponent {...props} />;
    case 1:
      return <RegisterEmailComponent {...props} />;
    case 2:
      return <RegisterCountryComponent {...props} />;
    case 3:
      return <RegisterPasswordComponent {...props} />;
    default:
      return <p>Nothing here</p>;
  }
};

export default CurrentRegisterStep;
