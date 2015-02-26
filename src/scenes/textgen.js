var TextGen = function()
{
  var self = this;


  var randomshit = 
  [
    "random monologue 1",
    "random monologue 2"
  ];
  self.getMonologue = function()
  {
    //return "I love big bananas they are very ripe and tasty yumm yumm.";
    return randomshit[Math.floor(Math.random()*randomshit.length)];
  }
}

