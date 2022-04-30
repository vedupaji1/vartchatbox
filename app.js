const express = require('express');
const app = express();
const http = require('http');
const https = http.createServer(app);
const io = require('socket.io')(https);
const port = process.env.PORT || 80;


app.set('view engine', 'hbs');
app.get('/', (req, res) => {
  res.render("index");
});
app.get('/chat', (req, res) => {
  res.render("logg");
})
app.get('/404sorry', (req, res) => {
  res.render("404error")
})
https.listen(port, () => {
  console.log(`Ok`);
});

let room_users_details = {

  available_room_list: ['End_Of_Earth_By_Vedupaji', 'vart', 'vv'],
  room_details: [
    {
      room_name: 'End_Of_Earth_By_Vedupaji',
      total_number_of_users: 2,
      id_of_user: ['Defaul_Id'],
      profile_image:['Default'],
      name_of_users: ['vedupaji']
    },
    {
      room_name: 'vart',
      total_number_of_users: 2,
      id_of_user: ['Defaul_Id'],
      profile_image:['Default'],
      name_of_users: ['vedupaji']
    },
    {
      room_name: 'vv',
      total_number_of_users: 2,
      id_of_user: ['Defaul_Id'],
      profile_image:['Default'],
      name_of_users: ['vedupaji']
    }
  ]
}

let dele_op, iter_10 = 0;

io.on('connection', (socket) => {
  console.log(`Someone Connected`);


   socket.on('send_user_data',(room_name_op_1)=>{
     let room_no_op_1 = room_users_details.available_room_list.indexOf(room_name_op_1);
     io.to(socket.id).emit('data_accept_op',room_users_details.room_details[room_no_op_1])
   })


  socket.on('create_room_op', (user_data1) => {
    if (room_users_details.available_room_list.indexOf(user_data1.room) == -1) {
      socket.emit('result_on_room', "yes");
      room_users_details.available_room_list.push(user_data1.room);
      let room_structure_design = {
        room_name: user_data1.room,
        total_number_of_users: 1,
        id_of_user: ['Defaul_Id'],
        profile_image:['Default'],
        name_of_users: ['vedupaji']
      };
      room_users_details.room_details.push(room_structure_design);
    }
    else {
      socket.emit('result_on_room', "no");
    }
  })

  socket.on('receive_users_data', (user_data1) => {
    if (room_users_details.available_room_list.indexOf(user_data1.room) != -1) {
      let room_name_number = room_users_details.available_room_list.indexOf(user_data1.room);
      if (room_users_details.room_details[room_name_number].name_of_users.indexOf(user_data1.name) == -1) {

        io.to(socket.id).emit('response_10', "yes");
      }
      else {
        io.to(socket.id).emit('response_10', "no_name")
      }

    }
    else {
      io.to(socket.id).emit('response_10', "no_room")
    }
    console.log(socket.id)
  })


  socket.on('room_request', (user_data1) => {
    let room_name_number = room_users_details.available_room_list.indexOf(user_data1.room);

    if (room_users_details.available_room_list.indexOf(user_data1.room) != -1) {
      if (room_users_details.room_details[room_name_number].name_of_users.indexOf(user_data1.name) == -1) {

        socket.join(user_data1.room)

        room_users_details.room_details[room_name_number].total_number_of_users += 1;
        room_users_details.room_details[room_name_number].name_of_users.push(user_data1.name);

        let ind1 = room_users_details.room_details[room_name_number].name_of_users.indexOf(user_data1.name)
        room_users_details.room_details[room_name_number].id_of_user.splice(ind1, 0, socket.id);
        room_users_details.room_details[room_name_number].profile_image.splice(ind1, 0, user_data1.profile_pic);

        console.log(`${dele_op} ${iter_10}`)
        if (iter_10 == 1) {
          console.log(`Hello Guys ${dele_op}`);
          if (room_users_details.room_details[dele_op].total_number_of_users == 1) {
            room_users_details.room_details.splice(dele_op, 1);
            room_users_details.available_room_list.splice(dele_op, 1);
          }
          iter_10 = 0;
        }
        io.in(user_data1.room).emit('receive_data', "hello")
        for (let i = 0; i < room_users_details.room_details.length; i++) {
          console.log(room_users_details.room_details[i]);
        }
        console.log(`User ${socket.id}:- ${JSON.stringify(user_data1)} `);
      }
      else {
        io.to(socket.id).emit('response_op10', "no_name")
      }
    }
    else {
      io.to(socket.id).emit('response_op10', "no_room")
    }

  });

  socket.on('mess_op', (user_dd) => {
    socket.to(user_dd.room).emit('get_message', user_dd)
  });

  socket.on('disconnect', () => {
    let ii1 = 0, ii2 = 0;
    for (let i = 0; i < room_users_details.room_details.length; i++) {
      for (let j = 0; j < room_users_details.room_details[i].id_of_user.length; j++) {
        if (room_users_details.room_details[i].id_of_user[j] == socket.id) {
          ii1 = i;
          ii2 = j;
          break;
        }
      }
    }
    room_users_details.room_details[ii1].total_number_of_users -= 1;
    room_users_details.room_details[ii1].id_of_user.splice(ii2, 1);
    room_users_details.room_details[ii1].name_of_users.splice(ii2, 1);
    room_users_details.room_details[ii1].profile_image.splice(ii2, 1);

    if (ii1 > 2) {
      if (room_users_details.room_details[ii1].total_number_of_users == 1) {
        dele_op = ii1;
        iter_10 = 1;
        console.log(`${dele_op} ${iter_10} Happy`)
      }
    }

  })

})



