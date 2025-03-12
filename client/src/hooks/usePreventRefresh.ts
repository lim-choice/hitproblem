import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 새로고침 및 페이지 이탈 방지 훅
 * @param shouldWarn 사용자가 편집 중인지 여부 (true면 새로고침 감지)
 * @param onRefresh 새로고침 후 실행할 이벤트 핸들러 (예: 데이터 저장)
 */
const usePreventRefresh = (shouldWarn: boolean, onRefresh?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldWarn) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      //😀 세션스토리지로 감지를 하는 이유는 크롬과 같은 경우, F5에 대한 이벤트를 차단해버리기 때문에 세션스토리지를 활용해서 처리해야 함!!
      sessionStorage.setItem("preventRefresh", "true"); // 새로고침 감지
      event.preventDefault();
      //event.returnValue = ""; // 기본 경고창 (크롬에서는 브라우저 기본 동작으로 실행)
      alert("ㅇㅋㅇㅋ");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        // const confirmRefresh = window.confirm(
        //   "정말 새로고침 하시겠습니까? 새로고침을 할 경우 정보가 저장되지 않고, 메인 페이지로 이동됩니다."
        // );
        // if (confirmRefresh)
        {
          sessionStorage.setItem("preventRefresh", "true"); // 새로고침 감지 플래그
          window.location.reload(); // 브라우저 새로고침 강제 실행
          alert("ㅇㅋㅇㅋ2");
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldWarn]);

  useEffect(() => {
    if (sessionStorage.getItem("preventRefresh") === "true") {
      alert("ㅇㅋㅇㅋ3");
      sessionStorage.removeItem("preventRefresh"); // 플래그 제거

      if (onRefresh) {
        onRefresh(); // 🚀 이벤트 실행 (사용자가 정의한 콜백 실행)
      } else {
        navigate("/"); // 기본 동작: 메인 페이지 이동
      }
    }
  }, [navigate, onRefresh]);
};

export default usePreventRefresh;
