// Classes required to create new account
import {
    Keypair, // Keypair represents public and secret keys.
    Network, // Network provides helper methods to get the passphrase or id for different stellar networks.
    Operation, // Operation helps you represent/build operations in Stellar network.
    Server, // Server handles the network connections.
    TransactionBuilder // Helps you construct transactions.
  } from 'stellar-sdk';
import * as fetch from 'node-fetch'

/**
 *  Generates a keypair and funds account with friendbot
 */
async function createTestAccount() {
  const pair = Keypair.random()
  console.log('Requesting Lumens')

  await fetch(`https://horizon-testnet.stellar.org/friendbot?addr=${pair.publicKey()}`)

  return pair
}

async function run() {
  const pair = await createTestAccount()

  console.log(`
    Congrats, you have a Stellar account in the test network!
    seed: ${pair.secret()}
    id: ${pair.publicKey()}
  `)

  const url = `https://horizon-testnet.stellar.org/accounts/${pair.publicKey()}`

  console.log(`
    Loading account from test network:
    ${url}
  `)

  const response = await fetch(url)
  const payload = await response.json()
}
  /*
export async function pay(){

  try {
      // Tell the Stellar SDK you are using the testnet
      Network.useTestNetwork();
      // point to testnet host
      const stellarServer = new Server('https://horizon-testnet.stellar.org');
    
      // Never put values like the an account seed in code.
      //const provisionerKeyPair = Keypair.fromSecret('SA72TGXRHE26WC5G5MTNURFUFBHZHTIQKF5AQWRXJMJGZUF4XY6HFWJ4')
    
      // Load account from Stellar
      const provisioner = await stellarServer.loadAccount(provisionerKeyPair.publicKey())
    
      console.log('creating account in ledger', keypair.publicKey())
      const transaction = new TransactionBuilder(provisioner)
            .addOperation(
              // Operation to create new accounts
              Operation.createAccount({
                destination: keypair.publicKey(),
                startingBalance: '2'
              })
            ).build()
    
      // Sign the transaction above
      transaction.sign(provisionerKeyPair)
    
      // Submit transaction to the server
      const result = await stellarServer.submitTransaction(transaction);
      console.log('Account created: ', result)
    } catch (e) {
      console.log('Stellar account not created.', e)
    }
};
*/
  