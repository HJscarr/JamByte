export type UserAttributes = {
  username: string;
  email: string;
  firstName: string;  
};

export type AmplifyUser = {
  attributes: UserAttributes;
};
