export type CalendarDate = {
    /**
     * 同 `Date.prototype.getFullYear`
     */
    year: ReturnType<Date['getFullYear']>;
    /**
     * 同 `Date.prototype.getMonth`
     *
     * 为基于 0 的值（0 表示一年中的第一月）
     */
    month: ReturnType<Date['getMonth']>;
    /**
     * 同 `Date.prototype.getDate`
     *
     * 一个月中的哪一日（从 1--31）
     */
    date: ReturnType<Date['getDate']>;
};

/** Unix 时间戳 */
export type UnixTime = ReturnType<Date['getTime']>;
