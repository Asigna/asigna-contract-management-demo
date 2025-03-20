import React from 'react';
import { openContractCall, openContractDeploy, openSTXTransfer } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode,BytesReader, deserializeTransaction, broadcastTransaction, PostConditionMode, noneCV, principalCV, uintCV, makeUnsignedSTXTokenTransfer, makeUnsignedContractCall } from '@stacks/transactions';
import { useAddress, useNetwork } from '../atoms';
import { bytesToHex } from '@stacks/common';
import { useAsignaConnect, useAsignaOptions } from '@asigna/stx-connect';
import { Buffer } from 'buffer';
// import {useAsignaOptions, useAsignaConnect} from './asigna';
// CONTRACT_CALL

const Contracts = () => {
    const stacksNetwork = useNetwork() === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    const [address] = useAddress();
    
    const transferOptions = {
        recipient: 'SP31PNYDZ8Q86B47BYW67YD9PVXVSZ3JRJAN9DJDK',
        amount: '2000',
        network: new StacksMainnet(),
        anchorMode: AnchorMode.Any,
        // fee: 2222,
    }
    const functionArgs = [
        uintCV(100),
        principalCV(address),
        principalCV('SP31PNYDZ8Q86B47BYW67YD9PVXVSZ3JRJAN9DJDK'),
        noneCV(),
    ];
    const callOptions = {
        network: new StacksMainnet(),
        anchorMode: AnchorMode.Any,
        contractAddress: 'SP351ZJK9F5AWZJEEZGZ7NZKSRKA65EWFRR48V9KS',
        contractName: 'ALL2',
        functionName: 'transfer',
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        fee: 60000,
    }
    
    const deployOptions = {
        contractName: 'arkadiko-token',
        codeBody: `
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(impl-trait .arkadiko-dao-token-trait-v1.dao-token-trait)

;; Defines the Arkadiko Governance Token according to the SIP010 Standard
(define-fungible-token diko)

(define-data-var token-uri (string-utf8 256) u"")
(define-data-var contract-owner principal tx-sender)

;; errors
(define-constant ERR-NOT-AUTHORIZED u1401)`,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        network: stacksNetwork,
    }


    const {openAsignaStxTokenTransfer, openAsignaContractCall, openAsignaDeployContract} = useAsignaConnect();


    const handleSend = async (withModal) => {
        if (withModal) {
            const got = await openAsignaStxTokenTransfer(transferOptions, {});
        } else {
            openSTXTransfer(transferOptions, window.AsignaProvider);
        }
    }

    const handleCall = async (withModal) => {
        if (withModal) {
            makeUnsignedContractCall(callOptions)
            const res = await openAsignaContractCall(callOptions, {});
        } else {
            openContractCall(callOptions,  window.AsignaProvider);
        }
    }

    const handleDeploy = async (withModal) => {
        if (withModal) {
            const res = await openAsignaDeployContract(deployOptions, {});
        } else {
            openContractDeploy(deployOptions,  window.AsignaProvider);
        }
    }

    return <div style={{display: 'flex', flexDirection: 'column', gap: 18, fontWeight: 'bold', fontSize: 20}}>
        <div>
            <div onClick={() => handleCall()}>Call</div>
            <div onClick={() => handleSend()}>Send</div>
            <div onClick={() => handleDeploy()}>Deploy</div>
        </div>
        <div>
            <div>Waiting modal actions:</div>
            <div onClick={() => handleCall(true)}>Call</div>
            <div onClick={() => handleSend(true)}>Send</div>
            <div onClick={() => handleDeploy(true)}>Deploy</div>
        </div>
    </div>
}

export default Contracts;