import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';
import './App.css'
import Contracts from './Contracts.tsx';
import { useAddress } from '../atoms';
import { useEffect } from 'react';

function App() {
  const [address, setAddress] = useAddress();

  // Hydrate address from localStorage if already connected
  useEffect(() => {
    if (isConnected()) {
      const data = getLocalStorage();
      setAddress(data?.addresses?.stx?.[0]?.address);
    }
  }, []);

  const handleConnect = async () => {
    await connect();
    const data = getLocalStorage();
    setAddress(data?.addresses?.stx?.[0]?.address);
  };

  const handleDisconnect = () => {
    disconnect();
    setAddress(undefined);
  };

  if (!address) {
    return <div onClick={handleConnect}>Connect</div>;
  }

  return <div>
    Connected with {address}
    <div onClick={handleDisconnect} style={{ cursor: 'pointer', fontSize: 14 }}>Disconnect</div>
    <Contracts />
  </div>;
}

export default App;
