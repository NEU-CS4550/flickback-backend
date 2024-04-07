export const error = (res, message) => {
  res.status(400).json(message);
};

export const success = (res, message = "OK") => {
  res.status(200).json(message);
};
