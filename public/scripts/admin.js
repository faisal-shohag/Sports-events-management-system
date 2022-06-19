const router = new Navigo(null, true, '#!');
var app = document.getElementById('app');

router.on({
    "/": function(){
        $('.menu-item').removeClass('menu-item-active');
        $('.events').addClass('menu-item-active');
     app.innerHTML = `
     <div class="section-header">
     <h1  class="section-header-title"><span class="section-header-title-text">Sports Events</span></h1>
     <div class="flex-end"><button id="create_event" class="btn green white-text tooltip"><i class="fi fi-br-plus"></i> Create <span>create event</span></button></div>
     
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
         <div class="badge-green mg-t-10">${data[i].type}</div>
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
        
        <button type="submit" id="eventSubmit" class="btn green white-text mg-t-30">Save</button>
        
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

            console.log(result);

          }
          catch(err){
            console.log(err);
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
     <h1 class="section-header-title"><span class="section-header-title-text">Event Results</span></h1>
     </div>
     `
    },
    "/students": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.students').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">All Students(<span id="c_a_std"></span>)</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-green"></div>
      </div> 
      
      <button id="create_event" class="btn green white-text tooltip"><i class="fi fi-br-plus"></i> Add Student <span>add student</span></button></div>
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
          <td>${data[i].name}</td>
          <td>${data[i].dept}</td>
          <td></td>
          </tr>
          `
        }
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


<button type="submit" class="btn green white-text text-1xl w-full mg-t-20">Register</button>

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
      <div id="game_badge" class="badge-green"></div>
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
      <div id="event_badge" class="badge-green"></div>
      <div id="event_time" class="event_time"></div> 
      <div class="event_time">|</div> 
      <div id="event_created_at" class="event_time"></div> 
      </div> 
      
      <button id="create_event" class="btn green white-text tooltip"><i class="fi fi-br-plus"></i> Create Game <span>create game event</span></button></div>
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
        for(i in data){
          games.innerHTML +=`
          <a href="#!/game/${data[i].id}"><div class="event-card">
         <div class="event_title">${data[i].title}</div>
         <div class="event_time">28 May 2022 - 22 Jul 2022</div>
         <div class="badge-blue mg-t-10">${data[i].teacher.name}</div>
         </div></a>
          `
        }
        console.log(data);
      })

      // create game modal
      $('#create_event').click(()=>{
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
        
         
         <button type="submit" id="eventSubmit" class="btn green white-text mg-t-30">Save</button>
         
         </form>
         </div>
         
          </div>
         `)
 
          
         //get teachers
         fetch('/getTeachers')
         .then(res=>res.json())
         .then(data=>{
            let teachers = document.getElementById('teachers');
           for(i in data){
            teachers.innerHTML+= `
            <input id="t-${data[i].id}" type="radio" name="teacher" value="${data[i].id}" />
            <label for="t-${data[i].id}">${data[i].name}</label>
            `
           }
         });
 
         const createGame = document.getElementById('createGame');
         $('#eventSubmit').click(async(e)=>{
          e.preventDefault();
           let data ={
             title: createGame.title.value,
             eventId: parseInt(params.id),
             isResultGen: false,
             teacherId: parseInt(createGame.teacher.value)
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
 
           }
           catch(err){
             console.log(err);
           }
 
         });
 
       
 
 
      });
 
      $('.modal-close').click(()=>{
         $('.modal-wrapper').hide();
      });
      // create game modal end



    },
    "/game/:id": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.events').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">Sports Events</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-green"></div>
      </div> 
      
      <button id="create_event" class="btn green white-text tooltip"><i class="fi fi-br-plus"></i> Add Students <span>add students</span></button></div>
      <div class="hr w-full"></div>

     <div class="text-3xl mg-t-20">Students(<span id="c_g_std"></span>)</div>

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

      //get Event
      fetch('/getGame/'+params.id)
      .then(res=>res.json())
      .then(data=>{
         $('#event_title').text(data.title)
         $('#game_badge').text(data.teacher.name)
    });

    //get Game Students
    fetch('/getGameStudents/'+params.id)
      .then(res=>res.json())
      .then(data=>{
        const gameStdTable = document.getElementById('gameStudents');
        $('#c_g_std').text(data.length)
        for(i in data){
          gameStdTable.innerHTML += `
          <tr>
          <td>${data[i].student.id}</td>
          <td>${data[i].student.name}</td>
          <td>${data[i].student.dept}</td>
          <td></td>
          </tr>
          `
        }
    });

      $('#create_event').click(()=>{
         $('.modal-wrapper').show();
         $('#modal_body').html(`
         <div class="modal-body">
         <div class="modal-title">Add Students</div>
         <div class="modal-form">
         
         <form id="createGame">
         <div class="form-text bold mg-t-20">Select Students</div>
           <div id="students" class="input-group"></div>
         <button type="submit" id="eventSubmit" class="btn green white-text mg-t-30">Save</button>
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
         $('#eventSubmit').click(async(e)=>{
          e.preventDefault();
           const check = document.getElementsByName('std_name');
           let data = [];
           for(i in check){
            if(check[i].checked){
              data.push(
                {
                  gameId: parseInt(params.id),
                  studentId: parseInt(check[i].value)
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
 
           }
           catch(err){
             console.log(err);
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
