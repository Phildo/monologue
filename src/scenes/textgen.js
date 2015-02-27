var TextGen = function()
{
  var self = this;

//dastardly (deed)
//desperado

  var rE = function(arr)
  {
    return arr[Math.floor(Math.random()*arr.length)];
  }

  var removeAndReturnE = function(arr)
  {
    var index = Math.floor(Math.random()*arr.length);
    var word = arr[index];
    arr.splice(index, 1); //don't think this is same as python :3 //splice at index by offset of 1.
    return word;
  }


    var WW_EXCLAMATION =
    [
      "Ahaha!",
      "Yeehaw!",
      "Howdy partner!",
      "Finally!",
      "At last!"
    ];

    var WW_SUPERLATIVE_ADJ = 
    [
      "baddest",
      "raunchiest",
      "dirtiest",
      "cruelest"
    ];

    var WW_NAME_VILLAIN = //Can create a creator for these names as well...
    [
      "William Todd Marsh",
      "Todd Marsh Williams",
      "James T. Rustle",
      "Joseph James Cunningham",
      "Richard D. James", //lelenny
    ];

    var WW_NAME_HERO = //Can create a creator for these names as well...
    [
      "Sheriff of Easton",
      "Westwood Sheriff",
      "Amarillo Deputy Riccardo",
      "Vigilante of El Paso"
    ];

    var WW_ESTABLISHMENT = 
    [
      "bank",
      "general store",
      "saloon"
    ];

    var WW_BANDIT_SYNONYM = 
    [
      "bandito",
      "badass",
      "bandit",
      "train robber",
      "bank robber",
      "cowboy"
    ];

    var WW_ADJ_VILLAIN = //Didn't set up a gneralization system that doesn't suck ass so have to label it this...
    [
      "rootin-tootin",
      "crazy",
      "irratic",
      "psychotic",
      "feared"
    ];

    var WW_VERB_DEFEATED_PAST =
    [
      "unmounted", //kek
      "defeated",
      "conquered",
      "beat",
      "foiled"
    ];

    var WW_GROUP = 
    [
      "posse",
      "gang",
      "band of thugs",
      "group"
    ];

    var WW_ADJ_HERO =
    [
      "benevolent",
      "almighty", 
      "precious",
      "worshipped"
    ];

    var WW_VERB_RANSACK = 
    [
      "rob",
      "ransack",
      "plunder",
      "clean out"
    ];

    var WW_VERB_GATHER = 
    [
      "summon",
      "gather",
      "wrangle up",
      "call",
    ];

    var WW_VERB_BUNDLE_PAST = 
    [
      "bundled up",
      "wrangled up"
    ];

    var WW_ADVERB_DEFEATED_PAST =
    [
      "proudly",
      "wildly",
      "voraciously",
      "adamantly",
      "fundamentally"
    ];

    var WW_VERB_CRUSH_PAST =
    [
      "crushed",
      "obliterated",
      "squashed",
      "squished",
      "compressed"
    ];

    var WW_ADJ_LITTLE = 
    [
      "little",
      "teeny",
      "tiny",
      "small little"
    ];

    var WW_CHICKEN_GIZZARDS =
    [
      "chicken gizzards",
      "human giblets",
      "man pieces"
    ];

    var WW_PLACE = 
    [
      "county",
      "country",
      "state",
      "southwest",
      "region",
      "town"
    ];

  self.getMonologue = function()
  {




    //return randomshit[Math.floor(Math.random()*randomshit.length)];
   

    return getWWP2();
    //return getWWP1();
}

  var getWWP1 = function()
  {
    //Make a few templates, randomly populate them with context relevant phrases.
    //"Ahaha! Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have proudly defeated the almighty Sheriff of Easton, 
    //  I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";
    //regex of 
    //"WW_EXCLAMATION Now that I, the WW_SUPERLATIVE_ADJ and most WW_ADJ_VILLAIN WW_BANDIT_SYNONYM WW_NAME_villain, have WW_ADVERB_DEFEATED_PAST and WW_VERB_DEFEATED_PAST the WW_ADJ_HERO WW_NAME_HERO,
    // " I will WW_VERB_GATHER my WW_GROUP and we will WW_VERB_RANSACK(remove) the WW_ESTABLISHMENT(remove) and WW_VERB_RANSACK your WW_ESTABLISHMENT for all its worth."


    return (
      rE(WW_EXCLAMATION) +
      " Now that I, the " + 
      rE(WW_SUPERLATIVE_ADJ) +
      " and most " + 
      rE(WW_ADJ_VILLAIN) + " " +
      rE(WW_BANDIT_SYNONYM) + " " +
      rE(WW_NAME_VILLAIN) + 
      ", have " + 
      rE(WW_ADVERB_DEFEATED_PAST) + " " +
      rE(WW_VERB_DEFEATED_PAST) +
      " the " + 
      rE(WW_ADJ_HERO) + " " +
      rE(WW_NAME_HERO) +
      ", I will " + 
      rE(WW_VERB_GATHER) +
      " my " + 
       rE(WW_GROUP) +
      " and we will " + 
      removeAndReturnE(WW_VERB_RANSACK) +
      " the " + 
      removeAndReturnE(WW_ESTABLISHMENT) +
      " and " + 
      rE(WW_VERB_RANSACK) +
      " your " + 
      rE(WW_ESTABLISHMENT) +
      " for all its worth!"
      );
  }

  var getWWP2 = function()
  {

    //"Finally! I have wrangled up and tied the Sheriff for all of his good deeds. Soon he will be crushed and turned into little chicken gizzards, and the whole"
    //" country will know and remember the name of the baddest and most crazy bandit WW_NAME_VILLAIN. ".
    //regex of
    //"WW_EXCLAMATION I have WW_VERB_BUNDLE_PAST and tied the WW_NAME_HERO for all of his good deeds. Soon he will be WW_VERB_CRUSH_PAST and turned into WW_ADJ_LITTLE WW_CHICKEN_GIZZARDS, and the whole"
    //" WW_PLACE will know and remember the name of the WW_SUPERLATIVE_ADJ and most WW_ADJ_VILLAIN WW_BANDIT_SYNONYM WW_NAME_VILLAIN."

    return (
      rE(WW_EXCLAMATION) + 
      " I have " + 
      rE(WW_VERB_BUNDLE_PAST) + 
      " and tied the " + 
      rE(WW_NAME_HERO) + 
      " for all of his good deeds. " + //parse out good
      "Soon he will be " + 
      rE(WW_VERB_CRUSH_PAST) + 
      " and turned into " + 
      rE(WW_ADJ_LITTLE) + " " +
      //" I have " + 
      rE(WW_CHICKEN_GIZZARDS) + 
      ", and the whole " + 
      rE(WW_PLACE) + 
      " will know and remember the name of the " + 
      rE(WW_SUPERLATIVE_ADJ) + 
      " and most " + 
      rE(WW_ADJ_VILLAIN) +  " " +
      //" I have " + 
      rE(WW_BANDIT_SYNONYM) + " " +
      //" I have " + 
      rE(WW_NAME_VILLAIN) + 
      "!"
      );

  }


}


//test shite
var a = new TextGen(); //
document.write(a.getMonologue());



//Make a few templates, randomly populate them with context relevant phrases.




//"Ahaha! Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have proudly defeated the almighty Sheriff of Easton, 
//  I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";



//"Finally! I have wrangled up and tied the Sheriff for all of his good deeds. Soon he will be crushed and turned into chicken gizzards, and the whole"
//" country will know and remember the name of the baddest and most crazy bandit WW_NAME_VILLAIN. ".



//"Alright listen up you yellow belly. You've roamed these streets for too long Sherrif. After my group robs your store and robs your store, the whole country"
//" will be aware of the most crazy bandit this side of the mis river. The names WW_NAME_VILLAIN. Farewell."



