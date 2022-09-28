// 기본 url
const HOST = process.env.REACT_APP_API_BASE_URL + "/api/";

// 세부 url
const LIKE = "like";
const ROOM = "room";
const SOLVER = "solver";

interface apiInterface {
  like: {
    likeNFT: () => string;
    likeNFTList: (walletAddress: string) => string;
  };
  room: {
    getAllRoomList: () => string;
    makeRoom: () => string;
    getRoom: (id: any) => string;
    deleteRoom: (id: any) => string;
  };
  solver: {
    solveProblem: () => string;
    getSolveList: (walletAddress: string) => string;
  };
}

const api: apiInterface = {
  like: {
    likeNFT: () => HOST + LIKE,
    likeNFTList: (walletAddress) => HOST + LIKE + "/" + walletAddress,
  },
  room: {
    getAllRoomList: () => HOST + ROOM,
    makeRoom: () => HOST + ROOM,
    getRoom: (id) => HOST + ROOM + "/" + id,
    deleteRoom: (id) => HOST + ROOM + "/" + id,
  },
  solver: {
    solveProblem: () => HOST + SOLVER,
    getSolveList: (walletAddress) => HOST + SOLVER + "/" + walletAddress,
  },
};

export default api;
