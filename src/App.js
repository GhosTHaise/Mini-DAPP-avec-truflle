import './App.css';
import {useState,useEffect} from 'react'
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const GreeterAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

function App() {
  
  const [Greeting,setGreetingValue] = useState();

  useEffect(()=>{
      fetchGreeting();
  },[]);

  const requestAccount = async() => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }
  const fetchGreeting = async() =>{
    if(typeof(window.ethereum) !== 'undifined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const Contract = new ethers.Contract(GreeterAddress,Greeter.abi,provider);
      try{
        const res = await Contract.greet();
        setGreetingValue(res);
      }catch(error){
        console.log(error)
      }
    }
  }
  const setGreeting = async() => {
    if(!Greeting) return
    if(typeof window.ethereum !== 'undifined'){
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(GreeterAddress,Greeter.abi,signer);
        const transaction = await Contract.setGreeting(Greeting);
        setGreetingValue('');
        await transaction.wait()
        fetchGreeting();
    }
  }
  const changeGreeting = (e) => {
    setGreetingValue(e.target.value);
    console.log("greeting has ben changed")
  }
  return (
    <div className="App">
        <h4>{Greeting}</h4>
        <input onChange={changeGreeting} placeholder='Enter un texte' />
        <button onClick={setGreeting} >Envoyer</button>
    </div>
  );
}

export default App;
