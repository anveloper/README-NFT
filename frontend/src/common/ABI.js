import { MintReadmeToken } from "./MintReadmeToken";
import { SaleReadmeToken } from "./SaleReadmeToken";
import { SSF } from "../abi/SSFABI";
import { GetReadmeToken } from "./GetReadmeToken";

/* 
[컨트랙트 ABI]
- 작성한 스마트 컨트랙트의 컴파일 결과로부터 얻은 ABI(in JSON)를 복사하여 붙여넣습니다.
- NFT_ABI: SSAFY NFT 컨트랙트 ABI
- SALE_FACTORY_ABI: SALE Factory 컨트랙트 ABI
- SALE_ABI: SALE 컨트랙트 ABI
*/
const ABI = {
  CONTRACT_ABI: {
    MINTREADMETOKEN_ABI: MintReadmeToken,
    SALEREADMETOKEN_ABI: SaleReadmeToken,
    GETREADMETOKEN_ABI: GetReadmeToken,
    ERC_ABI: SSF,
  },
};

export default ABI;
