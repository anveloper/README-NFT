import { useState, useRef, useEffect } from "react";
import {
  web3,
  MintReadmeContract,
  SaleReadmeContract,
  GetReadmeContract,
  BidReadmeContract,
  SSFContract,
  DrawTokenContract,
  mintReadmeToken,
} from "../web3Config";

import IpfsAPI from "ipfs-api";
import { Buffer } from "buffer";
import { selectUserAddress } from "../features/auth/authSlice";
import { useAppSelector } from "../app/hooks";
/**
 * [등록하기]를 위한 UI와 기능
 */
const TestPage = () => {
  const account = useAppSelector(selectUserAddress);
  // [변수] 아이템 (파일, 이름, input 클릭 참조), 작가명, 제목, 아이템 소개, 토큰 ID
  const [item, setItem] = useState("");
  const [itemName, setItemName] = useState("");
  const itemSelect = useRef();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [to, setTo] = useState("");
  const [what, setWhat] = useState("");
  const [sale, setSale] = useState("");
  const [price, setPrice] = useState("");
  const [during, setDuring] = useState("");
  const [toBuy, setToBuy] = useState("");
  const [toBuyPrice, setToBuyPrice] = useState(null);
  const [eventLeft, setEventLeft] = useState(0);

  const isTokenImported = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: process.env.REACT_APP_ERC20_CA, // The address that the token is at.
            symbol: "SSF", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 0,
          },
        },
      });
      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addNet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x79F5" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x79F5",
                chainName: "SSAFY Network",
                rpcUrls: ["http://20.196.209.2:8545"] /* ... */,
              },
            ],
          });
        } catch (addError) {
          console.log("could't add network");
        }
      }
      console.log("could't switch network");
    }
  };

  useEffect(() => {
    DrawTokenContract.methods.getWinnerCount().call((err, res) => {
      setEventLeft(res);
      console.log(res);
    });
  }, []);
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
    // let address = getAddressFrom(privKey);
    if (account) {
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
            // sendTransaction(
            //   address,
            //   privKey,
            //   process.env.REACT_APP_MINTREADMETOKEN_CA,
            //   MintReadmeContract.methods.create(tokenURI).encodeABI()
            // );
            console.log(account);
            MintReadmeContract.methods
              .create(
                tokenURI,
                process.env.REACT_APP_SALEREADMETOKEN_CA,
                process.env.REACT_APP_BIDREADMETOKEN,
                "0xF5C110E4Cf6e82f737FFaDC7a6bC2b8bf1EcD4d5",
                "0xF5C110E4Cf6e82f737FFaDC7a6bC2b8bf1EcD4d5"
              )
              .send({ from: account })
              .then((receipt) => {
                console.log(receipt);
              });
          });
        });
      };
    }
  };
  const ssfGetBalance = () => {
    SSFContract.methods.balanceOf(account).call((err, res) => {
      console.log(res);
    });
  };
  const nftGetBalance = () => {
    MintReadmeContract.methods.getOwnedTokens(account).call((err, res) => {
      console.log(res);
    });
    MintReadmeContract.methods.getMyReadmeTokenArrayLength(account).call((err, res) => {
      console.log(res);
    });
    GetReadmeContract.methods.getMyReadmeToken(account).call((err, res) => {
      console.log(res);
    });
  };
  const getToken = () => {
    MintReadmeContract.methods.tokenURI(tokenId).call((err, res) => {
      console.log(res);
    });
  };
  const drawToken = () => {
    MintReadmeContract.methods.getDrawTokens(account).call((err, res) => {
      console.log(res);
    });
    MintReadmeContract.methods.getDrawReadmeTokenArrayLength(account).call((err, res) => {
      console.log(res);
    });
    GetReadmeContract.methods.getDrawReadmeToken(account).call((err, res) => {
      console.log(res);
    });
  };
  const transferNFT = () => {
    // sendTransaction(
    //   getAddressFrom(privKey),
    //   privKey,
    //   process.env.REACT_APP_MINTREADMETOKEN_CA,
    //   MintReadmeContract.methods
    //     .removeTokenFromList(to, account, what)
    //     .encodeABI()
    // );
  };
  const saleNft = () => {
    console.log(account);
    SaleReadmeContract.methods
      .setForSaleReadmeToken(sale, price, during)
      .send({ from: account })
      .then((receipt) => {
        console.log(receipt);
      });
  };
  const getOnSale = () => {
    SaleReadmeContract.methods.getOnSaleReadmeToken().call((err, res) => {
      console.log(res);
    });
  };
  const buyNFT = async () => {
    // SaleReadmeContract.methods
    //   .purchaseReadmeToken(toBuy)
    //   .send({ from: account, value: toBuyPrice })
    //   .then((receipt) => {
    //     console.log(receipt);
    //   });
    let owner = await MintReadmeContract.methods.ownerOf(toBuy).call();
    console.log(owner);
    // let SSFBalance = await SSFContract.methods.balanceOf(account).call();
    // if (SSFBalance > toBuyPrice) {
    //   await SSFContract.methods
    //     .transfer(owner, toBuyPrice)
    //     .send({ from: account }, (err, res) => {
    //       console.log(res);
    //     });
    //   await SaleReadmeContract.methods
    //     .purchaseReadmeToken(account, toBuy)
    //     .send({ from: account });
    // }
    await SSFContract.methods.approve(process.env.REACT_APP_SALEREADMETOKEN_CA, toBuyPrice).send({ from: account });
    SaleReadmeContract.methods
      .purchaseReadmeToken(process.env.REACT_APP_ERC20_CA, toBuy)
      .send({ from: account })
      .then((receipt) => {
        console.log(receipt);
      });
  };
  const getEventMoney = async () => {
    await DrawTokenContract.methods.shareToken().send({ from: account }, (receipt, error) => {
      console.log(receipt);
      console.log(error);
    });
    DrawTokenContract.methods.getWinnerCount().call((err, res) => {
      setEventLeft(res);
    });
  };

  /* 판매 취소 */
  const refundToken = async () => {
    try {
      console.log("여기 refundsReadmeToken");
      await SaleReadmeContract.methods
        .refundsReadmeToken(tokenId)
        .send({ from: account })
        .then((res) => {
          console.log("종료 이후에 판매 취소: ", res);
        })
        .catch((err) => {
          console.log(err);
          alert("refundsReadmeToken 에러.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelToken = async () => {
    try {
      console.log("여기 cancelReadmeToken");
      await SaleReadmeContract.methods
        .cancelReadmeToken(tokenId)
        .send({ from: account })
        .then((res) => {
          console.log("종료 기간 내에 판매 취소: ", res);
        })
        .catch((err) => {
          console.log(err);
          alert("cancelReadmeToken 에러.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ paddingTop: "30px" }}>
      <h2>프라이빗 키 입력</h2>
      <input type="text" onChange={handlePrivKey}></input>
      <h2>NFT 민팅하기</h2>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        ref={itemSelect}
        onChange={(e) => (e.target.files.length !== 0 ? handleItem(e.target.files[0]) : handleItem(""))}
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
      <h2>내가 그린 nft 조회</h2>
      <button onClick={drawToken}>조회하기</button>
      <h2>전체 발행한 nft 조회</h2>
      <button
        onClick={() =>
          MintReadmeContract.methods.getTotalReadmeToken().call((err, res) => {
            console.log(res);
          })
        }
      >
        조회하기
      </button>
      <h2>NFT 소유권 변경하기</h2>
      <label htmlFor="to">얘한테</label>
      <input
        type="text"
        id="to"
        onChange={(e) => {
          setTo(e.target.value);
        }}
      ></input>
      <br></br>
      <label htmlFor="what">이거를</label>
      <input
        type="number"
        id="what"
        onChange={(e) => {
          setWhat(e.target.value);
        }}
      ></input>
      <button onClick={transferNFT}>전송하기</button>
      <h2>판매하기</h2>
      <label htmlFor="forSale">이거를</label>
      <input
        type="text"
        id="forSale"
        onChange={(e) => {
          setSale(e.target.value);
        }}
      />
      <label htmlFor="price">얼마에</label>
      <input
        type="text"
        id="price"
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <br />
      <label htmlFor="during">얼마동안</label>
      <input
        type="text"
        id="during"
        onChange={(e) => {
          setDuring(e.target.value);
        }}
      />
      <button
        onClick={() => {
          MintReadmeContract.methods.setApprovalForAll(process.env.REACT_APP_SALEREADMETOKEN_CA, true).send({ from: account });
        }}
      >
        판매 권한 주기
      </button>
      <button onClick={saleNft}>판매하기</button>
      <h2>판매중인 토큰 목록</h2>
      <button onClick={getOnSale}>조회하기</button>
      <h2>판매기간 내에 있는 토큰 판매 취소하기</h2>
      <label htmlFor="tokenId">토큰 Id</label>
      <input
        type="text"
        id="tokenId"
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      ></input>
      <button onClick={cancelToken}>취소하기</button>
      <h2>판매기간 지난 토큰 판매 취소하기</h2>
      <label htmlFor="tokenId">토큰 Id</label>
      <input
        type="text"
        id="tokenId"
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      ></input>
      <button onClick={refundToken}>취소하기</button>
      <h2>구매하기</h2>
      <label htmlFor="toBuy">이거 살래</label>
      <input
        type="text"
        id="toBuy"
        onChange={(e) => {
          setToBuy(e.target.value);
        }}
      />
      <button
        onClick={() => {
          SaleReadmeContract.methods.getReadmeTokenPrice(toBuy).call((err, res) => {
            setToBuyPrice(res);
          });
        }}
      >
        구매하기
      </button>
      {toBuyPrice && (
        <div>
          {toBuyPrice}SSF임 진짜 살거임? <button onClick={buyNFT}>진짜 사기</button>
        </div>
      )}
      <h2>{eventLeft}/50</h2>
      <button onClick={getEventMoney}>이벤트 참여하기</button>
      <h2>싸트워크 추가하기</h2>
      <button onClick={addNet}>싸트워크 추가하기</button>
      <h2>ssf token import 하기</h2>
      <button onClick={isTokenImported}>ssftoken import하기</button>
      <button
        onClick={() => {
          MintReadmeContract.methods
            .batchNFT(process.env.REACT_APP_DRAWTOKEN, process.env.REACT_APP_SALEREADMETOKEN_CA)
            .send({ from: account })
            .then((receipt) => {
              console.log(receipt);
            });
        }}
      >
        배치민팅 받기 김우원만 누르셈
      </button>
    </div>
  );
};

export default TestPage;
