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
    //return randomshit[Math.floor(Math.random()*randomshit.length)];
    return "Ahaha! Now that I, the baddest and most rootin-tootin bandito William Todd Marsh, have unmounted and defeated the almighty Sheriff of Easton, I will gather my rowdy gang and we will ransack the general goods store and rob your bank for all its worth.";
  }
}

var a = new TextGen(); //

document.write(a.getMonologue());