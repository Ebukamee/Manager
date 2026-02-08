import { auth } from "~/../server/utilis/auth";

export default defineEventHandler((event) => {
    return auth.handler(toWebRequest(event));
});