import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import './App.css'
import Contracts from './Contracts';
import { useAddress, useNetwork } from '../atoms';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const myAppName = 'Demo';
const myAppIcon = '';

function App() {
  const network = useNetwork();
  const [address, setAddress] = useAddress();

  const handleConnect = () => showConnect({
    userSession,
    appDetails: {
      name: myAppName,
      icon: myAppIcon,
    },
    onFinish: (resp) => {
      setAddress(resp.authResponsePayload.profile.stxAddress[network]);
    },
    onCancel: () => {},
  });

  if (!address) {
    return <div onClick={handleConnect}>
      Connect
    </div>
  }

  return <div>
    Connected with {address}
    <Contracts />
  </div>
}
export default App;