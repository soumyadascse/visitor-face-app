export const maskMobile = (mobile: string) => {
  if (!mobile || mobile.length < 10) {
    return mobile;
  }

  return `${mobile.slice(0, 2)}******${mobile.slice(-2)}`;
};