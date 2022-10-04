export const getIntersectionObserver = (setMainNav: any) => {
  const observer = new IntersectionObserver(
    (entries) => {
      // callback
      entries.map((entrie) => {
        if (entrie.isIntersecting) {
          setMainNav(entrie.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );
  return observer;
};
