"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Classes required to create new account
const stellar_sdk_1 = require("stellar-sdk");
const fetch = require("node-fetch");
/**
 *  Generates a keypair and funds account with friendbot
 */
function createTestAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const pair = stellar_sdk_1.Keypair.random();
        console.log('Requesting Lumens');
        yield fetch(`https://horizon-testnet.stellar.org/friendbot?addr=${pair.publicKey()}`);
        return pair;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const pair = yield createTestAccount();
        console.log(`
    Congrats, you have a Stellar account in the test network!
    seed: ${pair.secret()}
    id: ${pair.publicKey()}
  `);
        const url = `https://horizon-testnet.stellar.org/accounts/${pair.publicKey()}`;
        console.log(`
    Loading account from test network:
    ${url}
  `);
        const response = yield fetch(url);
        const payload = yield response.json();
    });
}
function pay() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Tell the Stellar SDK you are using the testnet
            stellar_sdk_1.Network.useTestNetwork();
            // point to testnet host
            const stellarServer = new stellar_sdk_1.Server('https://horizon-testnet.stellar.org');
            // Never put values like the an account seed in code.
            const provisionerKeyPair = stellar_sdk_1.Keypair.fromSecret('SA72TGXRHE26WC5G5MTNURFUFBHZHTIQKF5AQWRXJMJGZUF4XY6HFWJ4');
            // Load account from Stellar
            const provisioner = yield stellarServer.loadAccount(provisionerKeyPair.publicKey());
            console.log('creating account in ledger', keypair.publicKey());
            const transaction = new stellar_sdk_1.TransactionBuilder(provisioner)
                .addOperation(
            // Operation to create new accounts
            stellar_sdk_1.Operation.createAccount({
                destination: keypair.publicKey(),
                startingBalance: '2'
            })).build();
            // Sign the transaction above
            transaction.sign(provisionerKeyPair);
            // Submit transaction to the server
            const result = yield stellarServer.submitTransaction(transaction);
            console.log('Account created: ', result);
        }
        catch (e) {
            console.log('Stellar account not created.', e);
        }
    });
}
exports.pay = pay;
;
//# sourceMappingURL=index.js.map