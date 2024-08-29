export const CART_EXPIRATION_TIME = 172800000;

export const createUUID = (length: number = 12) => {
  return Math.random().toString(36).slice(2, length);
};
