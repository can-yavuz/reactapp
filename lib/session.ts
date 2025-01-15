export const startSession = (user: object, jwt: string) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("jwt", jwt);
};
