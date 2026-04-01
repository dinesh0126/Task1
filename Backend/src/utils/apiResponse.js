export const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const payload = {
    success: statusCode < 400,
    message
  };

  if (data !== null) {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};
