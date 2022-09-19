const db = require('../db/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User{

    create({name, password, email}){
        this.name = name;
        this.password = password;
        this.email = email;
    }

    async save(){
        try{
            this.password = await bcrypt.hash(this.password, 8);
            const result = await db.execute('INSERT INTO users VALUES(?, ?, ?, ?)', [0, this.name, this.password, this.email]);
            this.id = result[0].insertId;
        }catch(e){
            throw new Error();
        } 
    }

    static async getById(id){
        const result = await db.execute('SELECT * FROM users WHERE userId = ?', [id]);
        const user = result[0][0];
        return user;
    }

    static async deleteById(id){
        const result = await db.execute('DELETE FROM users WHERE userId = ?', [id]);
    }

    async login({email, password}){
        try{
            const result = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            const user = result[0][0];
            if(user===undefined){
                throw new Error('Unable to login!');
            }

            const isMatch = await bcrypt.compare(password, user.pword);

            if(!isMatch){
                throw new Error('Unable to login!');
            }
            this.id = user.userId;
            this.name = user.name;
            this.email = user.email
        } catch(e){
            throw new Error(e);
        }
    }

    generateAuthToken(){
        const token = jwt.sign({ id: this.id}, 'thisismycourse');
        return token;
    }

    static async update(id, updates){

        const updatesKeys = Object.keys(updates);
        let query = 'UPDATE users SET ';

        for(let i = 0; i<updatesKeys.length; i++){
            query += `${updatesKeys[i]} = ?`;
            if(i!=updatesKeys.length-1){
                query += ', ';
            }
        }

        const updatesValues = Object.values(updates);
        query += ' WHERE userId = ?';
        const queryParams = updatesValues;
        queryParams.push(parseInt(id)); 

        try{
            await db.execute(query, queryParams);
        }catch(e){
            throw new Error();
        }
    }
}

module.exports = User;