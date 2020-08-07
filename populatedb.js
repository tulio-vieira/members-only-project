const comments = [
    "Don't need no credit card to ride this train\nIt's strong and it's sudden and it's cruel sometimes\nBut it might just save your life\nThat's the power of love\nThat's the power of love",
    "Take me home\nTo the place I belong\nWest Virginia, mountain mama\nTake me home, country roads",
    "Horse tack is attached\nHat is matte black\nGot the boots that's black to match",
    "But in the end, it doesn't even matter\nI had to fall to lose it all\nBut in the end it doesn't even matter",
    "ba-ba-do-ba-ba-ba-ba-bapadi\nBa-bo-be-bo, ba-ba-do-ba-ba-ba-bi-bapadi\nBa-bo-be-bo, bapadi-Ba-bo-be-bo\nBapadi-Ba-bo-be-bo, ba-ba-do-ba-ba-ba-ba-bapadi",
    "It's gonna take a lot to drag me away from you\nThere's nothing that a hundred men or more could ever do\nI bless the rains down in Africa"
];

const titles = ["Don't need money, don't take fame", "Country Roads", "I got the horses in the back", "I tried so hard and got so far", "Ba-bo-be-bo", "Hurry boi, it's waiting there for you"];
                              
const password = "123456";

const usernames = [
    'HueyLewis',
    'JohnDenver',
    'LilNasX',
    'LinkinPark',
    'ScatmanJohn',
    'Toto'
];

let User = require('./models/user');
let Message = require('./models/message');
require('dotenv').config();

console.log("Connecting to DB...")
let mongoose = require('mongoose');
mongoose.connect(process.env.DB_STRING, {useNewUrlParser : true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function createUser(username) {
    let newUser = new User({username, password});
    return newUser.save()
    .catch(err => {
        console.log(err);
        return Promise.reject(err);
    })
    .then(user => {
        console.log('New user: ' + user);
        return user;
    });
}

function createMessage(title, comment, userId) {
    let newMessage = new Message({
        user: userId,
        title: title,
        text: comment
    });

    return newMessage.save()
    .catch(err => {
        console.log(err);
        return Promise.reject(err);
    })
    .then(message => {
        console.log('New message: ' + message);
        return message;
    });
}

let userPromises = [];

for (let username of usernames) {
    userPromises.push(createUser(username));
}

Promise.allSettled(userPromises)
.then(results => {
    let messagePromises = [];
    for (let i = 0; i < results.length; i++){
        let newMessagePromise = createMessage(titles[i], comments[i], results[i].value._id);
        messagePromises.push(newMessagePromise);
    }
    Promise.allSettled(messagePromises).then(() => {
        mongoose.connection.close();
    });
})
.catch(err => {
    console.log(err);
});