import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config()

import { getUser,getUserByEmail } from './userController.js';

// create the connection   
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes(userEmail) {

    const [rows] = await pool.query(`
        SELECT * FROM notes_table 
        where created_by=?`, [userEmail])
    return rows;
}

export async function getNote(id) {
    const [row] = await pool.query(`
        SELECT * 
        FROM notes_table 
        WHERE id =?`, [id])
    return row[0];
}


export async function createNoteController(title, status, user) {
    const [result] = await pool.query(`
        INSERT INTO notes_table (title, status, created_by)
        VALUES (?,?,?)`, [title, status, user])
    const id=result.insertId
    return getNote(id)
}

export async function deleteNoteController(id,userEmail) {
    try{
        const [row] = await pool.query(`
            SELECT * 
            FROM notes_table 
            WHERE id =?`, [id])
            console.log(row)
        if(row[0].created_by == userEmail){
            console.log(row);
            const [result] = await pool.query(`
                DELETE FROM notes_table
                WHERE id=?`, [id])
                return 'Note deleted successfully'
        }
        else{
            console.log("in else func")
            return 'Unable to delete note'
        }
        
    }catch(e){
        
        return e
    }
}


export async function updateNoteController(title, status,id,userEmail) {
    try{
        const [row] = await pool.query(`
            SELECT * 
            FROM notes_table 
            WHERE id =?`, [id])
        if(row[0].created_by == userEmail){
            console.log(row);
            const [result] = await pool.query(`
            UPDATE notes_table 
            SET status=?
            WHERE id=?`, [status,id])
                return 'Note updated successfully'
        }
        else{
            console.log("in else func")
            return 'Unable to update note'
        }

    }catch(e){
        return e
    }
}

export async function sayHello (id) {
    const user = await getUserByEmail(id);
    return user;
}