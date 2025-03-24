import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-2_Ntq3NaSwa",
    ClientId: "10791d42be3ld4hgcbauf1qat3"  // Replace with your Cognito App Client ID
};

const userPool = new CognitoUserPool(poolData);

export default userPool;