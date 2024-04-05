import { message } from 'antd';

// Define the type for the error to be handled
export type ErrorHandlerInput = string | Error | unknown;
export const handleError = (error: ErrorHandlerInput, defaultErrorMsg: string) => {
  let errorMessage = defaultErrorMsg; // Default error message

  if (typeof error === 'string') {
    // If error is a string
    errorMessage = error;
  } else if (error instanceof Error) {
    // If error is an instance of Error
    errorMessage = error.message;
  }

  console.error(error);
  message.error(errorMessage);
};
