const db = require("../models/reportModel"); // DB 연결


const sendBugAPI = async (req, res) => {
    console.log("sendBugAPI");
    console.log(req.body);

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

module.exports = { sendBugAPI };