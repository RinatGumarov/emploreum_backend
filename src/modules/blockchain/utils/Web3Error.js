function Web3InitError(message) {
    this.name = 'Web3InitError';
    this.message = message || 'web3 is not defined, please use initWeb3() before use any function';
    this.stack = (new Error()).stack;
}

Web3InitError.prototype = Object.create(Error.prototype);
Web3InitError.prototype.constructor = Web3InitError;

module.exports = Web3InitError;