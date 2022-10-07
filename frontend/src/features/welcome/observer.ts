export const getIntersectionObserver = (setWelcomNav: any) => {
  const observer = new IntersectionObserver(
    (entries) => {
      // callback
      entries.map((entrie) => {
        if (entrie.isIntersecting) {
          setWelcomNav(entrie.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );
  return observer;
};
