INSERT INTO users (name, email, password)
VALUES(a,a@a.com,$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.),
(b,b@a.com,$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.),
(c,c@a.com,$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.);


INSERT INTO properties (
  owner_id ,
  title,
  description
  thumbnail_photo_url,
  cover_photo_url,
  country ,
  street ,
  city ,
  province ,
  post_code ,)
  VALUES(1,as,description,a.com,A.com,aa,aaa,aaaa,aaaaa,aaaaaaa),
  (2,bs,description,b.com,B.com,bb,bbb,bbbb,bbbbb,bbbbbbb),
  (3,cs,description,c.com,C.com,cc,ccc,cccc,ccccc,ccccccc);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id,property_id ,reservation_id ,rating
);
VALUES (1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3);
