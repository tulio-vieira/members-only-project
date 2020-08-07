const moment = require('moment');

function testMoment(past_date){
    if ((Date.now() - past_date) < 86400000) {
        return moment(past_date).fromNow();
    }
    console.log((Date.now() - past_date));
    return moment(past_date).calendar();
}

const past_date = 1596492888853;

console.log(testMoment(past_date));