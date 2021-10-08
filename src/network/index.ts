import Send from "./$send";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://ustbhuangyi.com/music-next/"
    : "/";
const ERR_OK = 0;
const $send = new Send(BASE_URL, ERR_OK);
export default $send;
