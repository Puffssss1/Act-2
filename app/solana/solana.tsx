import React from 'react'
import { Connection, Keypair, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, TransactionConfirmationStrategy } from "@solana/web3.js";
import { useState } from "react";
import base58 from 'bs58'


export default function Solana() {
    const keypair = Keypair.generate();
    const connection = new Connection(clusterApiUrl('devnet') , "confirmed")

    const [PubKey, setPubkey] = useState<string | null>(null);
    const [SecreteKey, setSecreteKey] = useState<string | null>(null);
    const [bs58Key, setbs58Key] = useState<string | null>(null);


    const newWallet =() => {
        const decodedSecreteKey = keypair.secretKey;
        const bs58Key = base58.encode(decodedSecreteKey);

        setPubkey(keypair.publicKey.toBase58());
        setSecreteKey(keypair.secretKey.toString());
        setbs58Key(bs58Key.toString());

        console.log(keypair.publicKey.toBase58())
        console.log(keypair.secretKey.toString())
        console.log(bs58Key.toString())
    }

    
    const [balance, setBalance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

      // const Wallet = async () => {
      //   const wallet = new PublicKey(keypair.publicKey.toBase58())
      //   const balance = await connection.getBalance(wallet)
      //   console.log('Public Key', wallet)
      //   console.log('Balance is', balance/LAMPORTS_PER_SOL)
      //   };

    const checkWAllet = async () => {
      if (PubKey) {
        try {
          const wallet = new PublicKey(PubKey);
          const balanceLamports = await connection.getBalance(wallet);
          setBalance(balanceLamports / LAMPORTS_PER_SOL);
          console.log('Balance', balanceLamports)
          console.log('Public is', PubKey)
        } catch (e) {
          setError('you have an error fetting balance');
          console.error(e);
        }
      } else {
        console.error('public key is not set');
      }
      };

      //from documentaion
      // const RequestAirdrop = async () => {
      //   const wallet = new PublicKey(PubKey);
      //   const signature = await connection.requestAirdrop(myAddress, LAMPORTS_PER_SOL);
      //   await connection.confirmTransaction(signature);
      // }
      
      const RequestAirdrop = async() =>{
        try {
          if (PubKey) {
            const wallet = new PublicKey(PubKey);
            const signature = await connection.requestAirdrop(wallet, LAMPORTS_PER_SOL);
            console.log('Airdrop requested, signature:', signature);
          } else {
            console.error('Public key is not set');
          }
        } catch (e) {
          setError('Error requesting airdrop');
          console.error(e);
        }
      }
    return (
        <>
            <div className="bg-customgrey p-8 border border-customteal ">
                <h1 className="mb-4 text-center">Solana Wallet Tools</h1>
                    <button onClick={newWallet} className="mb-4 border border-customteal p-2 rounded">Generate New Wallet</button> 
                    
                    <p className="mb-2">New Wallet</p> 

                    {/* Public key */}
                    <p className="font-semibold">PubKey:</p> 
                    <p className="mb-4 break-words">{PubKey}</p> 

                    {/* Secret key */}
                    <p className="font-semibold">Secret:</p>
                    <p className="mb-4 break-words">{SecreteKey}</p> 

                    {/* Base 68 key */}
                    <p className="font-semibold">Secret (Base58):</p> 
                    <p className="break-words">{bs58Key}</p>

                    <button onClick={RequestAirdrop} className="mt-14 mb-4 border border-customteal p-2 rounded">Request Airdrop</button>
                     {/* Requesting Airdrop */}
                    <p className="font-semibold">New Wallet Ballance: {balance}</p> 

                    <div>
                     <button onClick={checkWAllet} className="mt-14 mb-4 border border-customteal p-2 rounded">
                        Check Wallet
                     </button>
                     {/* Displaying the balance */}
                      <p className="font-semibold">Wallet Balance: {balance !== null ? `${balance} SOL` : 'Fetching...'}</p>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
            </div>
        </>
      )
}
