import express from 'express'
import  { JwtPayload, verify } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';


const app = express()
const prisma = new PrismaClient();
app.use(express.json())

const authMiddleware = async (req : any, res : any, next : any) => {

    try {
        const token = req.headers.authorization;
        if(!token){
            res.status(401).json({ 
                message: "Access denied" 
            });
            return;
        }
        else{
            const decoded = verify(token, "secret") as JwtPayload;
            const user = await prisma.user.findFirst({
                where : {
                    name : decoded.email
                }
            })
            if(user){
                next();
                return;
            }
            else{
                res.status(202).json({ 
                    message: "Invalid token" 
                });
                return;
            }
        }
    } 
    catch(e){
        res.status(404).json({ 
            message: "Internal server error" 
        });
        return;
    }
};

export default authMiddleware;