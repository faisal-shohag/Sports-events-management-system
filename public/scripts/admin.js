
const router = new Navigo(null, true, '#!');
var app = document.getElementById('app');
const uid = (document.cookie).split('=')[1];
console.log(uid)
router.on({
    "/": function(){
        $('.menu-item').removeClass('menu-item-active');
        $('.events').addClass('menu-item-active');
     app.innerHTML = `
     <div class="section-header">
     <h1  class="section-header-title"><span class="section-header-title-text">Sports Events</span></h1>
     <div class="flex-end"><button id="create_event" class="btn common white-text tooltip"><i class="fi fi-br-plus"></i> Create <span>create event</span></button></div>
     
     <div id="events" class="view flex align-center gap-10"></div>
     
     </div>
     `;

     // fetch Events
     fetch('/getEvents')
     .then(res=>res.json())
     .then(data=>{
       const events = document.getElementById('events');
       for(i in data){
       events.innerHTML += `
         <a href="#!/event/${data[i].id}"><div class="event-card">
         <div class="event_title">${data[i].title}</div>
         <div class="event_time">28 May 2022 - 22 Jul 2022</div>
         <div class="badge-common mg-t-10">${data[i].type}</div>
         </div></a>`
       }
     })
     .catch(err=>{console.log(err)});
     
     $('#create_event').click(()=>{
        $('.modal-wrapper').show();
        $('#modal_body').html(`
        <div class="modal-body">
        <div class="modal-title">Create Event</div>
        <div class="modal-form">
        <form id="createEvent">
          <div>
         <div class="form__group field">
          <input type="input" class="form__field" placeholder="Event title" name="title" id='title' required />
          <label for="title" class="form__label">Title</label>
        </div>
        
        <div class="form-text mg-t-20">Select event type</div>
          <div class="input-group">
              <input id="indoor" type="radio" name="type" value="Indoor" required/>
              <label for="indoor">Indoor</label>
              <input id="outdoor" type="radio" name="type" value="Outdoor" required/>
              <label for="outdoor">Outoor</label>
            </div>
        </div>
        
        <div class="form-text mg-t-20">Start Date</div>
        <div class="datetimepicker">
           <input type="date" id="date" name="startDate" value="2022-06-03">
           <span></span>
      </div>
        
        <div class="form-text mg-t-20">End Date</div>
        <div class="datetimepicker">
           <input type="date" id="date" name="endDate" value="2022-07-03">
           <span></span>
        </div>
        
        <button type="submit" id="eventSubmit" class="btn common white-text mg-t-30">Save</button>
        
        </form>
        </div>
        
         </div>
        `)

         


        const createEvent = document.getElementById('createEvent');
        $('#eventSubmit').click(async(e)=>{
         e.preventDefault();
          let data ={
            title: createEvent.title.value,
            type: createEvent.type.value,
            startAt: createEvent.startDate.value,
            endAt: createEvent.endDate.value,
          }

          try{
            const result = await fetch('/postEvent', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({...data})
            });

            
            $('.modal-wrapper').hide();
            Swal.fire('Added Event!', '', 'success')
          }
          catch(err){
            console.log(err);
            $('.modal-wrapper').hide();
            Swal.fire('Something went wrong!', '', 'success')
          }

        });

      


     });

     $('.modal-close').click(()=>{
        $('.modal-wrapper').hide();
     });
    },
    "/results": function(){
      $('.menu-item').removeClass('menu-item-active');
      $('.results').addClass('menu-item-active');
   app.innerHTML = `
   <div class="section-header">
   <h1 class="section-header-title"><span class="section-header-title-text">Game Standings</span></h1>
   
   
   </div>

   <div id="rank_tables" class="mg-t-20 home-flex-center  animate__animated animate__fadeInUp">
   </div>

   `


//Standings
fetch('/generatedResult')
.then(res=>res.json())
.then(data=>{
  // console.log(data);
  const rank_tables = document.getElementById('rank_tables');
  rank_tables.innerHTML = '';
for(let i=0; i<data.length; i++){
 let arr = getResult(data[i].GameStudents);
 let rank_body = ``;
 for(let j=0; j<arr.length; j++){
  if(j==0) {
      rank_body+= `
  <div class="rank-rw">
  <div class="rank-cl rank-num"><i class="fi fi-sr-trophy"></i></div>
  <img height="30px" src="https://robohash.org/${arr[j].name}?set=set3"/>
  <div class="rank-cl">  ${arr[j].name}</div>
  </div>
  `
  }else{
      rank_body+= `
  <div class="rank-rw">
  <div class="rank-cl rank-num">${j+1}</div>
  <img height="30px" src="https://robohash.org/${arr[j].name}?set=set3"/>
  <div class="rank-cl">  ${arr[j].name}</div>
  </div>
  `
  }
  
 }
  
 if(data[i].GameStudents.length != 0)
 rank_tables.innerHTML += `
 <div class="ranks-table">
  <div class="rank-title">${data[i].GameStudents[0].game.title}</div>
<div class="rank-body">${rank_body}<div>
</div>
 `;

}
  
})


function getResult(data){
let id = new Set();
let rounds = new Set();
for(let i=0; i<data.length; i++){
  id.add(data[i].Students.id);
  rounds.add(data[i].round);
}

let resultArr = [];
 id = Array.from(id);
 rounds = Array.from(rounds);




for(let i=0; i<id.length; i++){
  let sum = 0;
  let name = '';
    for(j=0; j<data.length; j++){
      // console.log(id[i], data[j].student.id);
       if(id[i] == data[j].Students.id){
        sum += data[j].winRank;
        name = data[j].Students.name
       }
     }
  
   resultArr.push({
    id: id[i],
    name: name,
    sum: sum
   });
}

resultArr.sort((a, b) => {
 return a.sum - b.sum;
})

return resultArr;

/*
round_tab_body.innerHTML = `

`
         const gameStdTable = document.getElementById('gameStudents');
         for(i=0; i<resultArr.length; i++){
           gameStdTable.innerHTML += `
           <tr>
           <td class="flex align-center gap-10 bold">${i+1} <span id="${data[i].student.id}-${data[i].attendence} - ${params.id} - ${data[i].round}-${data.length}"  class="winRank"><i class="fi fi-sr-star"></i></span></td>
           <td>${resultArr[i].id}</td>
           <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${resultArr[i].name}?set=set3"/></div>${resultArr[i].name}</div></td>
           </tr>
           `
         }*/
}




    },
    "/students": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.students').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">All Students(<span id="c_a_std"></span>)</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-common"></div>
      </div> 
      
      <button id="create_event" class="btn common white-text tooltip"><i class="fi fi-br-plus"></i> Add Student <span>add student</span></button></div>
      <div class="hr w-full mg-b-10"></div>

     <div class="table-wrapper mg-t-20">
     <table class="fl-table">
         <thead>
         <tr>
             <th>#ID</th>
             <th>Name</th>
             <th>Department</th>
             <th>#Control</th>
         </tr>
         </thead>
         <tbody id="allStudents">

         </tbody>
    </table>
      `


    //get Game Students
    fetch('/getStudents')
      .then(res=>res.json())
      .then(data=>{
        const allStdTable = document.getElementById('allStudents');
        $('#c_a_std').text(data.length)
        for(i in data){
          allStdTable.innerHTML += `
          <tr>
          <td>${data[i].id}</td>
          <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${data[i].name}?set=set3"/></div>${data[i].name}</div></td>
          <td>${data[i].dept}</td>
          <td><div id="${data[i].id}" class="control_icon delete dlt_a_std"><i class="fi fi-sr-trash"></i></div></td>
          </tr>
          `
        }

        $('.dlt_a_std').click(async function(){
          const id = $(this)[0].id;
            try {
              const deleteFromAllStudents = fetch(`/deleteFromAllStudents/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
    
              console.log(deleteFromAllStudents);
              Swal.fire('Deleted a student!', '', 'success');
            } catch (error) {
              console.log(error);
              Swal.fire('Something went wrong!', '', 'error');
            }
        })

    });



      $('#create_event').click(()=>{
         $('.modal-wrapper').show();
         $('#modal_body').html(`
         <div class="modal-body">
         <div class="modal-title">Add a Student</div>
         <div class="modal-form">
         
         <form id="addStudent">
      
 <div class="form__group field">
 <input type="input" class="form__field" placeholder="Name" name="name" id='name' required />
 <label for="name" class="form__label">Name</label>
</div>

<div class="form__group field">
 <input type="number" class="form__field" placeholder="id" name="id" id='id' required />
 <label for="id" class="form__label">Student ID</label>
</div>
 
 <div class="form__group field">
 <input type="input" class="form__field" placeholder="Email" name="email" id='email' required />
 <label for="email" class="form__label">Email</label>
</div>
<div class="email error"></div>

<div class="form__group field">
 <input type="input" class="form__field" placeholder="Department" name="dept" id='dept' required />
 <label for="dept" class="form__label">Department</label>
</div>

<div class="form-text mg-t-20">Select your gender</div>
         <div class="input-group">
             <input id="male" type="radio" name="gender" value="m" required/>
             <label for="male">Male</label>
             <input id="female" type="radio" name="gender" value="f" required/>
             <label for="female">Female</label>
           </div>
       </div>

<div class="form__group field">
 <input type="number" class="form__field" placeholder="age" name="age" id='age' required />
 <label for="age" class="form__label">Age</label>
</div>


<button type="submit" class="btn common white-text text-1xl w-full mg-t-20">Register</button>

         </form>
         </div>
         
          </div>
         `)
         const addStudent = document.getElementById('addStudent');
         $('#eventSubmit').click(async(e)=>{
          e.preventDefault();
          emailError.textContent = '';
         const data = {
          id: stdForm.id.value,
          name: stdForm.name.value,
          gender: stdForm.gender.value,
          email: stdForm.email.value,
          dept: stdForm.dept.value,
          age: stdForm.age.value
         }
         console.log(data);
    try{
          const res = await fetch('/postStudent', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })

          const result = await res.json();
          console.log(result);
          if(result.errors){
              usernameError.textContent = result.errors.username;
              passwordError.textContent = result.errors.password;
          }

          if(result.teacher){
              location.assign('/registrationSeccesfull');
          }
    }
    catch(err)
    {
        console.log(err);
    }
         });

      });

 
      $('.modal-close').click(()=>{
         $('.modal-wrapper').hide();
      });
    },
    "/teachers": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.teachers').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">All Teachers(<span id="c_a_std"></span>)</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-common"></div>
      </div> 
</div>
      <div class="hr w-full mg-b-10"></div>

     <div class="table-wrapper mg-t-20">
     <table class="fl-table">
         <thead>
         <tr>
             <th>#ID</th>
             <th>Name</th>
             <th>Department</th>
             <th>#Control</th>
         </tr>
         </thead>
         <tbody id="allTeachers">

         </tbody>
    </table>
      `


    //get Game Students
    fetch('/getTeachers')
      .then(res=>res.json())
      .then(data=>{
        const allTchTable = document.getElementById('allTeachers');
        $('#c_a_std').text(data.length)
        for(i in data){
          allTchTable.innerHTML += `
          <tr>
          <td>${data[i].id}</td>
          <td>${data[i].name}</td>
          <td>${data[i].dept}</td>
          <td></td>
          </tr>
          `
        }
    });

    },
    "/event/:id": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.events').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">Sports Events</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="event_badge" class="badge-common"></div>
      <div id="event_time" class="event_time"></div> 
      <div class="event_time">|</div> 
      <div id="event_created_at" class="event_time"></div> 
      </div> 
      
      <button id="create_game" class="btn common white-text tooltip"><i class="fi fi-br-plus"></i> Create Game <span>create game event</span></button></div>
      <div class="hr w-full"></div>

      <div id="games" class="view flex align-center gap-10"></div>
     
      `

      //get Event
      fetch('/getEvent/'+params.id)
      .then(res=>res.json())
      .then(data=>{
         $('#event_title').text(data.title)
         $('#event_badge').text(data.type)
         $('#event_time').html(`${dateFormat(new Date(data.startAt), options, ' ')} - ${dateFormat(new Date(data.endAt), options, ' ')}  `);
         $('#event_created_at').html(`Created: ${dateFormat(new Date(data.created_at), options, ' ')}`);
      });

      //get Games
      fetch('/getGames/'+params.id)
      .then(res=> res.json())
      .then(data=>{
        const games = document.getElementById('games')
        
        if(data.length == 0) {
          games.innerHTML =`
          <div class="nothing">No game created here!</div>
          `
        }
       for(i in data){
          games.innerHTML +=`
          <a href="#!/game/${data[i].id}/${params.id}"><div class="event-card">
         <div class="event_title">${data[i].title}</div>
         <div class="event_time">28 May 2022 - 22 Jul 2022</div>
         <div class="badge-blue mg-t-10">${data[i].Teachers.name}</div>
         </div></a>
          `
        }
      })

      // create game modal
      $('#create_game').click(()=>{
         $('.modal-wrapper').show();
         $('#modal_body').html(`
         <div class="modal-body">
         <div class="modal-title">Create Game</div>
         <div class="modal-form">
         <form id="createGame">
          
          <div class="form__group field">
           <input type="input" class="form__field" placeholder="Event title" name="title" id='title' required />
           <label for="title" class="form__label">Title</label>
         </div>
         
         <div class="form-text mg-t-20">Select Teacher</div>
           <div id="teachers" class="input-group">
             
             </div>
        
         
         <button type="submit" id="gameSubmit" class="btn common white-text mg-t-30">Save</button>
         
         </form>
         </div>
         
          </div>
         `)
         
         let tuid = [];
          
         //get teachers
         fetch('/getTeachers')
         .then(res=>res.json())
         .then(data=>{
          console.log(data);
            let teachers = document.getElementById('teachers');
            
           for(i in data){
            tuid.push(data[i].uuid);
            teachers.innerHTML+= `
            <input id="t-${data[i].id}" type="radio" name="teacher" value="${data[i].id}" />
            <label for="t-${data[i].id}">${data[i].name}</label>
            `
           }
           console.log(tuid);
         });
 
         const createGame = document.getElementById('createGame');
         $('#gameSubmit').click(async(e)=>{
          e.preventDefault();
           let data ={
             title: createGame.title.value,
             eventId: parseInt(params.id),
             isResultGen: false,
             teacherUid: tuid[parseInt(createGame.teacher.value)-1]
           }
 
           try{
             const result = await fetch('/postGame', {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data})
             });
             console.log(result);
             $('.modal-wrapper').hide();
             Swal.fire('Game Added!', '', 'success')
             window.location.reload();
           }
           catch(err){
             console.log(err);
             Swal.fire('Something went wrong!', '', 'error')
           }
 
         });
 
       
 
 
      });
 
      $('.modal-close').click(()=>{
         $('.modal-wrapper').hide();
      });
      // create game modal end



    },
    "/game/:id/:eventId": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.events').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">Sports Events</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-common"></div>
      </div> 
      
      <button id="add_round" class="btn common white-text tooltip"><i class="fi fi-br-plus"></i> Add a round <span>add a round with students</span></button></div>
     
      <div class="hr w-full"></div>

      <div id="round_tabs" class="flex tabs gap-10 w-full">
      
      </div>

      <div class="flex-end"> 
     <button id="view_result" class="btn common white-text tooltip"><i <i class="fi fi-br-target"></i> View Result<span>View Result</span></button> 
     </div>

      <div id="round_tab_body" class="tab-body">
     
      </div>
    
      `

      //get Game
      fetch('/getGame/'+params.id)
      .then(res=>res.json())
      .then(data=>{
         $('#event_title').text(data.title)
         $('#game_badge').text(data.Teachers.name)
    });

  let roundCount = 0;


    //Result 
    fetch(`/getResultData/${params.id}/${params.eventId}`)
    .then(res=>res.json())
    .then(data=> {
     console.log(data);

     if(data.ResultState == 0) {
      $('#generate_result').show()
      $('#view_result').hide()
      $('#round_tabs').show();
      $('#add_round').show();
      $('#add_round_students').show();
          //get rounds, add student to the round
    fetch('/getDistinctRound/'+params.id)
    .then(res=>res.json())
    .then(data=>{
      roundCount = data.length;
      const round_tabs = document.getElementById('round_tabs');
       for(i in data){
        round_tabs.innerHTML += `
        <div id="${data[i].round}" class="tab-item">Round ${data[i].round + 1}</div>
        `

        

      
 
      
       
        $('.tab-item').click(function(){
          $('.tab-item').removeClass('tab-active');
          const round = $(this)[0].id;
          localStorage.setItem('round', round);
         
         $($(this)).addClass('tab-active');
          
          fetch('/getGameStudents/'+params.id+'/'+round)
          .then(res=>res.json())
          .then(data=>{
            const round_tab_body = document.getElementById('round_tab_body');
            round_tab_body.innerHTML = `
            <div class="text-3xl mg-t-20">Students(<span id="c_g_std"></span>)</div>
            <div class="flex-end">
            <button id="add_round_students" class="mg-b-10 btn common white-text tooltip round-${round}"><i class="fi fi-br-plus"></i> Add student  <span>Add student to this round</span></button></div>
            </div>
            <div class="table-wrapper">
            <table class="fl-table">
                <thead>
                <tr>
                    <th>#ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>#Control</th>
                </tr>
                </thead>
                <tbody id="gameStudents">
       
                </tbody>
           </table>
            `
            $('#c_g_std').text(data.length)
            const gameStdTable = document.getElementById('gameStudents');
            console.log(data);
            for(i in data){
              gameStdTable.innerHTML += `
              <tr>
              <td>${data[i].Students.id}</td>
              <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${data[i].Students.name}?set=set3"/></div>${data[i].Students.name}</div></td>
              <td>${data[i].Students.dept}</td>
              <td><div id="${data[i].Students.id}" class="control_icon delete dlt_r_std"><i class="fi fi-sr-trash"></i></div></td>
              </tr>
              `
            }


          //add student to the round
          $('#add_round_students').click(function(){
            let round = $(this)[0].classList
            round = round[round.length-1]
            round = round.split('-')
            round = parseInt(round[1]);
            $('.modal-wrapper').show();
            $('#modal_body').html(`
            <div class="modal-body">
            <div class="modal-title">Add Students</div>
            <div class="modal-form">
            
            <form id="createGame">
            <div class="form-text bold mg-t-20">Select Students</div>
              <div id="students" class="input-group"></div>
            <button type="submit" id="roundStudentSubmit" class="btn common white-text mg-t-30">Save</button>
            </form>
            </div>
              </div>
            `)
    

            //students
            fetch('/getStudents')
            .then(res=>res.json())
            .then(data=>{
                let students = document.getElementById('students');
              for(i in data){
              students.innerHTML+= `
                <input type="checkbox" id="std-${data[i].id}" name="std_name" value="${data[i].id}"/>
                <label for="std-${data[i].id}">${data[i].name}(${data[i].id})</label><br>
                `
              }
            })

    
            const createGame = document.getElementById('createGame');
            $('#roundStudentSubmit').click(async(e)=>{
              e.preventDefault();
              const check = document.getElementsByName('std_name');
              let data = [];
              for(i in check){
                if(check[i].checked){
                  data.push(
                    {
                      gameId: parseInt(params.id),
                      studentId: parseInt(check[i].value),
                      round: round,
                      winRank: 0,
                    },
                    
                    )
                }
              }
              try{
                const result = await fetch('/postGameStudents', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
    
                console.log(result);
                $('.modal-wrapper').hide();
           Swal.fire('Student Added!', '', 'success')
           window.location.reload();
              }
              catch(err){
                console.log(err);
           Swal.fire('Something went wrong!', '', 'success')
              }
    
            });
          });
          
          //delete a student from round
          $('.dlt_r_std').click(async function(){
            const id = $(this)[0].id;
            try {
              const result = await fetch(`/deleteRoundStudent/${params.id}/${id}/${round}`,{
                method: 'DELETE',
                headers: {
                  'Content-type': 'application/json'
                }
              })

              console.log(result);
           Swal.fire('Deleted a Student!', '', 'success')
           window.location.reload();
              
            } catch (error) {
           Swal.fire('Something went wrong!', '', 'error')
              console.log(error);
            }
            

          })


        
          });
        })

        
        let getRound = localStorage.getItem('round');
        console.log(getRound);
        console.log(roundCount);
        if(parseInt(getRound) > roundCount-1){
          console.log(roundCount);
          $(document).ready(function(){
            $('#'+parseInt(getRound)-1).click();
        });
        }
        else if(localStorage.getItem('round') == null){
          $('.tab-item:first-child').click();
        }else{
          $(document).ready(function(){
            $('#'+getRound).click();
        });
        }
        


      }
  });
     }else{
      $('#view_result').hide()
      $('#generate_result').hide()
      $('#round_tabs').hide();
      $('#add_round').hide();
      $('#add_round_students').hide();
           //getAllRounds
     fetch(`/getGameRounds/${params.id}`)
     .then(res=>res.json())
     .then(data=> {
      console.log(data);
      let id = new Set();
      let rounds = new Set();
      for(let i=0; i<data.length; i++){
        id.add(data[i].Students.id);
        rounds.add(data[i].round);
      }
 
      let resultArr = [];
       id = Array.from(id);
       rounds = Array.from(rounds);
 
  
 
 
      for(let i=0; i<id.length; i++){
        let sum = 0;
        let name = '';
 
          for(j=0; j<data.length; j++){
            // console.log(id[i], data[j].student.id);
             if(id[i] == data[j].Students.id){
              sum += data[j].winRank;
              name = data[j].Students.name;
             }
           }
        
         resultArr.push({
          id: id[i],
          name: name,
          sum: sum
         });
      }
 
      resultArr.sort((a, b) => {
       return a.sum - b.sum;
      })
 
      round_tab_body.innerHTML = `
               <div id="c_g_std" class="text-3xl mg-t-20">Result</div>
               <div class="flex-end">
               </div>
               <div class="table-wrapper">
               <table class="fl-table">
                   <thead>
                   <tr>
                   <th>Rank</th>
                       <th>#ID</th>
                       <th>Name</th>
                   </tr>
                   </thead>
                   <tbody id="gameStudents">
          
                   </tbody>
              </table>
               `
               const gameStdTable = document.getElementById('gameStudents');
               for(i=0; i<resultArr.length; i++){
                 gameStdTable.innerHTML += `
                 <tr>
                 <td class="flex align-center gap-10 bold">${i+1} <span id="${data[i].Students.id}-${data[i].attendence} - ${params.id} - ${data[i].round}-${data.length}"  class="winRank"><i class="fi fi-sr-star"></i></span></td>
                 <td>${resultArr[i].id}</td>
                 <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${resultArr[i].name}?set=set3"/></div>${resultArr[i].name}</div></td>
                 </tr>
                 `
               }
 
    });
     }
   });

      //view results
      $('#view_result').click(function(){
     



     });

    //create a round
    $('#add_round').click(function(){
      let round = $(this)[0].classList
       $('.modal-wrapper').show();
       $('#modal_body').html(`
       <div class="modal-body">
       <div class="modal-title">Creating Round ${roundCount + 1}</div>
       <div class="modal-form">
       
       <form id="createGame">
       <div class="form-text bold mg-t-20">Select Students</div>
         <div id="students" class="input-group"></div>
       <button type="submit" id="roundSubmit" class="btn common white-text mg-t-30">Save</button>
       </form>
       </div>
        </div>
       `)


       //students
       fetch('/getStudents')
       .then(res=>res.json())
       .then(data=>{
          let students = document.getElementById('students');
         for(i in data){
         students.innerHTML+= `
          <input type="checkbox" id="std-${data[i].id}" name="std_name" value="${data[i].id}"/>
          <label for="std-${data[i].id}">${data[i].name}(${data[i].id})</label><br>
          `
         }
       })


       const createGame = document.getElementById('createGame');
       $('#roundSubmit').click(async(e)=>{
        e.preventDefault();
         const check = document.getElementsByName('std_name');
         let data = [];
         for(i in check){
          if(check[i].checked){
            data.push(
              {
                gameId: parseInt(params.id),
                studentId: parseInt(check[i].value),
                round: roundCount,
                winRank: 0,
              },
              
              )
          }
         }
         try{
           const result = await fetch('/postGameStudents', {
              method: 'POST',
              headers: {
                 'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
           });

           console.log(result);
           $('.modal-wrapper').hide();
          window.location.reload();
         }
         catch(err){
           console.log(err);
             Swal.fire('Something went wrong!', '', 'error')
         }

       });
    });
    


 
    

 
      $('.modal-close').click(()=>{
         $('.modal-wrapper').hide();
      });
      // create game modal end
    },

  

}).resolve();




const fetchMe = (url, getdata) => {
   fetch(url)
   .then(res=>res.json)
   .then(data=>{
     getdata(data);
   }).catch(err=>{getdata(err)})
}



function dateFormat(t, a, s) {
   function format(m) {
      let f = new Intl.DateTimeFormat('en', m);
      return f.format(t);
   }
   return a.map(format).join(s);
}

let options = [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}];
