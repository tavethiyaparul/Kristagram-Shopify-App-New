const errors = {
  BAD_REQUEST: {
    code: "E_BAD_REQUEST",
    success: false,
    message: "The request cannot be fulfilled due to bad syntax",
    status: 400,
  },

  CREATED: {
    code: "CREATED",
    message:
      "The request has been fulfilled and resulted in a new resource being created",
    status: 201,
  },

  FORBIDDEN: {
    code: "E_FORBIDDEN",
    success: false,
    message: "User not authorized to perform the operation",
    status: 403,
  },

  DATA_EXIST: {
    code: "ALREADY_EXIST",
    success: false,
    message: "Data already exists",
    status: 403,
  },

  NOT_FOUND: {
    code: "E_NOT_FOUND",
    success: false,
    message:
      "The requested resource could not be found but may be available again in the future",
    status: 404,
  },

  OK: {
    response_code: "SUCCESS",
    success: true,
    message: "Operation is successfully executed",
    status: 201,
  },

  SERVER_ERROR: {
    code: "E_INTERNAL_SERVER_ERROR",
    success: false,
    message: "Something bad happened on the server",
    status: 500,
  },

  UNAUTHORIZED: {
    code: "E_UNAUTHORIZED",
    success: false,
    message: "Missing or invalid authentication",
    status: 401,
  },

  SUCCESS: {
    response_code: "SUCCESS",
    success: true,
    message: "Data retreived successfully",
    status: 200,
  },

  NOT_SUPPORTED: {
    success: false,
    response_code: "NOT_SUPPORTED",
    status: 501,
  },

  VERIFICATION_SUCCESS: {
    response_code: "0",
    success: true,
    message: "Congratulation, you verified successfully.",
  },

  DATA_FOUND: {
    response_code: "0",
    success: true,
    message: "Data retreived successfully.",
  },

  DB_QUERY_ERROR: {
    response_code: "1",
    success: false,
    message:
      "Something went wrong with database query, please try again later.",
    status: "error",
  },

  MANDATORY_FIELDS: {
    success: false,
    message: "Please provide all mandatory values.",
    status: "400",
  },

  INVALID_FIELDS: {
    success: false,
    message: "Please provide valid values.",
    status: "400",
  },

  PARAMETER_OR_VALUE_NOT_FOUND: {
    response_code: "1",
    success: false,
    message: "Parameter or value missing",
    status: "error",
  },

  DATA_NOT_FOUND: {
    response_code: "1",
    message: "No Data Found.",
    success: false,
    status: "error",
  },

  WENT_WRONG: {
    response_code: "2",
    success: false,
    message: "Something went wrong, please try again later.",
    status: "error",
  },
};

export default errors;
