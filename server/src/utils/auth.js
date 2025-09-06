import jwt from "jsonwebtoken";


// export const cookieOptions = {
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: process.env.COOKIE_SECURE === 'true',
//     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// };


export function sign(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );
}