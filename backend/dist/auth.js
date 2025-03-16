"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({
                message: "Access denied"
            });
            return;
        }
        else {
            const decoded = (0, jsonwebtoken_1.verify)(token, "secret");
            const user = yield prisma.user.findFirst({
                where: {
                    name: decoded.email
                }
            });
            if (user) {
                next();
                return;
            }
            else {
                res.status(202).json({
                    message: "Invalid token"
                });
                return;
            }
        }
    }
    catch (e) {
        res.status(404).json({
            message: "Internal server error"
        });
        return;
    }
});
exports.default = authMiddleware;
