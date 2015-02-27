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

  self.getMonologue = function()
  {


    var WW_EXCLAMATION =
    [
      "Ahaha!",
      "Yeehaw!"
    ];

    var WW_SUPERLATIVE_ADJ = 
    [
      "baddest",
      "raunchiest",
      "dirtiest",
      "cruelest"
    ];

    var WW_NAME_VILLIAN = //Can create a creator for these names as well...
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

    var WW_ADJ_VILLIAN = //Didn't set up a gneralization system that doesn't suck ass so have to label it this...
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

    var WW_ADVERB_DEFEATED_PAST =
    [
      "proudly",
      "wildly",
      "voraciously",
      "adamantly",
      "fundamentally"
    ]

    //return "I love big bananas they are very ripe and tasty yumm yumm.";
    //return randomshit[Math.floor(Math.random()*randomshit.length)];
   

//Make a few templates, randomly populate them with context relevant phrases.
//"Ahaha! Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have proudly defeated the almighty Sheriff of Easton, 
//  I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";


//regex of 
//"WW_EXCLAMATION Now that I, the WW_SUPERLATIVE_ADJ and most WW_ADJ_VILLIAN WW_BANDIT_SYNONYM WW_NAME_VILLIAN, have WW_ADVERB_DEFEATED_PAST and WW_VERB_DEFEATED_PAST the WW_ADJ_HERO WW_NAME_HERO,
// " I will WW_VERB_GATHER my WW_GROUP and we will WW_VERB_RANSACK(remove) the WW_ESTABLISHMENT(remove) and WW_VERB_RANSACK your WW_ESTABLISHMENT for all its worth."

    return (
      rE(WW_EXCLAMATION) +
      " Now that I, the " + 
      rE(WW_SUPERLATIVE_ADJ) +
      " and most " + 
      rE(WW_ADJ_VILLIAN) + " " +
      rE(WW_BANDIT_SYNONYM) + " " +
      rE(WW_NAME_VILLIAN) + 
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
      )

    //return rE(WW_EXCLAMATION) + " Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have unmounted and defeated the almighty Sheriff of Easton, I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";
    
    ////return "Ahaha! Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have unmounted and defeated the almighty Sheriff of Easton, I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";
  }
}

//Make a few templates, randomly populate them with context relevant phrases.
