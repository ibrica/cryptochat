"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Classes required to create new account
var stellar_sdk_1 = require("stellar-sdk");
var fetch = require("node-fetch");
/**
 *  Generates a keypair and funds account with friendbot
 */
function createTestAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var pair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pair = stellar_sdk_1.Keypair.random();
                    console.log('Requesting Lumens');
                    return [4 /*yield*/, fetch("https://horizon-testnet.stellar.org/friendbot?addr=" + pair.publicKey())];
                case 1:
                    _a.sent();
                    return [2 /*return*/, pair];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var pair, url, response, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createTestAccount()];
                case 1:
                    pair = _a.sent();
                    console.log("\n    Congrats, you have a Stellar account in the test network!\n    seed: " + pair.secret() + "\n    id: " + pair.publicKey() + "\n  ");
                    url = "https://horizon-testnet.stellar.org/accounts/" + pair.publicKey();
                    console.log("\n    Loading account from test network:\n    " + url + "\n  ");
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    payload = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pay() {
    return __awaiter(this, void 0, void 0, function () {
        var stellarServer, provisionerKeyPair, provisioner, transaction, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Tell the Stellar SDK you are using the testnet
                    stellar_sdk_1.Network.useTestNetwork();
                    stellarServer = new stellar_sdk_1.Server('https://horizon-testnet.stellar.org');
                    provisionerKeyPair = stellar_sdk_1.Keypair.fromSecret('SA72TGXRHE26WC5G5MTNURFUFBHZHTIQKF5AQWRXJMJGZUF4XY6HFWJ4');
                    return [4 /*yield*/, stellarServer.loadAccount(provisionerKeyPair.publicKey())];
                case 1:
                    provisioner = _a.sent();
                    console.log('creating account in ledger', keypair.publicKey());
                    transaction = new stellar_sdk_1.TransactionBuilder(provisioner)
                        .addOperation(
                    // Operation to create new accounts
                    stellar_sdk_1.Operation.createAccount({
                        destination: keypair.publicKey(),
                        startingBalance: '2'
                    })).build();
                    // Sign the transaction above
                    transaction.sign(provisionerKeyPair);
                    return [4 /*yield*/, stellarServer.submitTransaction(transaction)];
                case 2:
                    result = _a.sent();
                    console.log('Account created: ', result);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log('Stellar account not created.', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.pay = pay;
;
