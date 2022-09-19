const db = require('../db/db.js');

class Task{
    constructor({title, description, status, userId}){
        this.title = title;
        this.description = description;
        this.status = status;
        this.userId = userId;
    }

    save(){
        return db.execute('INSERT INTO tasks VALUES(?, ?, ?, ?, ?)', [0, this.title, this.description, this.status, this.userId]);
    }

    static getById(id, userId){
        return db.execute('SELECT * FROM tasks where taskId = ? AND userId = ?', [id, userId]);
    }
    
    static getAll(userId){
        return db.execute('SELECT * FROM tasks WHERE userId = ?', [userId]);
    }

    static deleteById(id, userId){
        return db.execute('DELETE FROM tasks WHERE taskId = ? AND userId = ?', [id, userId]);
    }

    static update(id, userId, updates){

        const updatesKeys = Object.keys(updates);
        let query = 'UPDATE tasks SET ';

        for(let i = 0; i<updatesKeys.length; i++){
            query += `${updatesKeys[i]} = ?`;
            if(i!=updatesKeys.length-1){
                query += ', ';
            }
        }

        const updatesValues = Object.values(updates);
        query += ' WHERE taskId = ? AND userId = ?';
        const queryParams = updatesValues;
        queryParams.push(parseInt(id));
        queryParams.push(parseInt(userId));
        
        return db.execute(query, queryParams);
    }
}

module.exports = Task;