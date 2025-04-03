import crypto from "crypto";

function generateToken(appID, appSecret, userID, expireTime = 3600) {
  const payload = {
    app_id: appID,
    user_id: userID,
    expire_at: Math.floor(Date.now() / 1000) + expireTime,
  };

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  function base64Encode(obj) {
    return Buffer.from(JSON.stringify(obj)).toString("base64url");
  }

  const encodedHeader = base64Encode(header);
  const encodedPayload = base64Encode(payload);
  const signature = crypto
    .createHmac("sha256", appSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const Chatting = {
  appID: 701112513, // Your Zego App ID
  appSecret: "c6d4baf572c61100fe6d5bd921672aaa", // Your Zego App Secret
  userID: "user123", // The unique user ID
  generateToken() {
    return generateToken(this.appID, this.appSecret, this.userID);
  },
};

export default Chatting;
