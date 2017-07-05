//Setting up firebase

// Initialize Firebase
var config = {
apiKey: "AIzaSyCTm2-aCuQ3ODMkJpWXpvhzXkak9N6UEQE",
authDomain: "rps-multiplayer-2c1a7.firebaseapp.com",
databaseURL: "https://rps-multiplayer-2c1a7.firebaseio.com",
projectId: "rps-multiplayer-2c1a7",
storageBucket: "rps-multiplayer-2c1a7.appspot.com",
messagingSenderId: "326882502844"
};
firebase.initializeApp(config);

var database = firebase.database();

//Variable

// Intializing Player Score
var numPlayer;
var player = {};
var opponent; 
var playerChoice;
var opponentChoice;
var playerScore;
var playerDataLocation;
var opponentDataLocation;
var gameReady;
var playerName;


$(window).on('load',function(){
    $('#myModal').modal('show');
});

//Check number of players



$("#submit").click(function(event){
	event.preventDefault();
	if($(this).val().trim() === ""){$("#selectName").html("Name cannot be a blank")}
	if(numPlayer == 2){return}

	database.ref().once("value",function(snapshot){
		if(!snapshot.child("player1data").exists()){
			playerName = $("#usr").val().trim();
				console.log
			player = {
				name: playerName,
				id: "player1"
			}
			resetScore(player)
			database.ref("player1data").set({
				"player": player,
			})

			playerDataLocation = "player1data/player";

			opponent = "player"
			opponentId = "player2"

			opponentDataLocation = "player2data/"+ opponent;

		}else{
			playerName = $("#usr").val().trim();
			player = {
				name: playerName,
				id: "player2"
			}
			resetScore(player);
			database.ref("player2data").set({
				"player": player,
			})

			playerDataLocation = "player2data/player";

			opponent = "player"
			opponentId = "player1"
			opponentDataLocation = "player1data/"+ opponent;
		}
	})

})


database.ref().on("value",function(snapshot){
	numPlayer = snapshot.numChildren();

	if(numPlayer === 1 && player.id === "player1"){
			$("#matchingModal").modal('show')
	}else if (numPlayer === 2){
		gameReady = true;
		$('#matchingModalMessage').html('Player 2 has entered the game!')
		setTimeout(function() {$('#matchingModal').modal('hide')}, 2000);
		setTimeout(function(){			
			$("#"+player.id+"Name").html(player.name)
			database.ref().once("value",function(childSnapshot){
				var name = childSnapshot.child(opponentDataLocation+"/name").val()
				$("#"+opponentId+"Name").html(name)
			})
		,2000})
	}
})


$(".choiceBtn").click(function(){
	database.ref(playerDataLocation).update({choice: $(this).attr("data-choice")})

	database.ref(playerDataLocation+"/choice").on('value',function(snapshot){
		playerChoice = snapshot.val();
			
 		})
	database.ref(opponentDataLocation+"/choice").on('value',function(oppSnapshot){
	opponentChoice = oppSnapshot.val();
	if(opponentChoice === null || opponentChoice || undefined){alert("Waiting for opponent to make a move")}
	})
})

database.ref().on('value',function(ParentSnapshot){
	if(ParentSnapshot.child(opponentDataLocation+"/choice").exists() && ParentSnapshot.child(playerDataLocation+"/choice").exists() ){
		checkChoices(playerChoice,opponentChoice)
	}
	setTimeout(function(){updateGame(ParentSnapshot)},500);
})


function resetScore(player){
	player.win = 0;
	player.lose = 0;
	player.tie = 0;

}

function updateGame(snapshot){
	$('#'+player.id+"-Win").html(player.win)
	$('#'+player.id+"-Lose").html(player.lose)
	$('#'+player.id+"-Tie").html(player.tie)
	if(gameReady === true){
		oppScore = snapshot.child(opponentDataLocation).val()
		$('#'+oppScore.id+"-Win").html(oppScore.win)
		$('#'+oppScore.id+"-Lose").html(oppScore.lose)
		$('#'+oppScore.id+"-Tie").html(oppScore.tie)
	}
}

function checkChoices(playerChoice,opponentChoice){
	if(playerChoice === opponentChoice && playerChoice !== ""){
		player.tie++;	
	}else if(playerChoice === "rock"){
		if(opponentChoice === "scissors"){
			player.win++
		}else if(opponentChoice === "paper"){
			player.lose++;
		}
	}else if(playerChoice === "paper"){
		if(opponentChoice === "rock"){
			player.win++
		}else if(opponentChoice === "scissors"){
			player.lose++;
		}
	}else if(playerChoice === "scissors"){
		if(opponentChoice === "paper"){
			player.win++;
		}else if(opponentChoice === "rock"){
			player.lose++;
		}
	}

	database.ref(playerDataLocation+"/choice").remove()

	database.ref(player.id+"data").set({player:player})
}

database.ref(player.id+"data").onDisconnect().remove()