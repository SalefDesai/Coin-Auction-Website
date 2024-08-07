export const host = `${process.env.REACT_APP_HOST_URI}`;


export const signInRoute = `${host}/userauth/signin`;
export const signUpRoute = `${host}/userauth/signup`;
export const getUserProfile = `${host}/userauth/getProfile`;
export const logout = `${host}/userauth/logout`;
export const checkIsAuthenticated = `${host}/userauth/checkisauth`;
export const getUsersCoin = `${host}/userauth/getuserscoin`;
export const auctionParticipation = `${host}/userauth/participateinauction`;
export const getRemainingPayment = `${host}/userauth/remainingpayment`;
export const updateUserProfile = `${host}/userauth/updateuserprofile`;
export const addNewCoin = `${host}/coin/addnewcoin`;
export const getUpCommingAuctions = `${host}/coin/getupcommingauction`;
export const checkout = `${host}/api/payment/checkout`
export const paymentVerification = `${host}/api/payment/paymentverification`
export const getkey = `${host}/api/payment/getkey`


export const URLForPuttingObjInS3 = `${host}/userauth/urlforputtingobjinS3`
export const URLForGettingObjFromS3= `${host}/userauth/urlforgettingobjfroms3`




// socket.io nameSpace
export const hostForAuction = `${host}/auction`;