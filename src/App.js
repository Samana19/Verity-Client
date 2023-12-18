import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Verity from "./abis/Verity.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [verity, setVerity] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    if (!window.ethereum) {
      console.error("Ethereum provider not found");
      // Handle the absence of Ethereum provider, e.g., display a message to the user
      alert('Please install MetaMask and refresh the page');
      return;
    }
    
    try {
      // Connect to Blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
  
      const network = await provider.getNetwork();
      console.log(network);
  
      // Connect to Smart Contracts
      const verity = new ethers.Contract(
        config[network.chainId].verity.address,
        Verity,
        provider
      );
      setVerity(verity);
  
      // Load Products
      const items = [];
  
      for (var i = 0; i < 9; i++) {
        const item = await verity.items(i + 1);
        items.push(item);
      }
  
      const electronics = items.filter((item) => item.category === "electronics");
      const clothing = items.filter((item) => item.category === "clothing");
      const toys = items.filter((item) => item.category === "toys");
  
      setElectronics(electronics);
      setClothing(clothing);
      setToys(toys);
    } catch (error) {
      console.error("Error initializing provider:", error.message);
      // Handle the error, e.g., display a message to the user
    }
  };
  

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2> Best Sellers</h2>
      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing and Jewellery"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics and Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section
            title={"Toys and Gaming"}
            items={toys}
            togglePop={togglePop}
          />
        </>
      )}

      {
        toggle && (
          <Product item={item} provider={provider} account={account} verity={verity} togglePop={togglePop} />
        )
      }
    </div>
  );
}

export default App;