import { useState, useRef } from "react";
import Web3 from "web3";
import COMMON_ABI from "../common/ABI";
import getAddressFrom from "../utils/AddressExtractor";
import sendTransaction from "../utils/TxSender";
import IpfsAPI from "ipfs-api";
import { Buffer } from "buffer";
/**
 * [등록하기]를 위한 UI와 기능
 */
const TestPage = () => {
  // [변수] 아이템 (파일, 이름, input 클릭 참조), 작가명, 제목, 아이템 소개, 토큰 ID
  const [item, setItem] = useState("");
  const [itemName, setItemName] = useState("");
  const itemSelect = useRef();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [privKey, setPrivKey] = useState("");

  // Web3
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.REACT_APP_ETHEREUM_RPC_URL)
  );
  const NFTContract = new web3.eth.Contract(
    COMMON_ABI.CONTRACT_ABI.NFT_ABI,
    process.env.REACT_APP_NFT_CA
  );
  const SSFContract = new web3.eth.Contract(
    COMMON_ABI.CONTRACT_ABI.ERC_ABI,
    process.env.REACT_APP_ERC20_CA
  );
  // 아이템 업로드 핸들링
  const handleItem = (value) => {
    setItem(value);
    if (value !== "") setItemName(value.name);
    else setItemName("");
  };

  // 개인키 입력 핸들링
  const handlePrivKey = (e) => {
    setPrivKey(e.target.value);
  };

  const addItem = async () => {
    let address = getAddressFrom(privKey);
    if (address) {
      const fr = new FileReader();
      var ipfs = IpfsAPI(process.env.REACT_APP_IPFS_IP);
      fr.readAsArrayBuffer(item);
      fr.onload = () => {
        ipfs.files.add(Buffer.from(fr.result), (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          const imageURL = "https://ipfs.io/ipfs/" + res[0].hash;
          let metadata = {
            fileName: itemName,
            name: title,
            author: author,
            description: description,
            imageURL: imageURL,
          };
          console.log(JSON.stringify(metadata));
          ipfs.files.add(Buffer.from(JSON.stringify(metadata)), (err, res) => {
            let tokenURI = "https://ipfs.io/ipfs/" + res[0].hash;
            console.log(tokenURI);
            web3.eth.getBalance(address).then(console.log);
            sendTransaction(
              address,
              privKey,
              process.env.REACT_APP_NFT_CA,
              NFTContract.methods.create(address, tokenURI).encodeABI()
            );
          });
        });
      };
    }
  };
  const ssfGetBalance = () => {
    SSFContract.methods.balanceOf(getAddressFrom(privKey)).call((err, res) => {
      console.log(res);
    });
  };
  const nftGetBalance = () => {
    NFTContract.methods
      .getOwnedTokens(getAddressFrom(privKey))
      .call((err, res) => {
        console.log(res);
      });
  };
  const getToken = () => {
    NFTContract.methods.tokenURI(tokenId).call((err, res) => {
      console.log(res);
    });
  };
  return (
    <div>
      <h2>프라이빗 키 입력</h2>
      <input type="text" onChange={handlePrivKey}></input>
      <h2>NFT 민팅하기</h2>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        ref={itemSelect}
        onChange={(e) =>
          e.target.files.length !== 0
            ? handleItem(e.target.files[0])
            : handleItem("")
        }
      />
      <br />
      <label htmlFor="title">제목 :</label>
      <input
        type="text"
        id="title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <label htmlFor="author">창작자 이름 :</label>
      <input
        type="text"
        id="author"
        onChange={(e) => {
          setAuthor(e.target.value);
        }}
      />
      <br />
      <label htmlFor="title">제목 :</label>
      <input
        type="text"
        id="title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <label htmlFor="description">아이템 소개 :</label>
      <input
        type="text"
        id="description"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />
      <button onClick={addItem}>민팅하기</button>
      <h2>SSF 잔액 조회하기</h2>
      <button onClick={ssfGetBalance}>조회하기</button>
      <h2>내 NFT 조회하기</h2>
      <button onClick={nftGetBalance}>조회하기</button>
      <h2>NFT 상세 조회하기</h2>
      <label htmlFor="tokenId">토큰 Id</label>
      <input
        type="text"
        id="tokenId"
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      ></input>
      <button onClick={getToken}>조회하기</button>
    </div>
  );
};

export default TestPage;
