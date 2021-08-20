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
const getUserWithEmail = function (email) {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
      console.log(user.rows[0])
      return user.rows[0]
    })
    .catch(err => {
      console.log(err.messege)
      return null;
    })
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
const getUserWithId = function (id) {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(user => {
      console.log(user.rows[0])
      return user.rows[0]
    })
    .catch(err => {
      console.log(err.messege)
      return null;
    })
}
//   return Promise.resolve(users[id]);
// }
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
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

  return pool.query(`INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *;`, [user["name"], user["email"], user["password"]])
    .then((result) => {
      console.log("rohit test ", result.rows[0]);
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
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`select properties.*, reservations.*,avg(rating) as average_rating
  from reservations join
  properties on properties.id = reservations.property_id join property_reviews on properties.id = reservations.property_id where reservations.guest_id = $1 group by properties.id, reservations.id limit $2;
  `, [guest_id, limit])
    .then(result => {
      console.log(result.rows)
      return result.rows;
    })


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

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `AND $${queryParams.length}<=(properties.cost_per_night/100) `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND $${queryParams.length} >=(properties.cost_per_night/100) `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND $${queryParams.length} = properties.owner_id `;
  }
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `GROUP BY properties.id HAVING $${queryParams.length} >= avg(rating)`;
  }

  // 4
  queryParams.push(limit);
  if (!options.minimum_rating) {
    queryString += `GROUP BY properties.id`
  }
  queryString += `
    
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  // 5
  // console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => {
    // console.log(res.rows)
    return res.rows
  });
};






//     GROUP By properties.id LIMIT $1`, [limit])
//     .then((result) => {
//       // console.log(result.rows);
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

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
const addProperty = function (property) {

  const queryString = `INSERT INTO properties 
  (owner_id, 
  title, 
  description, 
  thumbnail_photo_url, 
  cover_photo_url, 
  cost_per_night, 
  street, 
  city, 
  province, 
  post_code, 
  country, 
  parking_spaces, 
  number_of_bathrooms, 
  number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING * ;`;

  const value = [property.owner_id,
  property.title,
  property.description,
  property.thumbnail_photo_url,
  property.cover_photo_url,
  property.cost_per_night,
  property.street,
  property.city,
  property.province,
  property.post_code,
  property.country,
  property.parking_spaces,
  property.number_of_bathrooms,
  property.number_of_bedrooms];


  return pool
    .query(queryString, value)
    .then(result => {
      //.then is optional here
      console.log('here?')
      return result.rows[0];
    })
    .catch(error => console.log(error.message));

};
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
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);



exports.addProperty = addProperty;
