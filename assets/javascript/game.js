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
var intervalID;
var numPlayer;
var player = {};
var playerChoice;
var opponentChoice;
var playerScore;
var playerDataLocation;
var playerMessageData;
var opponentDataLocation;
var gameReady;
var playerName;
var time = 5;
// countdown timer

// function timer(){
// 	time--
// 	$("#timer").text(time)
// 	if(time === 0){
// 		clearInterval(intervalID)
// 		if(playerChoice === null){
// 			database.ref(playerDataLocation).update({choice: ""})
// 		}
// 	}
// }

// reset player scores to 0
function resetScore(player){
	player.win = 0;
	player.lose = 0;
	player.tie = 0;

}

// Update player scores using the approprite div 

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

// Check the choice of player against each other

function checkChoices(playerChoice,opponentChoice,player){
	
	if(playerChoice === "rock"){
		if(opponentChoice === "scissors"){
			player.win++;
			$("#decision").html("You Won!")
		}else if(opponentChoice === "paper"){
			player.lose++;
			$("#decision").html("You Lost!")
		}else if(opponentChoice === "rock"){
			player.tie++;	
			$("#decision").html("It's a Tie!")
		}else if(enemyChoice === ""){
			player.win++;
			$("#decision").html("You Won!")
		}
	}else if(playerChoice === "paper"){
		if(opponentChoice === "rock"){
			player.win++;
			$("#decision").html("You Won!")
		}else if(opponentChoice === "scissors"){
			player.lose++;
			$("#decision").html("You Lost!")
		}else if(opponentChoice === "paper"){
			player.tie++;	
			$("#decision").html("It's a Tie!")
		}else if(enemyChoice === ""){
			player.win++;
			$("#decision").html("You Won!")
		}
	}else if(playerChoice === "scissors"){
		if(opponentChoice === "paper"){
			player.win++;
			$("#decision").html("You Won!")
		}else if(opponentChoice === "rock"){
			player.lose++;
			$("#decision").html("You Lost!")
		}else if(opponentChoice === "scissors"){
			player.tie++;	
			$("#decision").html("It's a Tie!")
		}else if(enemyChoice === ""){
			player.win++;
			$("#decision").html("You Won!")
		}
	}else if( playerChoice === "" && opponentChoice !== ""){
		player.lose++;
		$("#decision").html("You Lost!")
	}

	// Remove the player choic from firebase
	database.ref(playerDataLocation+"/choice").remove()

	// set new player data on firebase
	database.ref(player.id+"data").set({player:player})
	
	// time = 5;
	// $("#timer").text("Ready!")
	// setTimeout(function(){
	// 	$("#timer").text(time)
	// 	intervalID = setInterval(function(){timer()},1000)
	// },3000)
}


// Open name input modal upon opening the webpage
$(window).on('load',function(){
    $('#myModal').modal('show');
});


//Create player profile
$("#submit").click(function(event){
	event.preventDefault();
	if($(usr).val().trim() === ""){$("#selectName").html("Name cannot be a blank"); return}
	else{$('#myModal').modal('hide');}
	// if there are 2 players, return 
	if(numPlayer == 2){return}

	// check every time the number of player changes
	database.ref().once("value",function(snapshot){

		// if player1data doesnt exists, create one
		if(!snapshot.child("player1data").exists()){
			// grab user name from input
			playerName = $("#usr").val().trim();
			// initializing player data
			player = {
				name: playerName,
				id: "player1"
			}
			// initializing player Score
			resetScore(player)
			// initializing player score on to firebase
			database.ref("player1data").set({
				"player": player,
			})

			// Setting opponent id 
			opponentId = "player2"

			// indexing players data storage location
			opponentDataLocation = "player2data/player"
			playerDataLocation = "player1data/player";
			playerMessageData = "player1data/message"
			opponentMessageData = "player2data/message"
			// Change css of current player
			$("#"+player.id+"Container").css("border","3px dashed green")
			$("#"+player.id+"Name").css("color","green")

			// Remove data upon exit and reset remaining player' score
			database.ref(player.id+"data").onDisconnect().remove(function(){
				gameReady = false;	
			})

			//gather message data
			database.ref(playerMessageData).limitToLast(1).on("child_added",function(DataSnapshot){
				var message = DataSnapshot.child("message").val()
				$("#message-display").append(message)
			},function(errorObject){console.log(errorObject.Code)})

			database.ref(opponentMessageData).limitToLast(1).on("child_added",function(DataSnapshot){
				var message = DataSnapshot.child("message").val()
				$("#message-display").append(message)
			},function(errorObject){console.log(errorObject.Code)})

			//on remove opponent data, reset scores
			database.ref(opponentId+"data").on("child_removed",function(){
				gameReady = false;	
				resetScore(player)
				database.ref("player1data").set({
					"player": player,
				})
				$("#message-display").empty()
			})
		}

		// player1data does exists, create player2data
		if(snapshot.child("player1data").exists()){
			playerName = $("#usr").val().trim();
			player = {
				name: playerName,
				id: "player2"
			}
			resetScore(player);
			database.ref("player2data").set({
				"player": player,
			})

			opponentId = "player1"
			opponentDataLocation = "player1data/player";
			playerDataLocation = "player2data/player";
			playerMessageData = "player2data/message";
			opponentMessageData = "player1data/message"

			// Change css of current player
			$("#"+player.id+"Container").css("border","3px dashed green")
			$("#"+player.id+"Name").css("color","green")

			database.ref(player.id+"data").onDisconnect().remove(function(){
				gameReady = false;
			})

			database.ref(playerMessageData).limitToLast(1).on("child_added",function(DataSnapshot){
				var message = DataSnapshot.child("message").val()
				$("#message-display").append(message)
			},function(errorObject){console.log(errorObject.Code)})

			database.ref(opponentMessageData).limitToLast(1).on("child_added",function(DataSnapshot){
				var message = DataSnapshot.child("message").val()
				$("#message-display").append(message)
			},function(errorObject){console.log(errorObject.Code)})

			database.ref(opponentId+"data").on("child_removed",function(){
				gameReady = false;
				resetScore(player)
				database.ref("player2data").set({
					"player": player,
				})
				$('#matchingModal').modal('show')
				$('#message-display').empty()
			})

		}
	})
})

// Check the number of players
database.ref().on("value",function(snapshot){
	numPlayer = snapshot.numChildren();
	if(gameReady){return}
	// if the number of player is equal to 1 and the player is the first player to enter the game
	// show modal displaying waiting for second player
	if(numPlayer === 1 && player.id === "player1"){
			$("#matchingModal").modal('show')
	}else if (numPlayer === 2){
		// if second player enter, display the original message and close the modal
		// once modal is closed, display the name-input of each player stored in firebase
		gameReady = true;
		$('#matchingModalMessage').html('Player 2 has entered the game!')
		setTimeout(function() {$('#matchingModal').modal('hide')}, 1000);
		setTimeout(function(){			
			$('#matchingModalMessage').html('Invite your friends to the game!')
			$("#"+player.id+"Name").html(player.name)
			database.ref().once("value",function(childSnapshot){
				var name = childSnapshot.child(opponentDataLocation+"/name").val()
				$("#"+opponentId+"Name").html(name)
			})
		// 	$("#timer").text("Ready!")
		// 	setTimeout(function(){$("#timer").text(time)
		// 	intervalID = setInterval(function(){timer()},1000)
		// 	},3000)
		,2000})
	}
})

// click of each box update the choice data of each player onto firebase
$(".choiceBtn").click(function(){
	database.ref(playerDataLocation).update({choice: $(this).attr("data-choice")})
})

// Upon the change of each value
database.ref().on('value',function(ParentSnapshot){
	// grab the choice data of the player and the opponent of each player
	database.ref(playerDataLocation+"/choice").on('value',function(snapshot){
		playerChoice = snapshot.val();
		if(snapshot.val() !== null){
			$("#"+player.id+"-status").html(player.id+" ready")
		}
 		})
	database.ref(opponentDataLocation+"/choice").on('value',function(oppSnapshot){
	opponentChoice = oppSnapshot.val();	
			if(oppSnapshot.val() !== null){
			$("#"+opponentId+"-status").html(opponentId+" ready")
		}
	})

	// if both player chosen a choice, run checkChoices function
	if(ParentSnapshot.child(opponentDataLocation+"/choice").exists() && ParentSnapshot.child(playerDataLocation+"/choice").exists() ){	
		checkChoices(playerChoice,opponentChoice,player)
			
			setTimeout(function(){
				$("#"+player.id+"-status").empty();
				$("#"+opponentId+"-status").empty();
			},1000)

			setTimeout(function(){
				$("#decision").empty();
			},1000)
	}

	// 	setTimeout(function(){
	// 		time = 5;
	// 		$("#timer").text("Ready!")
	// 		setTimeout(function(){intervalID},3000)
	// 		database.ref(playerDataLocation+"/gameReady").remove()
	// 					database.ref(playerDataLocation+"/gameReady").remove()
	// 		database.ref(player.id+"data").set({player:player})
	// 	},1000)

	// Set a timeout to make sure that the checkChoices function ran prior to running updateGame
	if( gameReady === true && !ParentSnapshot.child(opponentDataLocation+"/choice").exists() && !ParentSnapshot.child(playerDataLocation+"/choice").exists()){		
		setTimeout(function(){updateGame(ParentSnapshot)},200);
	}
})


$("#message-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#send").click();
    }
});

$("#send").click(function(){

	var message = $("#message-input").val().trim();
	var messageDiv = {
		message: "<p><b>"+player.name+":</b> "+ message+"</p>",
		timeStamp: firebase.database.ServerValue.TIMESTAMP
		}

	database.ref(playerMessageData).push(messageDiv)
	$("#message-input").val("")

})






