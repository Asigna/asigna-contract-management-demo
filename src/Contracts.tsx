import React from 'react';
import { request } from '@stacks/connect';
import { noneCV, principalCV, uintCV } from '@stacks/transactions';
import { useAddress, useNetwork } from '../atoms';

const Contracts = () => {
    const network = useNetwork();
    const [address] = useAddress();

    const transferOptions = {
        recipient: 'SP31PNYDZ8Q86B47BYW67YD9PVXVSZ3JRJAN9DJDK',
        amount: '2000',
        network,
    };

    const functionArgs = [
        uintCV(100),
        principalCV(address),
        principalCV('SP31PNYDZ8Q86B47BYW67YD9PVXVSZ3JRJAN9DJDK'),
        noneCV(),
    ];

    const callOptions = {
        contract: 'SP351ZJK9F5AWZJEEZGZ7NZKSRKA65EWFRR48V9KS.ALL2' as `${string}.${string}`,
        functionName: 'transfer',
        functionArgs,
        network,
    };

    const deployOptions = {
        name: 'arkadiko-token',
        clarityCode: `
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(impl-trait .arkadiko-dao-token-trait-v1.dao-token-trait)

;; Defines the Arkadiko Governance Token according to the SIP010 Standard
(define-fungible-token diko)

(define-data-var token-uri (string-utf8 256) u"")
(define-data-var contract-owner principal tx-sender)

;; errors
(define-constant ERR-NOT-AUTHORIZED u1401)`,
        network,
    };

    const handleSend = async () => {
        await request('stx_transferStx', transferOptions);
    };

    const handleCall = async () => {
        await request('stx_callContract', callOptions);
    };

    const handleDeploy = async () => {
        await request('stx_deployContract', deployOptions);
    };

    return (
        <div style={{ display: 'flex', gap: 18, fontWeight: 'bold', fontSize: 20 }}>
            <div>
                <div>Actions</div>
                <div onClick={handleCall} style={{ cursor: 'pointer' }}>Call</div>
                <div onClick={handleSend} style={{ cursor: 'pointer' }}>Send</div>
                <div onClick={handleDeploy} style={{ cursor: 'pointer' }}>Deploy</div>
            </div>
        </div>
    );
};

export default Contracts;
