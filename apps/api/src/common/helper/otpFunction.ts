
export const generateOTP = () : number => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const OTP_EXPIRE = 5*60;