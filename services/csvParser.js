const csv = require("csv-parser");
const streamifier = require("streamifier");

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    streamifier
      .createReadStream(buffer)

      .pipe(csv())

      .on("data", (data) => {
        results.push(data);
      })

      .on("end", () => {
        resolve(results);
      })

      .on("error", (error) => {
        reject(error);
      });
  });
};

module.exports = parseCSV;