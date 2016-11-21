'use strict';

const RefreshToken = function () {};

RefreshToken.prototype.grant_type = function (grantType) {
    this.grant_type = grantType;
}

RefreshToken.prototype.refresh_token = function (refreshToken) {
    this.refresh_token = refreshToken;
}

module.exports = RefreshToken;