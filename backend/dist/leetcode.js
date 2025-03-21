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
Object.defineProperty(exports, "__esModule", { value: true });
exports.leetcodeContest = void 0;
const leetcodeContest = () => __awaiter(void 0, void 0, void 0, function* () {
    //                  leetcode-weekly contest
    //--------------------------------------------------------------------
    const userLocale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN";
    let leetcodeWeekly = [];
    const lwstartDate = new Date('2017-02-12T08:00:00');
    const currentDate = new Date();
    let weekly_contest_no = 19;
    let weekly_tempDate = new Date(lwstartDate);
    //from contest_01 to contest_18 (hardcoded)
    leetcodeWeekly = [{
            contest_id: "lw1",
            contest_name: "Warm Up Contest",
            contest_time: "21 Aug 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw2",
            contest_name: "Leetcode Weekly Contest 2",
            contest_time: "26 Aug 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw3",
            contest_name: "Leetcode Weekly Contest 3",
            contest_time: "4 Sep 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw4",
            contest_name: "Leetcode Weekly Contest 4",
            contest_time: "11 Sep 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw5",
            contest_name: "Leetcode Weekly Contest 5",
            contest_time: "18 Sep 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw6",
            contest_name: "Leetcode Weekly Contest 6",
            contest_time: "25 Sep 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw7",
            contest_name: "Leetcode Weekly Contest 7",
            contest_time: "2 Oct 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw8",
            contest_name: "Leetcode Weekly Contest 8",
            contest_time: "9 Oct 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw9",
            contest_name: "Leetcode Weekly Contest 9",
            contest_time: "16 Oct 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw10A",
            contest_name: "Leetcode Weekly Contest 10",
            contest_time: "20 Nov 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw10B",
            contest_name: "Smarking Algorithm Contest 4",
            contest_time: "13 Nov 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw10C",
            contest_name: "Smarking Algorithm Contest 3",
            contest_time: "6 Nov 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw10D",
            contest_name: "Smarking Algorithm Contest 2",
            contest_time: "30 Oct 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw10E",
            contest_name: "Smarking Algorithm Contest",
            contest_time: "23 Oct 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw11",
            contest_name: "Leetcode Weekly Contest 11",
            contest_time: "4 Dec 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw12",
            contest_name: "Leetcode Weekly Contest 12",
            contest_time: "11 Dec 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw13",
            contest_name: "Leetcode Weekly Contest 13",
            contest_time: "18 Dec 2016, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw14",
            contest_name: "Leetcode Weekly Contest 14",
            contest_time: "8 Jan 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw15",
            contest_name: "Leetcode Weekly Contest 15",
            contest_time: "15 Jan 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw16A",
            contest_name: "Leetcode Weekly Contest 16A",
            contest_time: "21 Jan 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw16B",
            contest_name: "Leetcode Weekly Contest 16B",
            contest_time: "22 Jan 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw17",
            contest_name: "Leetcode Weekly Contest 17",
            contest_time: "29 Jan 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw18A",
            contest_name: "Leetcode Weekly Contest 18A",
            contest_time: "4 Feb 2017, 08:00 am",
            contest_type: "leetcode"
        }, {
            contest_id: "lw18B",
            contest_name: "Leetcode Weekly Contest 18B",
            contest_time: "5 Feb 2017, 08:00 am",
            contest_type: "leetcode"
        }];
    //from contest_19 upto now.
    while (weekly_tempDate < currentDate) {
        leetcodeWeekly.push({
            contest_type: "leetcode",
            contest_id: `lw${weekly_contest_no}`,
            contest_name: `Leetcode Weekly Contest ${weekly_contest_no}`,
            contest_time: weekly_tempDate.toLocaleString(userLocale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        });
        weekly_contest_no++;
        weekly_tempDate.setDate(weekly_tempDate.getDate() + 7);
    }
    const weeklyUpcomming = {
        contest_type: "leetcode",
        contest_id: `lw${weekly_contest_no}`,
        contest_name: `Leetcode Weekly Contest ${weekly_contest_no}`,
        contest_time: weekly_tempDate.toLocaleString(userLocale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }),
        contest_duration: "90"
    };
    //                  leetcode-bi-weekly contest
    //--------------------------------------------------------------------
    const lbstartDate = new Date('2019-06-01T20:00:00');
    let leetcodebiweekly = [];
    let biweekly_tempDate = new Date(lbstartDate);
    let biweekly_contest_no = 1;
    while (biweekly_tempDate < currentDate) {
        leetcodebiweekly.push({
            contest_type: "leetcode",
            contest_id: `lb${biweekly_contest_no}`,
            contest_name: `Leetcode Biweekly Contest ${biweekly_contest_no}`,
            contest_time: biweekly_tempDate.toLocaleString(userLocale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        });
        biweekly_contest_no++;
        biweekly_tempDate.setDate(biweekly_tempDate.getDate() + 14);
    }
    const biweeklyUpcomming = {
        contest_type: "leetcode",
        contest_id: `lb${biweekly_contest_no}`,
        contest_name: `Leetcode Biweekly Contest ${biweekly_contest_no}`,
        contest_time: biweekly_tempDate.toLocaleString(userLocale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }),
        contest_duration: "90"
    };
    return {
        weeklyContest: {
            upcomming: weeklyUpcomming,
            past: leetcodeWeekly
        },
        biweeklyContest: {
            upcomming: biweeklyUpcomming,
            past: leetcodebiweekly
        }
    };
});
exports.leetcodeContest = leetcodeContest;
