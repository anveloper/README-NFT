import spinner from "assets/loading/loading_spinner.gif";

const LoadingSpinner = () => {
  return (
    <div>
      <img style={{ width: "30px", height: "30px" }} src={spinner} alt="" />
    </div>
  );
};

export default LoadingSpinner;
