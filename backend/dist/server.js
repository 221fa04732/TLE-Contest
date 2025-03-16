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
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("./auth"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/contest', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codechefContest = yield axios_1.default.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all');
    const codeforcesContest = yield axios_1.default.get("https://codeforces.com/api/contest.list");
    let previousContest = [];
    let upcomminingContest = [];
    codechefContest.data.future_contests.map((contest) => {
        upcomminingContest.push({
            contest_type: "codechef",
            contest_id: contest.contest_code,
            contest_name: contest.contest_name,
            contest_duration: contest.contest_duration,
            contest_time: new Date(contest.contest_start_date_iso).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        });
    });
    codechefContest.data.past_contests.map((contest) => {
        previousContest.push({
            contest_type: "codechef",
            contest_id: contest.contest_code,
            contest_name: contest.contest_name,
            contest_time: new Date(contest.contest_start_date_iso).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        });
    });
    codeforcesContest.data.result.map((contest) => {
        if (contest.phase === "BEFORE") {
            upcomminingContest.push({
                contest_type: "codeforces",
                contest_id: contest.id,
                contest_name: contest.name,
                contest_duration: contest.durationSeconds,
                contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            });
        }
        else if (contest.phase === "FINISHED") {
            previousContest.push({
                contest_type: "codeforces",
                contest_id: contest.id,
                contest_name: contest.name,
                contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            });
        }
    });
    res.status(200).json({
        upcomminingContest: upcomminingContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()),
        previousContest: previousContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()).reverse()
    });
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const prisma = new client_1.PrismaClient();
        const user = yield prisma.user.findFirst({
            where: {
                name: email
            }
        });
        if (user) {
            return res.status(301).json({
                message: "user already exist"
            });
        }
        const newUser = yield prisma.user.create({
            data: {
                name: email,
                password: password,
                userType: "student"
            }
        });
        const token = (0, jsonwebtoken_1.sign)({ email }, "secret");
        res.status(200).json({
            message: "signin sucessful",
            token
        });
    }
    catch (e) {
        res.status(404).json({
            message: "server error"
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userType } = req.body;
    try {
        const prisma = new client_1.PrismaClient();
        const user = yield prisma.user.findFirst({
            where: {
                name: email,
                password: password,
                userType: userType
            }
        });
        if (!user) {
            return res.status(301).json({
                message: "user doesn't exist"
            });
        }
        const token = (0, jsonwebtoken_1.sign)({ email }, "secret");
        res.status(200).json({
            message: "signin sucessful",
            userType: user.userType,
            token
        });
    }
    catch (e) {
        req.status(404).json({
            message: "server error"
        });
    }
}));
app.listen(3000, () => {
    console.log('server is listining');
});
