create database HerWatch;
use HerWatch;
create table user_details (
Email_id varchar(100) not null UNIQUE,
First_name varchar(100) not null,
Last_name varchar(100),
Age int not null,
Phone_number int primary key,
username varchar(100) UNIQUE,
password varchar(100) not null,
pin int not null
);

exec sp_help 'user_details';
Select * from user_details;
insert into user_details values('pranatikackar2626@gmail.com','Pranati','Kackar',20,8005917713,'Pranati26','pranu',1234);
insert into user_details values('mvyas1302@gmail.com','Mayank','Vyas',21,9370664741,'Mayank13','mayank',1234);

