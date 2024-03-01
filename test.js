require("dotenv").config();
const percentageValue = require("./src/util/percentageValue");

const tests = [
  {
    value: 5000,
    percent: 10,
    result: 500,
  },
  {
    value: "5000",
    percent: "10",
    result: 500,
  },
];

for (var test of tests) {
  const res = percentageValue(test.value, test.percent);
  const correct = res == test.result;
  console.log(correct ? "Test passed" : "Test failed");
  if (!correct) {
    break;
  }
}
