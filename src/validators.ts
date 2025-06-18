import {checkSchema, oneOf} from 'express-validator';

export const isEmailValid = checkSchema({
  email: {
    notEmpty: {errorMessage: 'email is empty'},
    isEmail:  {errorMessage: 'Invalid email format'},
    toLowerCase: true,
  }
}); 

export const isMobileValid = checkSchema({
  mobile: {
    notEmpty: {errorMessage: 'mobile is empty'},
    isMobilePhone: {errorMessage: 'Invalid mobile format'},
  },
})

export const mobAndMailCantCoexist = checkSchema({
    mobileAndEmail : {
        custom: {
          options: (_, { req }) => {
            if (!req.body.email && !req.body.mobile) {
              throw new Error('Either email or mobile must be provided');
            }
            if (req.body.email && req.body.mobile) {
              throw new Error('Email and mobile cannot exist at the same time');
            }
            return true;
          },
        },
    }
})

export const isPasswordStrong = checkSchema({
    password: {
        trim: true,
        notEmpty: {errorMessage: 'Password can\'t be empty'},
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be atleast 8 character'
        }
    }
})


