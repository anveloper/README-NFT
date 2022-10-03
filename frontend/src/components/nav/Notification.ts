const useNotification = (title: any, options: any) => {
  if (!("Notification" in window)) {
    return;
  }

  const fireNotif = () => {
    // 권한 요청 부분
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // 권한 요청받고 noti를 생성해주는 부분
          new Notification(title, options);
        } else {
          return;
        }
      });
    } else {
      // 권한이 있을 때 바로 noti 생성해주는 부분
      new Notification(title, options);
    }
  };
  return fireNotif;
};

export default useNotification;
