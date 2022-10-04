import WelcomePageFive from "./components/WelcomePageFive";
import WelcomePageFour from "./components/WelcomePageFour";
import WelcomePageOne from "./components/WelcomePageOne";
import WelcomePageSix from "./components/WelcomePageSix";
import WelcomePageThree from "./components/WelcomePageThree";
import WelcomePageTwo from "./components/WelcomePageTwo";

const ScrollPage = () => {
  return (
    <>
      <WelcomePageOne />

      <div id="story">
        <WelcomePageTwo />
      </div>

      <div id="game">
        <WelcomePageThree />
      </div>

      <div id="roadmap">
        <WelcomePageFour />
      </div>

      <div id="team">
        <WelcomePageFive />
      </div>

      <WelcomePageSix />
    </>
  );
};

export default ScrollPage;
