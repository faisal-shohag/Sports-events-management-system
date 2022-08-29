
const router = new Navigo(null, true, '#!');
var app = document.getElementById('app');
const uid = (document.cookie).split('=')[1];

router.on({
    "/": function(){
        $('.menu-item').removeClass('menu-item-active');
        $('.events').addClass('menu-item-active');
     app.innerHTML = `
     <div class="section-header">
     <h1  class="section-header-title"><span class="section-header-title-text">Sports Events</span></h1>
     
     <div id="events" class="view flex align-center gap-10"></div>
     
     </div>
     `;

     // fetch Events
     fetch('/getTeacherEvents/'+uid)
     .then(res=>res.json())
     .then(data=>{
        // console.log(data);
       const events = document.getElementById('events');
       for(i in data){
       events.innerHTML += `
         <a href="#!/game/${data[i].id}/${data[i].eventId}"><div class="event-card">
         <div class="event_title">${data[i].title}</div>
         <div class="event_time">28 May 2022 - 22 Jul 2022</div>
         <div class="badge-green mg-t-10">${data[i].event.type}</div>
         </div></a>`
       }
     })
     .catch( err=>{
        // console.log(err)
    });
     
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
</div>
      <div class="hr w-full mg-b-10"></div>

     <div class="table-wrapper mg-t-20">
     <table class="fl-table">
         <thead>
         <tr>
             <th>#ID</th>
             <th>Name</th>
             <th>Department</th>
         </tr>
         </thead>
         <tbody id="allStudents">

         </tbody>
    </table>
    </div>
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


    },
   "/game/:id/:eventId": function(params){
      $('.menu-item').removeClass('menu-item-active');
      $('.events').addClass('menu-item-active');
      app.innerHTML = `
      <h1  class="section-header-title"><span id="event_title" class="section-header-title-text">Sports Events</span></h1>
      <div class="flex space-between align-center mg-t-10">
      <div class="flex gap-10 align-center">
      <div id="game_badge" class="badge-green"></div>
      </div> 
      
      <button id="add_round" class="btn green white-text tooltip"><i class="fi fi-br-plus"></i> Add a round <span>add a round with students</span></button>
      </div>
     
      <div class="hr w-full"></div>
      
      <div id="round_tabs" class="flex tabs gap-10 w-full">
      
      </div>
     <div class="flex-end"> 
     <button id="generate_result" class="btn crimson white-text tooltip"><i <i class="fi fi-br-target"></i> Generate Result<span>generate result</span></button> 
     <button id="view_result" class="btn green white-text tooltip"><i <i class="fi fi-br-target"></i> View Result<span>View Result</span></button> 
     </div>
      <div id="round_tab_body" class="tab-body">
      </div>
    
      `
      
     

      //get Game
  fetch('/getGame/'+params.id)
      .then(res=>res.json())
      .then(data=>{
         $('#event_title').text(data.title)
    });

    const round_tabs = document.getElementById('round_tabs');

  let roundCount = 0;
    //get rounds, add student to the round
    fetch('/getDistinctRound/'+params.id)
      .then(res=>res.json())
      .then(data=>{
        roundCount = data.length;
         for(i in data){
          round_tabs.innerHTML += `
          <div id="${data[i].round}" class="tab-item">Round ${data[i].round + 1}</div>
          `
          $('.tab-item').click(function(){
            $('.tab-item').removeClass('tab-active');
            const round = $(this)[0].id;
           
           $($(this)).addClass('tab-active');
            
            fetch('/getGameStudents/'+params.id+'/'+round)
            .then(res=>res.json())
            .then(data=>{
              data.sort((a, b) => {
                if(a.winRank === 0) return 1;
                if(b.winRank === 0) return -1;
                return a.winRank - b.winRank;
              })
              const round_tab_body = document.getElementById('round_tab_body');
              round_tab_body.innerHTML = `
              <div class="text-3xl mg-t-20">Students(<span id="c_g_std"></span>)</div>
              <div class="flex-end">
              </div>
              <div class="table-wrapper">
              <table class="fl-table">
                  <thead>
                  <tr>
                  <th>Rank</th>
                      <th>#ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Attendence</th>
                  </tr>
                  </thead>
                  <tbody id="gameStudents">
         
                  </tbody>
             </table>
              `
              $('#c_g_std').text(data.length)
              const gameStdTable = document.getElementById('gameStudents');
              for(i in data){
                gameStdTable.innerHTML += `
                <tr>
                <td class="flex align-center gap-10 bold">${data[i].winRank} <span id="${data[i].student.id}-${data[i].attendence} - ${params.id} - ${data[i].round}-${data.length}"  class="winRank"><i class="fi fi-sr-star"></i></span></td>
                <td>${data[i].student.id}</td>
                <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${data[i].student.name}?set=set3"/></div>${data[i].student.name}</div></td>
                <td>${data[i].student.dept}</td>
                <td style="flex align-center gap-10 bold">${ap(data[i].attendence)}  <span id="${data[i].student.id}-${data[i].attendence} - ${params.id} - ${data[i].round}" class="shuffle attendence"><i class="fi fi-br-shuffle"></i></span> </td>
                </tr>
                `
              }

              $('.winRank').click(function(){
                $('.modal-wrapper').show();
                let key = $(this)[0].id;
                let id = parseInt(key.split('-')[0]);
                let att = parseInt(key.split('-')[1]);
                let gameId = parseInt(key.split('-')[2]);
                let round = parseInt(key.split('-')[3]);
                let len = parseInt(key.split('-')[4]);

                console.log(len);
                $('#modal_body').html(`
                <div class="modal-body">
                <div class="modal-title">Rank this student</div>
                <div class="modal-form">
                  <div id="ranks"></div>
                </div>
                 </div>
                `)

                let ranks = document.getElementById('ranks');
                for(let i=0; i<=len; i++){
                  ranks.innerHTML += `
                  <div id="rank-${i}" class="rank-click">${i}</div>
                  `
                }

                $('.rank-click').click(async function(){
                  let rn = $(this)[0].id;
                  rn = parseInt(rn.split('-')[1]);

                  try{
                    const result = await fetch('postRank', {
                      method: 'POST',
                      headers: {
                        'Content-type': 'application/json'
                      },
                      body: JSON.stringify({studentId: id, attendence: att, gameId: gameId, round: round, winRank: rn})
                    })
                    console.log(result);
                    window.location.reload();
                  }
                  catch(err){
                    console.log(err);
                  }

                })

         
             });

              function ap(status){
                  return status == 0 ? 'A': 'P';
              }

              $('.attendence').click( async function(){
                let key = $(this)[0].id;
                let id = parseInt(key.split('-')[0]);
                let att = parseInt(key.split('-')[1]);
                let gameId = parseInt(key.split('-')[2]);
                let round = parseInt(key.split('-')[3]);
                att = (att==0) ? 1 : 0;

                console.log(id, att, gameId, round)

                try{
                  const result = await fetch(`/postAttendence`, {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json'
                    },
                    body: JSON.stringify({studentId: id, attendence: att, gameId: gameId, round: round})
                })
                console.log(result);
                 window.location.reload();
                }
                catch(err){
                  console.log(err);
                }
                


              })


            //add student to the round
            // $('#add_round_students').click(function(){
            //   let round = $(this)[0].classList
            //   round = round[round.length-1]
            //   round = round.split('-')
            //   round = parseInt(round[1]);
            //   $('.modal-wrapper').show();
            //   $('#modal_body').html(`
            //   <div class="modal-body">
            //   <div class="modal-title">Add Students</div>
            //   <div class="modal-form">
              
            //   <form id="createGame">
            //   <div class="form-text bold mg-t-20">Select Students</div>
            //     <div id="students" class="input-group"></div>
            //   <button type="submit" id="roundStudentSubmit" class="btn green white-text mg-t-30">Save</button>
            //   </form>
            //   </div>
            //     </div>
            //   `)
      

            //   //students
            //   fetch('/getStudents')
            //   .then(res=>res.json())
            //   .then(data=>{
            //       let students = document.getElementById('students');
            //     for(i in data){
            //     students.innerHTML+= `
            //       <input type="checkbox" id="std-${data[i].id}" name="std_name" value="${data[i].id}"/>
            //       <label for="std-${data[i].id}">${data[i].name}(${data[i].id})</label><br>
            //       `
            //     }
            //   })

      
            //   const createGame = document.getElementById('createGame');
            //   $('#roundStudentSubmit').click(async(e)=>{
            //     e.preventDefault();
            //     const check = document.getElementsByName('std_name');
            //     let data = [];
            //     for(i in check){
            //       if(check[i].checked){
            //         data.push(
            //           {
            //             gameId: parseInt(params.id),
            //             studentId: parseInt(check[i].value),
            //             round: round,
            //             winRank: 0,
            //           },
                      
            //           )
            //       }
            //     }
            //     try{
            //       const result = await fetch('/postGameStudents', {
            //           method: 'POST',
            //           headers: {
            //             'Content-Type': 'application/json'
            //           },
            //           body: JSON.stringify(data)
            //       });
      
            //       console.log(result);
            //       $('.modal-wrapper').hide();
            //  Swal.fire('Student Added!', '', 'success')
            //     }
            //     catch(err){
            //       console.log(err);
            //  Swal.fire('Something went wrong!', '', 'success')
            //     }
      
            //   });
            // });
            
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
                
              } catch (error) {
             Swal.fire('Something went wrong!', '', 'error')
                console.log(error);
              }
              

            })


          
            });
          })
          $('.tab-item:first-child').click();
        }
    
        

    });


     //Result 
     fetch(`/getResultData/${params.id}/${params.eventId}`)
     .then(res=>res.json())
     .then(data=> {
      console.log(data);

      (data.ResultState == 0) ? $('#view_result').hide() : $('#view_result').show();
      (data.ResultState == 1) ? $('#generate_result').hide() : $('#generate_result').show();

    });

    //generate Result 
    $('#generate_result').click(async function(){
      
      try {

        const result = await fetch('postResultState', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
          gameId: params.id,
          eventId: params.eventId,
          ResultState: 1
         })
        })

        console.log(result);

        window.location.reload();
        
      } catch (error) {
        console.log(error);
      }
    })

   

    //view results
    $('#view_result').click(function(){
       //getAllRounds
    fetch(`/getGameRounds/${params.id}`)
    .then(res=>res.json())
    .then(data=> {
     console.log(data);
     let id = new Set();
     let rounds = new Set();
     for(let i=0; i<data.length; i++){
       id.add(data[i].student.id);
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
            if(id[i] == data[j].student.id){
             sum += data[j].winRank;
             name = data[j].student.name;
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
                <td class="flex align-center gap-10 bold">${i+1} <span id="${data[i].student.id}-${data[i].attendence} - ${params.id} - ${data[i].round}-${data.length}"  class="winRank"><i class="fi fi-sr-star"></i></span></td>
                <td>${resultArr[i].id}</td>
                <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${resultArr[i].name}?set=set3"/></div>${resultArr[i].name}</div></td>
                </tr>
                `
              }

   });
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
       <button type="submit" id="roundSubmit" class="btn green white-text mg-t-30">Save</button>
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
                attendence: 0
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
           Swal.fire('Round Added!', '', 'success')
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
