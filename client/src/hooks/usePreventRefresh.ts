import { useEffect } from "react";

/**
 * 새로고침 및 페이지 이탈 방지
 * @param shouldWarn 사용자가 편집 중인지 여부 (true면 경고 창 표시)
 */
const usePreventRefresh = (shouldWarn: boolean) => {
  useEffect(() => {
    if (!shouldWarn) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      //event.returnValue = ""; // 일부 브라우저에서 필요한 설정
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
};

export default usePreventRefresh;
