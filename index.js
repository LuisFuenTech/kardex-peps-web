if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { database } = require("./config/index");

const moment = require("moment");

const hour = moment()
  .subtract("5", "hours")
  .format("HH:mm:ss");
const date = moment()
  .add("5", "hours")
  .format("MMM DD YYYY");

console.log(`Time: ${hour}`);
console.log(`Date: ${date}`);

console.log(`Full date: ${date} ${hour}`);
console.log(
  moment()
    .subtract("5", "hours")
    .toJSON()
);

/* (async function() {
  console.log("a");

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("b");
      resolve();
    }, 2000);
  });
  console.log("c");
})(); */
