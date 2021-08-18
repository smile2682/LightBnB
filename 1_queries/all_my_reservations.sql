-- SELECT reservations.id, end_date,start_date, properties.id, users.id
-- FROM reservations
-- JOIN properties ON property_id = properties.id
-- JOIN users ON users.id = guest_id
-- WHERE end_date < now()::date
-- AND users.id = 1
-- LIMIT 10
-- ;

SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
