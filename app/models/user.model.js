const pool = require('../../database/db');

exports.findUser = async (email) => {
	const {rows = []} = await pool.query(` select * from users where email = $1 and isdeleted = false`, [email]);
    return rows;
};

exports.save = async (data) => {
	const { rows } = await pool.query(`insert into users (username, email, lastloggedin, ip, googleid) values ($1, $2, $3, $4, $5) returning *`, [data.username, data.email, data.lastLoggedIn, data.ip, data.googleId]);
    return rows[0];
};