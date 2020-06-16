import * as Yup from "yup";

export const string = {
  required: Yup.string().required(`required`),
  notRequired: Yup.string().nullable()
};

export const number = {
  required: Yup.number()
    .typeError(`not a number`)
    .required(`required`),
  notRequired: Yup.number()
    .nullable()
    .typeError(`not a number`)
};

export const price = {
  required: Yup.number()
    .typeError(`not a number`)
    .required(`required`)
    .min(1, `required`),
  notRequired: Yup.number()
    .nullable()
    .typeError(`not a number`)
};

export const date = Yup.string()
  .matches(
    /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
    `not a valid date`
  )
  .required(`required`);

export const dateWithOutYear = Yup.string()
  .matches(
    /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/,
    `not a valid date`
  )
  .required(`required`);

export const firstName = Yup.string()
  .required(`required`)
  .min(1, `too short`)
  .max(50, `too long`);

export const username = Yup.string()
  .required(`Required`)
  .min(3, `Too short`)
  .max(50, `Too long`);

export const password = Yup.string()
  .required(`Required`)
  .min(6, `Too short`)
  .max(20, `Too long`);



export const lastName = Yup.string()
  .required(`required`)
  .min(1, `too short`)
  .max(50, `too long`);

export const companyName = Yup.string()
  .required(`required`)
  .matches(
    /^[0-9A-Za-zéèùàçâêîôûäëïöüÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ_& ]{1,50}$/,
    `incorrect format`
  )
  .min(1, `too short`)
  .max(50, `too long`);

export const cbe = Yup.string()
  .matches(/0[0-9]{9}/, `incorrect format`)
  .required(`required`);

export const email = Yup.string()
  .email("Not a valid email")
  .required(`Required`)
  .min(2, `Too short`)
  .max(100, `Too long`);

export const year = {
  required: Yup.number()
    .typeError(`not a number`)
    .required(`required`)
    .min(1885, `car too old`)
    .max(2030, `car too young`),
  notRequired: Yup.number()
    .nullable()
    .typeError(`not a number`)
    .min(1885, `car too old`)
    .max(2030, `car too young`)
};

export const licensePlate = Yup.string()
  .matches(/^[A-Za-z0-9 -]{1,20}$/, `incorrect format`)
  .min(1, `too short`)
  .max(20, `too long`);

export const vinNumber = Yup.string()
  .matches(/^[A-Z0-9]{17,17}$/, `incorrect format`)
  .required(`required`);

export const captcha = Yup.string(`Required`)
  .matches(/[0-9a-zA-Z_-]{40}/)
  .nullable()
  .required(`Required`);

export const website = Yup.string(`required`)
  .matches()
  .nullable()
  .required(`required`);

export const numberplate = Yup.string(`required`);

export const nationalRegisterNr = Yup.string(`required`)
  .matches(
    /^[0-9][0-9].[0-9][0-9].[0-9][0-9]-[0-9][0-9][0-9].[0-9][0-9]$/,
    `incorrect format`
  )
  .nullable();

export const street = Yup.string()
.required(`required`)
.matches(
  /^[0-9A-Za-zéèùàçâêîôûäëïöüÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\- '.&’]{1,150}$/,
  `incorrect format`
)
.min(1, `too short`)
.max(150, `too long`);

export const zipcode = Yup.number()
  .typeError(`not a number`)
  .required(`required`)
  .min(1000, `too short`)
  .max(9999, `too long`);

export const housenr = Yup.string()
  .required(`required`)
  .matches(
    /^[a-z0-9\- /]{1,20}$/,
    `incorrect format`
  )
  .min(1, `too short`)
  .max(20, `too long`);

export const boxNr = Yup.string()
  .matches(/[a-zA-Z0-9\- /]{1,20}/, `incorrect format`)
  .min(1, `too short`)
  .max(20, `too long`)
  .nullable();

export const city = Yup.string()
  .required(`required`)
  .matches(
    /^[A-Za-zéèùàçâêîôûäëïöüÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\- '.&’]{1,150}$/,
    `incorrect format`
  )
  .min(1, `too short`)
  .max(150, `too long`);
