/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import { useState, useEffect } from 'react';
import { isObjectEmpty } from '../services/objectService';

const defaultOptions = {
  mode: 'onSubmit',
  validationSchema: {},
};

const useForm = (passedOptions) => {
  const [options, setOptions] = useState({
    ...defaultOptions,
    ...passedOptions,
  });
  useEffect(() => {
    if (!passedOptions.change) return;
    setOptions((prev) => Object.assign(prev, passedOptions));
  }, [passedOptions.change]);

  const [values, setValues] = useState(options.initialValues || {});
  const [errors, setErrors] = useState({});

  const handleChange = ({ name, value }) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleErrors = ({ name, value }) => {
    setErrors((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /* TODO: fix to handle arrays
    for now if object is an array, its error
    obj has 'clients[0].first_name' key as a string.
    E.g {'clients[0].first_name': 'this is required'}
  */
  const validate = (valuesObject, schema) =>
    new Promise((resolve) => {
      let { validationSchema } = options || {};
      if (schema) validationSchema = schema;
      const tempErrors = {};

      const validators = validationSchema._nodes.map((field) =>
        validationSchema.validateAt(field, valuesObject),
      );

      Promise.all(validators.map((p) => p.catch((e) => e))).then((errrs) => {
        const inValidResults = errrs.filter(
          (result) => result instanceof Error,
        );
        inValidResults.forEach((err) => {
          const { errors } = err || {};
          const [firstError] = errors || [];
          tempErrors[err.path] = firstError;
        });
        resolve(tempErrors);
      });
    });

  useEffect(() => {
    if (options.mode === 'onChange') {
      const valuesObject = values;
      validate(valuesObject).then((callbackErrors) => {
        setErrors(callbackErrors);
      });
    }
  }, [values]);

  const handleSubmit = async (callback) => {
    setOptions((values) => ({
      ...values,
      mode: 'onChange',
    }));

    const callbackErrors = await validate(values);
    setErrors(callbackErrors);
    if (isObjectEmpty(callbackErrors)) {
      callback(values);
    }
  };

  const resetForm = () => {
    if (passedOptions.mode !== 'onChange') options.mode = 'onSubmit';

    setValues({});
    setErrors({});
  };

  return {
    handleChange,
    handleSubmit,
    resetForm,
    values,
    setValues,
    errors,
    setErrors,
    handleErrors,
    validate,
  };
};

export default useForm;
