const mongoose = require('mongoose');
const mongoPath = 'mongodb+srv://jjohn513:4osk69vd79RDW9ot@cluster1.noaz2.mongodb.net/How-Was-School ?retryWrites=true&w=majority'

//password
//4osk69vd79RDW9ot

module.exports = async() => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  return mongoose
  
} 