var GamePlayScene = function(game, stage)
{
  var self = this;

  var assetter;
  var dbugger; //'debugger' is a keyword... (why.)
  var drawer;
  var ticker;
  var keyer;
  var tgen;

  var Monologue = function(str)
  {
    var self = this;
    self.text = str;
    self.progress = 0;

    self.key = function(k)
    {
      if(k == self.text.substring(self.progress,self.progress+1).toLowerCase())
        self.progress++;
    }
  }

  var MonologueDisplay = function(mono)
  {
    var self = this;

    self.x = 50;
    self.y = 50;

    self.monologue = mono;
    self.draw = function(canv)
    {
      canv.context.font="30px Courrier";
      canv.context.fillStyle="#999999";
      canv.context.fillText(self.monologue.text,self.x,self.y);
      canv.context.fillStyle="#FF0000";
      if(self.monologue.text.substring(self.monologue.progress,self.monologue.progress+1) == " ")
        canv.context.fillText(self.monologue.text.substring(0,self.monologue.progress)+"_",self.x,self.y);
      else
        canv.context.fillText(self.monologue.text.substring(0,self.monologue.progress+1),self.x,self.y);
      canv.context.fillStyle="#000000";
      canv.context.fillText(self.monologue.text.substring(0,self.monologue.progress),self.x,self.y);
    }
  }

  var mono;
  var mono_disp;

  self.ready = function()
  {
    assetter = new Assetter({});
    dbugger = new Debugger({source:document.getElementById("debug_div")});
    ticker = new Ticker({});
    drawer = new Drawer({source:stage.drawCanv});
    keyer = new Keyer({source:stage.dispCanv.canvas});
    tgen = new TextGen();

    mono = new Monologue(tgen.getMonologue());
    mono_disp = new MonologueDisplay(mono);

    keyer.register(mono);
    drawer.register(mono_disp);
  };

  self.tick = function()
  {
    keyer.flush();
    ticker.flush();
  };

  self.draw = function()
  {
    drawer.flush();
  };

  self.cleanup = function()
  {
  };

};

