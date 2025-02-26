const convertToM2 = (length, width, unit) => {
  if (unit === "cm") {
    return (length / 100) * (width / 100);
  } else if (unit === "cm2") {
    return length / 10000;
  } else if (unit === "m") {
    return length * width;
  } else if (unit === "m2") {
    return length;
  }
  return null;
};

module.exports = { convertToM2 };
