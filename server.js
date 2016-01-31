'use strict';

const Hapi = require('hapi');
const r = require('rethinkdb');
const db = require('./plugins/db');
const _ = require('lodash');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3000
});

server.register([db], (err) => {
  
  <!-- Routes/Endpoints -->
  server.route({
      method: 'GET',
      path:'/users', 
      handler: function (request, reply) {
        server.methods.db.getUsers(10, (err, response) => {
          if (err) throw err;
          
          return reply(response).code(200);;
        });
      }
  });
  
  server.route({
    method: ['POST', 'PUT'],
    path: '/user/{id?}',
    handler: (request, reply) => {
      const user = request.payload;
      
      if (request.method === 'put') {
        user.id = request.params.id;
        
        server.methods.db.editUser(user, (err, response) => {
          if (err) return reply().code(500);
          
          return reply(response).code(200);
        });
        
      } else {
        server.methods.db.createUser(user, (err, response) => {
          if (err) return reply().code(500);
          
          return reply().code(201);
        });
      }
    }
  })
  
  server.route({
    method: 'GET',
    path: '/user/{id}',
    handler: (request, reply) => {
      server.methods.db.getUser(request.params.id, (err, response) => {
        if (err) throw err;
        
        return reply(response).code(200);
      })
    }
  })
  
  server.route({
    method: 'DELETE',
    path: '/user/{id}',
    handler: (request, reply) => {
      server.methods.db.deleteUser(request.params.id, (err, response) => {
        if (err) throw err;
        
        return reply(response).code(200);
      });
    }
  })
  
  // Start the server
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });
});