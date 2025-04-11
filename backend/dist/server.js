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
const leetcode_1 = require("./leetcode");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.get('/contest', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.userInfo;
    const dataType = req.query.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    try {
        const codechefContest = yield axios_1.default.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all');
        const codeforcesContest = yield axios_1.default.get("https://codeforces.com/api/contest.list");
        const bookmark = yield prisma.bookmark.findMany({
            where: {
                userId: userId
            }
        });
        const videoURL = yield prisma.video.findMany({});
        const leetcode = yield (0, leetcode_1.leetcodeContest)();
        let upcomminingContest = [];
        let previousContest = [];
        let bookmarkedupcomminingContest = [];
        let bookmarkedpreviousContest = [];
        const userLocale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN";
        if (dataType === "future") {
            codechefContest.data.future_contests.map((contest) => {
                upcomminingContest.push({
                    contest_type: "codechef",
                    contest_id: contest.contest_code,
                    contest_name: contest.contest_name,
                    contest_duration: contest.contest_duration,
                    contest_time: new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }),
                    bookmarked: bookmark.some(item => item.contestId === contest.contest_code)
                });
            });
            codeforcesContest.data.result.map((contest) => {
                if (contest.phase === "BEFORE") {
                    upcomminingContest.push({
                        contest_type: "codeforces",
                        contest_id: contest.id.toString(),
                        contest_name: contest.name,
                        contest_duration: contest.durationSeconds.toString(),
                        contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        bookmarked: bookmark.some(item => item.contestId === contest.id.toString())
                    });
                }
            });
            upcomminingContest.push({
                contest_type: leetcode.weeklyContest.upcomming.contest_type,
                contest_id: leetcode.weeklyContest.upcomming.contest_id,
                contest_name: leetcode.weeklyContest.upcomming.contest_name,
                contest_duration: leetcode.weeklyContest.upcomming.contest_duration,
                contest_time: leetcode.weeklyContest.upcomming.contest_time,
                bookmarked: bookmark.some(item => item.contestId === leetcode.weeklyContest.upcomming.contest_id)
            });
            upcomminingContest.push({
                contest_type: leetcode.biweeklyContest.upcomming.contest_type,
                contest_id: leetcode.biweeklyContest.upcomming.contest_id,
                contest_name: leetcode.biweeklyContest.upcomming.contest_name,
                contest_duration: leetcode.biweeklyContest.upcomming.contest_duration,
                contest_time: leetcode.biweeklyContest.upcomming.contest_time,
                bookmarked: bookmark.some(item => item.contestId === leetcode.biweeklyContest.upcomming.contest_id)
            });
            if (search !== "") {
                upcomminingContest = upcomminingContest.filter((contest) => String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_name.toLowerCase().includes(search.toLowerCase()));
            }
            return res.status(200).json({
                upcomminingContest: upcomminingContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()).slice(skip, skip + limit),
                hasMore: skip + limit < upcomminingContest.length
            });
        }
        else if (dataType === "past") {
            codechefContest.data.past_contests.map((contest) => {
                previousContest.push({
                    contest_type: "codechef",
                    contest_id: contest.contest_code,
                    contest_name: contest.contest_name,
                    contest_time: new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }),
                    bookmarked: bookmark.some(item => item.contestId === contest.contest_code),
                    video: (videoURL.find(item => item.contestId === contest.contest_name.toLowerCase().split(" ").slice(0, 2).join(" ")) || {}).videoURL || ""
                });
            });
            codeforcesContest.data.result.map((contest) => {
                if (contest.phase === "FINISHED") {
                    previousContest.push({
                        contest_type: "codeforces",
                        contest_id: contest.id.toString(),
                        contest_name: contest.name,
                        contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        bookmarked: bookmark.some(item => item.contestId === contest.id.toString()),
                        video: (videoURL.find(item => item.contestId === contest.name.toString().toLowerCase()) || {}).videoURL || ""
                    });
                }
            });
            leetcode.weeklyContest.past.map((contest) => {
                previousContest.push({
                    contest_type: contest.contest_type,
                    contest_id: contest.contest_id,
                    contest_name: contest.contest_name,
                    contest_time: contest.contest_time,
                    bookmarked: bookmark.some(item => item.contestId === contest.contest_id),
                    video: (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || ""
                });
            });
            leetcode.biweeklyContest.past.map((contest) => {
                previousContest.push({
                    contest_type: contest.contest_type,
                    contest_id: contest.contest_id,
                    contest_name: contest.contest_name,
                    contest_time: contest.contest_time,
                    bookmarked: bookmark.some(item => item.contestId === contest.contest_id),
                    video: (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || ""
                });
            });
            if (search !== "") {
                previousContest = previousContest.filter((contest) => String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_name.toLowerCase().includes(search.toLowerCase()));
            }
            return res.status(200).json({
                previousContest: previousContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()).reverse().slice(skip, skip + limit),
                hasMore: skip + limit < previousContest.length
            });
        }
        else if (dataType === "bookmarked") {
            codechefContest.data.future_contests.forEach((contest) => {
                if (bookmark.some(item => item.contestId === contest.contest_code)) {
                    bookmarkedupcomminingContest.push({
                        contest_type: "codechef",
                        contest_id: contest.contest_code,
                        contest_name: contest.contest_name,
                        contest_duration: contest.contest_duration,
                        contest_time: new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status: "future",
                        bookmarked: true
                    });
                }
            });
            codeforcesContest.data.result.forEach((contest) => {
                if (contest.phase === "BEFORE" && bookmark.some(item => item.contestId === contest.id.toString())) {
                    bookmarkedupcomminingContest.push({
                        contest_type: "codeforces",
                        contest_id: contest.id.toString(),
                        contest_name: contest.name,
                        contest_duration: contest.durationSeconds.toString(),
                        contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status: "future",
                        bookmarked: true
                    });
                }
            });
            codechefContest.data.past_contests.forEach((contest) => {
                if (bookmark.some(item => item.contestId === contest.contest_code)) {
                    bookmarkedpreviousContest.push({
                        contest_type: "codechef",
                        contest_id: contest.contest_code,
                        contest_name: contest.contest_name,
                        contest_time: new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status: "past",
                        bookmarked: true,
                        video: (videoURL.find(item => item.contestId === contest.contest_name.toLowerCase().split(" ").slice(0, 2).join(" ")) || {}).videoURL || ""
                    });
                }
            });
            codeforcesContest.data.result.forEach((contest) => {
                if (contest.phase === "FINISHED" && bookmark.some(item => item.contestId === contest.id.toString())) {
                    bookmarkedpreviousContest.push({
                        contest_type: "codeforces",
                        contest_id: contest.id.toString(),
                        contest_name: contest.name,
                        contest_time: new Date(contest.startTimeSeconds * 1000).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status: "past",
                        bookmarked: true,
                        video: (videoURL.find(item => item.contestId === contest.name.toString().toLowerCase()) || {}).videoURL || ""
                    });
                }
            });
            leetcode.weeklyContest.past.forEach((contest) => {
                if (bookmark.some(item => item.contestId === contest.contest_id)) {
                    bookmarkedpreviousContest.push({
                        contest_type: contest.contest_type,
                        contest_id: contest.contest_id,
                        contest_name: contest.contest_name,
                        contest_time: contest.contest_time,
                        contest_status: "past",
                        video: (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || "",
                        bookmarked: true
                    });
                }
            });
            leetcode.biweeklyContest.past.forEach((contest) => {
                if (bookmark.some(item => item.contestId === contest.contest_id)) {
                    bookmarkedpreviousContest.push({
                        contest_type: contest.contest_type,
                        contest_id: contest.contest_id,
                        contest_name: contest.contest_name,
                        contest_time: contest.contest_time,
                        contest_status: "past",
                        video: (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || "",
                        bookmarked: true
                    });
                }
            });
            if (bookmark.some(item => item.contestId === leetcode.weeklyContest.upcomming.contest_id)) {
                bookmarkedupcomminingContest.push({
                    contest_type: leetcode.weeklyContest.upcomming.contest_type,
                    contest_id: leetcode.weeklyContest.upcomming.contest_id,
                    contest_name: leetcode.weeklyContest.upcomming.contest_name,
                    contest_duration: leetcode.weeklyContest.upcomming.contest_duration,
                    contest_time: leetcode.weeklyContest.upcomming.contest_time,
                    contest_status: "future",
                    bookmarked: true
                });
            }
            if (bookmark.some(item => item.contestId === leetcode.biweeklyContest.upcomming.contest_id)) {
                bookmarkedupcomminingContest.push({
                    contest_type: leetcode.biweeklyContest.upcomming.contest_type,
                    contest_id: leetcode.biweeklyContest.upcomming.contest_id,
                    contest_name: leetcode.biweeklyContest.upcomming.contest_name,
                    contest_duration: leetcode.biweeklyContest.upcomming.contest_duration,
                    contest_time: leetcode.biweeklyContest.upcomming.contest_time,
                    contest_status: "future",
                    bookmarked: true
                });
            }
            bookmarkedupcomminingContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime());
            bookmarkedpreviousContest.sort((a, b) => new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()).reverse();
            const allBookmark = [...bookmarkedupcomminingContest, ...bookmarkedpreviousContest];
            return res.status(200).json({
                allBookmark: allBookmark.slice(skip, skip + limit),
                hasMore: skip + limit < allBookmark.length,
            });
        }
        return res.status(404).json({
            message: "Invalid request"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                name: email
            }
        });
        if (user) {
            return res.status(404).json({
                message: "User already exist"
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
        const leetcodeURL = yield prisma.leetcodeProfile.findFirst({
            where: {
                userId: newUser.id
            }
        });
        const codeforcesURL = yield prisma.codeforcesProfile.findFirst({
            where: {
                userId: newUser.id
            }
        });
        const codechefURL = yield prisma.codechefProfile.findFirst({
            where: {
                userId: newUser.id
            }
        });
        res.status(200).json({
            message: "Signup sucessful",
            userType: "student",
            leetcodeURL: leetcodeURL,
            codechefURL: codechefURL,
            codeforcesURL: codeforcesURL,
            token
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userType } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                name: email,
                password: password,
                userType: userType
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }
        const token = (0, jsonwebtoken_1.sign)({ email }, "secret");
        const leetcodeURL = yield prisma.leetcodeProfile.findFirst({
            where: {
                userId: user.id
            }
        });
        const codeforcesURL = yield prisma.codeforcesProfile.findFirst({
            where: {
                userId: user.id
            }
        });
        const codechefURL = yield prisma.codechefProfile.findFirst({
            where: {
                userId: user.id
            }
        });
        res.status(200).json({
            message: "Signin sucessful",
            userType: user.userType,
            leetcodeURL: leetcodeURL === null || leetcodeURL === void 0 ? void 0 : leetcodeURL.leetcode,
            codechefURL: codechefURL === null || codechefURL === void 0 ? void 0 : codechefURL.codechef,
            codeforcesURL: codeforcesURL === null || codeforcesURL === void 0 ? void 0 : codeforcesURL.codeforces,
            token
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/bookmark', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.userInfo;
    const { contestId } = req.body;
    try {
        const bookmark = yield prisma.bookmark.findFirst({
            where: {
                userId: userId,
                contestId: contestId
            }
        });
        if (bookmark) {
            yield prisma.bookmark.delete({
                where: {
                    id: bookmark.id
                }
            });
            res.status(200).json({
                Message: "Contest unmark"
            });
            return;
        }
        yield prisma.bookmark.create({
            data: {
                userId: userId,
                contestId: contestId
            }
        });
        res.status(200).json({
            Message: "Contest bookmark"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/video', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userType } = req.userInfo;
    const { contestId, videoURL } = req.body;
    if (userType !== "admin") {
        res.status(301).json({
            message: "Unauthorize access"
        });
        return;
    }
    try {
        yield prisma.video.create({
            data: {
                videoURL: videoURL,
                contestId: contestId
            }
        });
        res.status(200).json({
            Message: "Video added"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/codechef-profile', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.userInfo;
    const { codechefURL } = req.body;
    try {
        const codechef = yield prisma.codechefProfile.findFirst({
            where: {
                userId: userId
            }
        });
        if (codechef) {
            yield prisma.codechefProfile.delete({
                where: {
                    id: codechef.id
                }
            });
        }
        yield prisma.codechefProfile.create({
            data: {
                userId: userId,
                codechef: codechefURL
            }
        });
        res.status(200).json({
            Message: "Codechef URL added"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/leetcode-profile', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.userInfo;
    const { leetcodeURL } = req.body;
    try {
        const leetcode = yield prisma.leetcodeProfile.findFirst({
            where: {
                userId: userId
            }
        });
        if (leetcode) {
            yield prisma.leetcodeProfile.delete({
                where: {
                    id: leetcode.id
                }
            });
        }
        yield prisma.leetcodeProfile.create({
            data: {
                userId: userId,
                leetcode: leetcodeURL
            }
        });
        res.status(200).json({
            Message: "Leetcode URL added"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/codeforces-profile', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.userInfo;
    const { codeforcesURL } = req.body;
    try {
        const codeforces = yield prisma.codeforcesProfile.findFirst({
            where: {
                userId: userId
            }
        });
        if (codeforces) {
            yield prisma.codechefProfile.delete({
                where: {
                    id: codeforces.id
                }
            });
        }
        yield prisma.codeforcesProfile.create({
            data: {
                userId: userId,
                codeforces: codeforcesURL
            }
        });
        res.status(200).json({
            Message: "Codeforces URL added"
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/analytic-leetcode', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leetcodeID } = req.body;
    try {
        const leetcode = yield axios_1.default.get(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeID}`);
        const leetcodeData = {
            totalSolved: leetcode.data.totalSolved,
            easySolved: leetcode.data.easySolved,
            mediumSolved: leetcode.data.mediumSolved,
            hardSolved: leetcode.data.hardSolved,
            rank: leetcode.data.ranking,
            reputation: leetcode.data.reputation,
        };
        res.status(200).json({
            leetcodeData
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/analytic-codechef', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codechefID } = req.body;
    try {
        const codechef = yield axios_1.default.get(`https://codechef-api.vercel.app/handle/${codechefID}`);
        const codechefData = {
            userName: codechef.data.name,
            currentRating: codechef.data.currentRating,
            highestRating: codechef.data.highestRating,
            country: codechef.data.countryName,
            GlobalRank: codechef.data.globalRank,
            countryRank: codechef.data.countryRank,
            star: codechef.data.stars,
            totalContest: codechef.data.ratingData.length
        };
        res.status(200).json({
            codechefData
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.post('/analytic-codeforces', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeforcesID } = req.body;
    try {
        const codeforces = yield axios_1.default.get(`https://codeforces.com/api/user.info?handles=${codeforcesID}`);
        const codeforcesData = {
            contribution: codeforces.data.result[0].contribution,
            rating: codeforces.data.result[0].rating,
            friend: codeforces.data.result[0].friendOfCount,
            rank: codeforces.data.result[0].rank,
            userName: codeforces.data.result[0].handle,
            highestRating: codeforces.data.result[0].maxRating,
            highestRank: codeforces.data.result[0].maxRank
        };
        res.status(200).json({
            codeforcesData
        });
    }
    catch (e) {
        res.status(404).json({
            message: "Server error"
        });
    }
}));
app.listen(3000, () => {
    console.log('server is listining');
});
