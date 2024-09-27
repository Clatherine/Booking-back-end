const { fetchBookings, removeBooking, addBooking } = require("../models/bookings.model");

exports.getBookings = (req, res, next) => {
  fetchBookings()
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch((err) => {
      next(err);
    });
};


exports.deleteBooking = (req, res, next) => {
  const {booking_id} = req.params
  removeBooking(booking_id)
.then(()=>{
  res.status(204).end()
})
.catch(next)
}

exports.postBooking = (req, res, next) =>{
console.log(req, "req");
  const {body} = req

const name = body.name
const number_of_guests = body.number_of_guests
const date = body.date
const start_time = body. start_time
console.log('here')
if (!name || !number_of_guests || !date || !start_time){
  console.log(' if here')
  res.status(400).send({msg: "Incomplete POST request: one or more required fields missing data"})
}
else {
  console.log('entering here')
  addBooking(body)
    .then((addedBooking) => {
      res.status(201).send({ addedBooking });
    })
    .catch(next);
    
}
 
}