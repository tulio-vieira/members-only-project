let bcrypt = require("bcryptjs");

const PASSWORD = "abc123";

async function test() {
  try {
    console.log(PASSWORD);
    let hashedPassword = await bcrypt.hash(PASSWORD, 10);
    console.log(hashedPassword);
    let response = await bcrypt.compare(PASSWORD, hashedPassword);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

test();