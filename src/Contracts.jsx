import { openContractCall, openContractDeploy } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode, noneCV, principalCV, uintCV } from '@stacks/transactions';
import { useAddress, useNetwork } from '../atoms';

// CONTRACT_CALL

const Contracts = () => {
    const stacksNetwork = useNetwork() === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    const [address] = useAddress();

    const handleCall = () => {
        const functionArgs = [
            uintCV(100),
            principalCV(address),
            principalCV('SP31PNYDZ8Q86B47BYW67YD9PVXVSZ3JRJAN9DJDK'),
            noneCV(),
        ];

        const contractCallOptions = {
            network: stacksNetwork,
            anchorMode: AnchorMode.Any,
            contractAddress: 'SP351ZJK9F5AWZJEEZGZ7NZKSRKA65EWFRR48V9KS',
            contractName: 'ALL',
            functionName: 'transfer',
            functionArgs,
            postConditionMode: PostConditionMode.Any,
            postConditions: [],
        }
        openContractCall(contractCallOptions, window.AsignaProvider);
    }

    const handleDeploy = () => {
        const contractDeployOptions = {
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
            postConditionMode: PostConditionMode.Any,
            postConditions: [],
            network: stacksNetwork,
        }
        openContractDeploy(contractDeployOptions, window.AsignaProvider);
    }

    return <div style={{display: 'flex', gap: 18, fontWeight: 'bold', fontSize: 20}}>
        <div onClick={handleCall}>Call</div>
        <div onClick={handleDeploy}>Deploy</div>
    </div>
}

export default Contracts;