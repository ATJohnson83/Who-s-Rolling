// ---------- global variables ----------

let playerCount;
let playerScores = [];

$('#get-name').on('click', () => {
  let celebName = $('#name').val();
  celebNameLowerCase = celebName.toLowerCase();
  celebNameDash = celebName.replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g, "");
  let letCheck = celebNameLowerCase.match(/\b(\w)/g);
  if ( !letCheck.includes($('#ranLet').text().toLowerCase()) ){
    alert(`Celebrity's first or last name must start with ${$('#ranLet').text().toUpperCase()}`);
  }
  else{
    $.ajax({
      method: "GET",
      url: "/celeb_name/" + celebNameDash
    }).done((data, status) => {
      const name = data.name;
      const link = data.link;
      const imgURL = data.imgURL;
      $('#check-name').html(name);
      $('#check-img').attr('src', imgURL);
    });
  }
})

$('#yes').on('click', () => {
  $.ajax({
    method: "GET",
    url: "/celeb_net_worth/"
  }).done((data, status) => {
    const netWorth = data.netWorth;
    printData(netWorth);
  })
})

const printData = (netWorth) => {
  $('#net-worth').html(netWorth);
}

$('#no').on('click', () => {
  $('#name').empty();
  $('#check-name').empty();
  alert("pick another celebrity");
})

const playerSetup = (num) => {
  playerCount = num;
  clearGame();
  for (var i = 1; i <= num; i++) {
    let player = '<div class="class-xs-12 col-md-3"><div class="card" style="width: 18rem;"><div class="card-body text-center"><h5 class="card-title">Player ' + i + '</h5><p class="card-text">player name</p><div id="player-' + i + '-score"></div><img id="player-' + i + '-d1"></img><img id="player-' + i + '-d2"></img></div></div></div>';
    $('#player-div').append(player);
  }
}

const clearGame = () => {
  $('#player-div').empty();
  playerScores = [];
}


const diceRoll = () => {
  let scoreArr = [];
  let pNum = 1;
  while ((scoreArr.length) < playerCount){
    let rnum1 = Math.floor(Math.random() * 6) + 1;
    let rnum2 = Math.floor(Math.random() * 6) + 1;
    let totScore = rnum1 + rnum2;
    
    if(scoreArr.indexOf(totScore) === -1){
      scoreArr.push(totScore);
      let pObj = {
        "player": pNum,
        "score": totScore,
        "d1": rnum1,
        "d2": rnum2
      }
      pNum++;
      playerScores.push(pObj);
    }

  }
  scoreSetup();
  playerScores.sort(function(a, b){
    return a.score - b.score;
  })
  console.log(playerScores);
}



const scoreSetup = () => {
  playerScores.forEach((v) => {
    let player = v.player;
    let score = v.score;   
    let d1 = v.d1;
    let d2 = v.d2;
    $('#player-'+player+'-d1').attr('src', "../images/dice-"+d1+"-th.png");
    $('#player-'+player+'-d2').attr('src', "../images/dice-"+d2+"-th.png");
    $('#player-'+player+'-score').html(score);
  })
  setTimeout(()=>{
    celebPick();
  }, 5000);
  
}

const celebPick = () => {
  const winner = playerScores[playerScores.length-1];
  $("#high-roll").html(winner.player);
  $("#celeb-pick").modal();
  ranLetGen();
}

const ranLetGen = () =>{
  const capLet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let randLetIn = Math.floor(Math.random() * 26);
  let randLet = capLet[randLetIn];
  $('#ranLet').html(randLet);
}





