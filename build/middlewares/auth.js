"use strict";
// /// <reference types="../types" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// import { getAuth } from '@clerk/express';
// export const auth = (req, res, next) => {
//   console.log('🧾 HEADER AUTHORIZATION:', req.headers.authorization);
//   //pedimos el token y decode
//   const { userId } = getAuth(req);
//    const authData = getAuth(req);
//    console.log('🧩 AUTH DATA:', authData); // <-- esto
//   //no hay token:
//   if (!userId) {
//     // return res.status(401).json({ message: 'Acceso denegado' });
//     res.status(401).json({ message: 'Not yet amigo' });
//     return; // Esto resuelve el conflicto de tipos con el maldito RequestHandler, todo el rato igual, le voy a meter un return por el **
//   }
//   req.user = {
//     id: userId
//   };
//   next(); //y dejamos que el server prosiga con su marcha
// };
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('🧾 HEADER AUTHORIZATION:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no presente' });
    }
    next();
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map