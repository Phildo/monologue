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

    //partitioned strings 
    self.fullWidthLines = []; 

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

  var Timer = function()
  {
    var self = this;

    self.t = 0;
    self.total = 1000;

    self.x = 200;
    self.y = 200;
    self.w = 200;
    self.h = 200;

    self.draw = function(canv)
    {
      canv.context.strokeStyle = "#00FFFF";
      canv.context.lineWidth = 5;
      canv.context.beginPath();
      canv.context.arc(
      self.w/2,
      self.h/2,
      (self.w/2)-5,
      3*Math.PI/2,
      (3*(Math.PI/2)+(self.t/self.total)*(2*Math.PI))%(2*Math.PI)+0.01,
      true);
      canv.context.stroke();
    }

    self.tick = function()
    {
      if(self.t < self.total) self.t++;
      else self.t = 0;
    }
  }

  var mono;
  var mono_disp;
  var timer;

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
    timer = new Timer();

    keyer.register(mono);
    drawer.register(mono_disp);
    drawer.register(timer);
    ticker.register(timer);
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

