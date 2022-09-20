import Web3 from "web3";

/**
 * 개인키로부터 주소를 추출합니다.
 * @param {*} privKey 개인키
 * @returns 주소
 */
export default function getAddressFrom(privKey) {
  if (privKey.length === 66 && privKey.startsWith("0x")) {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_ETHEREUM_RPC_URL)
    );
    const pubKey = web3.eth.accounts.privateKeyToAccount(privKey);
    return pubKey.address;
  } else alert("유효한 개인키를 입력해주세요.");
}
