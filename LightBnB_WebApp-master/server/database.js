const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { user } = require('pg/lib/defaults');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

console.log('this is the database.js!')
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query (`SELECT * FROM users WHERE email = $1`,[email])
  .then(user=>{
    console.log(user.rows[0])
    return user.rows[0] })
  .catch(err => {
    console.log(err.messege)
    return null;})
  }
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query (`SELECT * FROM users WHERE id = $1`,[id])
  .then(user=>{
    console.log(user.rows[0])
    return user.rows[0] })
  .catch(err => {
    console.log(err.messege)
    return null;})
  }
//   return Promise.resolve(users[id]);
// }
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // this does not work since join will out all three into a string, instead of 3 seperate strings
  // console.log("test ",user);
  // const value = Object.values(user)
  //   // console.log('value', value)
  // const valueStr = value.join()
  //   console.log('valueStr', valueStr)
  // const key = Object.keys(user)
  //   // console.log('key',key)
  // const keyStr = key.join()
  //   // console.log('keyStr', keyStr)

  return pool.query (`INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *;`, [user["name"], user["email"], user["password"]] )
  .then((result) => {
    console.log("rohit test ",result.rows[0]);
    return result.rows[0];
})
.catch((err) => {
  console.log(err.message);
  })
}
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// // get all properties
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const value = Object.values(property)
  // const key = Object.keys(property)
  // const keyArr = key.join()
  // return pool.query (`INSERT INTO properties(${keyArr}) VALUES($1);` [value])
  // .then((result) => {
  //   console.log(result.rows);
  //   return result.rows;
// })
// .catch((err) => {
//   console.log(err.message);
// });
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property); 


}
exports.addProperty = addProperty;
