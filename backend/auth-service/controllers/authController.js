// const AWS = require('aws-sdk');

const { getParameterValue, getCognitoParameterValue } = require('./parameterManager');

const Cognito = require("@aws-sdk/client-cognito-identity-provider");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const cognitoClient = new Cognito.CognitoIdentityProviderClient( "ap-southeast-2");


// Signup process
exports.signUp = async (req, res) => {
    const { username, password, email } = req.body;
    const { ClientId, UserPoolId } = await getCognitoParameterValue();

    const signUpCommand = new Cognito.SignUpCommand({
        ClientId: ClientId,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
    });

    try {
        const signUpResult = await cognitoClient.send(signUpCommand);

        // Auto-confirm the user in Cognito (without email verification)
        const confirmCommand = new Cognito.AdminConfirmSignUpCommand({
            UserPoolId: UserPoolId,
            Username: username,
        });
        await cognitoClient.send(confirmCommand);

        // Add user to 'user' group
        const addUserToGroupCommand = new Cognito.AdminAddUserToGroupCommand({
            UserPoolId: UserPoolId,
            Username: username,
            GroupName: 'user',
        });
        await cognitoClient.send(addUserToGroupCommand);

        res.json({ message: 'Signup and auto-confirmation was successful', result: signUpResult });
    } catch (error) {
        console.error("Signup or confirmation error:", error);
        res.status(400).json({ error: error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const { ClientId, UserPoolId } = await getCognitoParameterValue();

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: ClientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        }
    };

    try {
        const data = await cognitoClient.send(new Cognito.InitiateAuthCommand(params));

        if (data.AuthenticationResult) {
            const idToken = data.AuthenticationResult.IdToken;
            const accessToken = data.AuthenticationResult.AccessToken;
            const refreshToken = data.AuthenticationResult.RefreshToken;

            // Retrieve user groups
            const getUserGroupsCommand = new Cognito.AdminListGroupsForUserCommand({
                UserPoolId: UserPoolId,
                Username: username,
            });

            const groupData = await cognitoClient.send(getUserGroupsCommand);
            const userGroups = groupData.Groups.map(group => group.GroupName);

            return res.json({
                message: 'Login successful',
                idToken,
                accessToken,
                userGroups,
            });
        } else {
            throw new Error("Authentication failed. No tokens returned.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(400).json({ error: error.message, details: error });
    }
};

// Token verification
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token']; // Expect token in headers
    if (!token) return res.status(403).json({ message: 'No token provided' });

    const { UserPoolId, ClientId } = await getCognitoParameterValue();

    const verifier = CognitoJwtVerifier.create({
        userPoolId: UserPoolId,
        tokenUse: "id",
        clientId: ClientId,
    });

    try {
        const payload = await verifier.verify(token);
        req.userId = payload.sub;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: 'Token verification failed', error: err.message });
    }
};

