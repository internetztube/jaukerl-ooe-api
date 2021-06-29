const dayjs = require('dayjs')

// https://gist.github.com/miguelmota/7905510
const getDates = function (startDate, endDate) {
    let dates = [],
        currentDate = startDate,
        addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

const urls = () => {
    const result = getDates(new Date(2021, 6 - 1, 15), new Date())
        .map((date) => {
            const folder = dayjs(date).format('YYYY/MM/DD');
            date = dayjs(date).format('YYYY-MM-DD');
            const url = `https://raw.githubusercontent.com/internetztube/jaukerl-ooe-archive/master/statistics-export/expired-appointments/${folder}.json`;
            return {folder, date, url}
        })
    result.pop()
    return result;
}

module.exports = urls