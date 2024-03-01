module.exports = function percentageValue(value, percent) {
  if (typeof value == "string") {
    value = parseInt(value.split(".")[0]);
  }
  if (typeof percent == "string") {
    percent = parseInt(percent.split(".")[0]);
  }

  // Fix nomor
  value = value.toFixed(0);
  percent = percent.toFixed(0);

  const result = (percent * value) / 100;
  return result.toFixed(0);
};
