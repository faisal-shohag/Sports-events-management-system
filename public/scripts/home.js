
//Events
let running_events = document.getElementById('running_events');

//get events
fetch('/getEvents')
.then(res=> res.json())
.then(data=>{
    running_events.innerHTML = '';

    for(let i=0; i<data.length; i++){
        running_events.innerHTML += `
    <div class="sec-card">
            <div class="sec-card-title">${data[i].title}</div>
            <div class="sec-card-sub-title">${data[i].type}</div>
            <div class="sec-card-date">${dateFormat(new Date(data[i].startAt), options, ' ')} - ${dateFormat(new Date(data[i].endAt), options, ' ')} </div>
     </div>
        `
    }
});


//available games
const available_games = document.getElementById('available-games');
fetch('/get-available-games')
.then(res=> res.json())
.then(data=>{
    console.log(data);
    available_games.innerHTML = '';

    for(let i=0; i<data.length; i++){
         if(data[i].GameStudents.length !=0){
        let stdSet = new Set();
        for(let s=0; s<data[i].GameStudents.length; s++){
          stdSet.add(data[i].GameStudents[s].studentId);
        }
        available_games.innerHTML += `
    <div class="sec-card">
            <div class="sec-card-title">${data[i].GameStudents[0].game.title}</div>
            <div class="sec-card-sub-title"><i class="fi fi-sr-users-alt"></i> ${stdSet.size}</div>
            <div class="sec-card-date">${dateFormat(new Date(data[i].GameStudents[0].game.created_at), options, ' ')} </div>
            <div id="${data[i].GameStudents[0].gameId}~${data[i].GameStudents[0].game.teacherUid}~${localStorage.getItem('id')}" class="join-btn">Participate</div>
     </div>
        `
      }
    }

    $('.join-btn').click(async function(){
      
      if(localStorage.getItem('id') == null){

        Swal.fire({
          icon: 'warning',
          text: 'Please login first!'
        })

      }else{

        let id = ($(this)[0].id).split('~');
      let gameId = parseInt(id[0]);
      let uuid = id[1];
      let studentId = parseInt(id[2]);
      let createdAt = ((new Date()).toISOString()).toString();
      let state = 0;
  
        

      fetch('/getRequests/'+gameId+'/'+studentId)
      .then(res=>res.json())
      .then(data=>{
        console.log(data);
        if(data.length){
           if(data[0].state==0){
            Swal.fire({
              icon: 'warning',
              text: 'You have sent request before and your request is pending!'
            });
           }else if(data[0].state==2){
            Swal.fire({
            icon: 'error',
            text: 'Your Request Rejected!',
            })
           }else{
            Swal.fire({
              icon: 'warning',
              text: 'You have joined this game!',
              })
           }
        }else{
          Swal.fire({
            icon: 'question',
            text: 'Are you sure?',
            confirmButton: true,
            confirmButtonText: 'Yes'
          }).then( async (res)=>{
            if(res.isConfirmed){
    
              try{
                const res = await fetch('/postGameRequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({gameId, uuid, studentId, createdAt, state})
                })
        
                const result = await res.json();
                console.log(result);

                Swal.fire({
                  icon: 'success',
                  text: 'Request Sent!'
                })
        
                }
                catch(err)
                {
                    console.log(err);
                }
    
            }
          })
        }
      })
        
      }

      

      

     


    })
});



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
        // console.log(id[i], data[j].Students.id);
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
             <td class="flex align-center gap-10 bold">${i+1} <span id="${data[i].Students.id}-${data[i].attendence} - ${params.id} - ${data[i].round}-${data.length}"  class="winRank"><i class="fi fi-sr-star"></i></span></td>
             <td>${resultArr[i].id}</td>
             <td><div class="flex align-center gap-10 bold"> <div class="circle-avatar-small"><img src="https://robohash.org/${resultArr[i].name}?set=set3"/></div>${resultArr[i].name}</div></td>
             </tr>
             `
           }*/
}


//Sports Global News 
//259269244fb04da1ae3150b7468d9ca8

fetch('https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=259269244fb04da1ae3150b7468d9ca8')
.then(res=> res.json())
.then(data=>{
    console.log(data);

    const headlines = document.querySelector('.headlines');
    
   
    let html = '';

    for(let i=0; i<10; i++){

        html += `
        ${data.articles[i].description} <i class="fi fi-br-bowling-ball"></i> 
        `
        
    }

    headlines.innerHTML = `
    <div class="headlines-title">Global</div>
    <div class="news"><marquee>${html}</marquee></div>
    `
})



function dateFormat(t, a, s) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format).join(s);
 }
 
 let options = [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}];
 

 let std_id = localStorage.getItem('id');
 let std_name = localStorage.getItem('name');

let std_log = document.querySelector('.std_log');
if(std_id!=null && std_name!=null){
  std_log.innerHTML=`
  <div class="std_avatar">
  <div class="img"><img src="./images/player.png"></div>
  <div class="text">
  <div class="std_name">${std_name}</div>
  <div class="std_id">${std_id} <small id="std_logout">(Logout)</small></</div>
  </div>
  </div>
  `

  $('#std_logout').click(function(){
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    window.location.reload();
  })
}else{

}