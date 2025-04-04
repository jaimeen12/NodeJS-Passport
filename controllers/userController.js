import mysql from 'mysql2'

import dotenv from 'dotenv';
dotenv.config()
 
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.MYSQL_USER_PASSWORD,
    user: process.env.MYSQL_USER_USER,
    database: process.env.MYSQL_USER_DATABASE,
    host: process.env.MYSQL_HOST,

});


export async function getNote(id) {
    const [row] = await pool.query(`
        SELECT * 
        FROM notes_table 
        WHERE id =?`, [id])
    return row[0];
}
 
export async function getUser(id) {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM User WHERE id= ?', [id], (error, user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user);
        });
    });
};
 
 
 
 
 
export async function getUserByEmail(email) {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM User WHERE email = ?', [email], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};
 
 
 

export async function insertUser (first_name, last_name, email, password) {
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO User (first_name, last_name, email, password) VALUES (?, ?, ?,?)', [first_name, last_name, email, password], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};
 
 
