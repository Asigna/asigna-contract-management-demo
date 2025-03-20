import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import './App.css'
import Contracts from './Contracts.tsx';
import { useAddress, useNetwork } from '../atoms';
import { AsignaSignActionModals, useAsignaConnect, useAsignaSafeInfo } from '@asigna/stx-connect';
import { useEffect } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const myAppName = 'Demo';
const myAppIcon = '';

function App() {
  const network = useNetwork();
  const [address, setAddress] = useAddress();
  const {requestSafeInfo} = useAsignaConnect();

  const handleConnect = () => showConnect({
    userSession,
    appDetails: {
      name: myAppName,
      icon: myAppIcon,
    },
    onFinish: (resp) => {
      console.log(resp)
      setAddress(resp.authResponsePayload.profile.stxAddress[network]);
    },
    onCancel: () => {},
  });


  useEffect(() => {
    requestSafeInfo();
  }, []);

  if (!address) {
    return <div onClick={handleConnect}>
      Connect
    </div>
  }


  return <div>
    Connected with {address}
    <Contracts />
    <AsignaSignActionModals/>
  </div>
}
export default App;