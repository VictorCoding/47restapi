'use strict';

const r = require('rethinkdb');

exports.register = (server, options, next) => {
  const db = '47';
  const usersTable = 'users';
  let conn;
  
  //Connect and initialize
  r.connect((err, connection) => {

      if (err) {
          return next(err);
      }

      conn = connection;

      //Create db
      r.dbCreate(db).run(connection, (err, result) => {

          //Create users table
          r.db(db).tableCreate(usersTable).run(connection, (err, result) => {
            
              return next();
          });

      });
  });
  
  server.method('db.createUser', (user, callback) => {
    r.db(db).table(usersTable).insert(user).run(conn, callback);
  });
  
  server.method('db.getUser', (id, callback) => {
    r.db(db).table(usersTable).get(id).run(conn, callback);
  })
  
  server.method('db.editUser', (user, callback) => {
    r.db(db).table(usersTable).get(user.id).update(user).run(conn, callback);
  });
  
  server.method('db.deleteUser', (id, callback) => {
    r.db(db).table(usersTable).get(id).delete().run(conn, callback);
  });

  server.method('db.getUsers', (limit, callback) => {
    r.db(db).table(usersTable).orderBy(r.desc('createdAt')).limit(limit).run(conn, callback);
  });
};

exports.register.attributes = {
    name: 'db'
};