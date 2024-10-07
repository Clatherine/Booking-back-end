const { openingTime, closingTime } = require("../config/times");

exports.getTimes = (req,res) => {
      return res.status(200).send({ times: { openingTime, closingTime } });
};
