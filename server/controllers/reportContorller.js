const db = require("../models/reportModel"); // DB 연결
const userDB = require("../models/userModel"); // DB 연결
const { verifyToken } = require("../config/jwtConfig");

const sendBugAPI = async (req, res) => {
  console.log("sendBugAPI");
  console.log(req.body);

  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)
    
    // ✅ DB에서 유저 정보 조회
    const user = await userDB.getUserById(decoded.id); 
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const { content } = req.body;
    const user_id = user.id;

    const result = await db.sendBug(user_id,content);
    
    if (!result)
        return res.status(401).json({ message: "버그 전송에 실패하였습니다." });
    
      res.json({
        status: "success",
        message: "전송 성공!",
      });
    }
  catch(error) {

  }
}

module.exports = { sendBugAPI };