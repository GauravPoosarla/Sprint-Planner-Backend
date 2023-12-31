const OktaJwtVerifier = require('@okta/jwt-verifier');
require('dotenv').config();

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: 'https://' + process.env.OKTA_DOMAIN + '/oauth2/default',
  assertClaims: {
    aud: 'api://default',
    cid: process.env.OKTA_CLIENT_ID,
  },
});

const validateToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'missing okta token' });
    }
    const accessToken = req.headers.authorization;
    const audience = 'api://default';

    const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, audience);
    req.user = {
      uid: jwt.claims.uid,
      username: jwt.claims.sub,
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'invalid okta token' });
  }
};

module.exports = validateToken;
