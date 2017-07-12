/*
* game.js
*/


module.exports = {
    Player: Player,
    assignRole : assignRole
}

const MIN_PLAYER_SEER = 4;
const ROLE_WEREWOLF =
    {
	identity: "werewolf",
	description: "The day, a peaceful citizen, by night, a big angry wolf hungry for human flesh",
	minPlayer: -1,
	maxPlayer: -1,
    }	       
const ROLE_VILLAGER =
      {
	identity: 'villager',
	description: "A peaceful citizen",
	minPlayer: MIN_PLAYER_SEER,
	maxPlayer: -1
      }

const ROLE_OPTIONAL = [
    {
	identity: "seer",
	description: "a woman with mystic power, can see through the appearance to find wolf among men",
	minPlayer: -1,
	maxPlayer: -1,
	number: 1
    }
]

/**
* Found on stackoverflow https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*
* List<?> shuffle (List<?>)
*
* Shuffle an array with the Fisher-Yate shuffle
*
* @param {List<?>} array the array to be shuffled
*/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/**
 * Player Player(string, string)
 *
 * constructor for the Player type
 *
 * @param {string} id the id of the player, is the id of the socket
 * @param {string} name the name of the player, as defined by the user
 * @return {Player} Player object
 * @side-effect: void
 */
function Player(id, name){
    this.id = id;
    this.name = name;
    this.ready = false;
    this.role = undefined;
}

/**
* number getNumberWerewolves(number)
* 
* Return the number of werewolves needed in a game with n players
*
* @param {number} n number of players
* @return {number} the number of werewolves needed 
*
**/
function getNumberWerewolves(n){
    return (n<12) ? 2 : 3;
}

/**
*
*
*
*/
function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}


/**
* 
*
* call it just assignRole(array)
*/
function assignRole(listPlayer, werewolf=ROLE_WEREWOLF, villager=ROLE_VILLAGER, listRoleOptional=ROLE_OPTIONAL){
    var numberPlayer = listPlayer.length;
    var numberWerewolves = getNumberWerewolves(numberPlayer);
    var optionalChar = numberPlayer - numberWerewolves;
    
    var arrayOptionalRole = [];
    for(var i=0;i<listRoleOptional.length;i++){
	var element = listRoleOptional[i];
	if (optionalChar >= element.number){
	    optionalChar -= element.number;
	}
	optionalRole = fillArray(element, element.number);
    }
    
    var numberVillager = numberPlayer - numberWerewolves;
    var arrayVillager = fillArray(villager, numberVillager);
    var arrayWerewolves = fillArray(werewolf, numberWerewolves);
    var arrayVillagerAndOptional = arrayVillager.concat(arrayOptionalRole);

    arrayVillagerAndOptional = shuffle(arrayVillagerAndOptional).splice(0,numberVillager);
    var arrayWholeVillage = shuffle(arrayVillagerAndOptional.concat(arrayWerewolves));

    for(var k=0;k<numberPlayer;k++){
	listPlayer[k].role = arrayWholeVillage[k];
    }
    console.log(listPlayer);
    return listPlayer;
}


