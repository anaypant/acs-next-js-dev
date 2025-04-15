// src/lib/cognito-server.ts
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    SignUpCommandInput,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    AttributeType,
    AuthFlowType,
    AuthenticationResultType,
    ConfirmSignUpCommand,
    ConfirmSignUpCommandInput
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';

const cognitoRegion = process.env.NEXT_PUBLIC_COGNITO_REGION!;
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const clientSecret = process.env.COGNITO_CLIENT_SECRET;

if (!cognitoRegion || !userPoolId || !clientId || !clientSecret) {
    throw new Error("Cognito environment variables are not fully configured.");
}

const cognitoClient = new CognitoIdentityProviderClient({ region: cognitoRegion });

const calculateSecretHash = (username: string): string => {
    const message = username + clientId;
    const hmac = crypto.createHmac('SHA256', clientSecret!);
    hmac.update(message);
    return hmac.digest('base64');
};

interface CognitoResult {
    success: boolean;
    message?: string;
    userSub?: string;
    tokens?: AuthenticationResultType;
    userConfirmed?: boolean;
    challengeName?: string;
    session?: string;
}

export const signUpUser = async (email: string, password: string, attributes: Record<string, any>): Promise<CognitoResult> => {
    if (!email || !password) {
        throw new Error("Email and password are required for sign up.");
    }

    const userAttributes: AttributeType[] = [
        { Name: 'email', Value: email },
    ];

    if (attributes.name) {
        const [givenName, ...familyNameParts] = attributes.name.trim().split(/\s+/);
        const familyName = familyNameParts.join(' ') || givenName;
        userAttributes.push(
            { Name: 'given_name', Value: givenName },
            { Name: 'family_name', Value: familyName }
        );
    }

    try {
        const response = await cognitoClient.send(new SignUpCommand({
            ClientId: clientId,
            Username: email,
            Password: password,
            UserAttributes: userAttributes,
            SecretHash: calculateSecretHash(email),
        }));
        
        return {
            success: true,
            userConfirmed: response.UserConfirmed || false,
            userSub: response.UserSub
        };
    } catch (error: any) {
        console.error('Cognito Sign Up Error:', error);
        return {
            success: false,
            message: error.name === 'UsernameExistsException' 
                ? 'An account with this email already exists.'
                : error.message
        };
    }
};

export const confirmSignUpUser = async (email: string, code: string): Promise<CognitoResult> => {
    try {
        await cognitoClient.send(new ConfirmSignUpCommand({
            ClientId: clientId,
            Username: email,
            ConfirmationCode: code,
            SecretHash: calculateSecretHash(email),
        }));

        // After confirmation, automatically sign in
        return signInUser(email, code);
    } catch (error: any) {
        console.error('Cognito Confirm Sign Up Error:', error);
        return {
            success: false,
            message: error.name === 'CodeMismatchException'
                ? 'Invalid confirmation code.'
                : error.message
        };
    }
};

export const signInUser = async (email: string, password: string): Promise<CognitoResult> => {
    try {
        const response = await cognitoClient.send(new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: calculateSecretHash(email)
            }
        }));

        if (response.AuthenticationResult) {
            return {
                success: true,
                tokens: response.AuthenticationResult
            };
        }

        return {
            success: false,
            message: response.ChallengeName 
                ? `Authentication challenge required: ${response.ChallengeName}`
                : 'Failed to authenticate'
        };
    } catch (error: any) {
        console.error('Cognito Sign In Error:', error);
        return {
            success: false,
            message: error.name === 'NotAuthorizedException'
                ? 'Incorrect email or password.'
                : error.message
        };
    }
};

// Add functions for signOut, forgotPassword, resetPassword etc. as needed using the SDK