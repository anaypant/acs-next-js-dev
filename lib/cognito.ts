import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js';

interface IdTokenPayload {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ''
};

export const userPool = new CognitoUserPool(poolData);

export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

export const signIn = async (username: string, password: string): Promise<CognitoUserSession> => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        resolve(result);
      },
      onFailure: (err: Error) => {
        reject(err);
      },
    });
  });
};

export const signOut = () => {
  const user = getCurrentUser();
  if (user) {
    user.signOut();
  }
};

export const getSession = async (): Promise<CognitoUserSession | null> => {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }

  return new Promise((resolve, reject) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
};

export const getIdTokenPayload = (session: CognitoUserSession): IdTokenPayload => {
  return session.getIdToken().payload as IdTokenPayload;
}; 