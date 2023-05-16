require('dotenv').config();
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
  generateRefreshToken: (payload) => {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifact = Jwt.token.decode(refreshToken);
      Jwt.token.verify(artifact, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artifact.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidal valid');
    }
  },
};

module.exports = TokenManager;
