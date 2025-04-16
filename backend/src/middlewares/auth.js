const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "http://stone-keycloak:8080/realms/stone-guide/protocol/openid-connect/certs",
  }),
  audience: "stone-backend",
  issuer: "http://localhost:8080/realms/stone-guide",
  algorithms: ["RS256"],
});

module.exports = checkJwt;
