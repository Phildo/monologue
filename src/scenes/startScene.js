var StartScene = function(game, stage)
{
  var self = this;

  var PlayButton = function()
  {
    var self = this;
    var toggleTextColor = false;
    var tickCount = 0;

    var progressString = "play";
    var progressInt = 0; //this is the progress of the string in terms of index.

    self.draw = function(canv)
    {
      //NOTE: canv.canvas.width/.height to access those



      //back
      canv.context.fillStyle = "#000000";
      canv.context.fillRect(140, 200, 620, 200); //x, y, width, eight

      canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(150, 210, 600, 180); //x, y, width, eight

          canv.context.fillStyle = "#999999";
          canv.context.font = "144px vg_font";
          canv.context.fillText("play", 154, 365);

        if(toggleTextColor)
        {
          canv.context.fillStyle = "#FF0000";       
        }
        else
        {
          canv.context.fillStyle = "#999999";
        }
        canv.context.font = "144px vg_font";
        canv.context.fillText(progressString.substring(0,progressInt+1), 154, 365);

        canv.context.fillStyle = "#000000";
        canv.context.font = "144px vg_font";
        canv.context.fillText(progressString.substring(0,progressInt), 154, 365);


      if(progressInt <= progressString.length)
      {
        for(var i = 0; i < progressString.length; i++)
        {
          if(i == progressInt)
          {

            if(toggleTextColor)
            {
              canv.context.fillStyle = "#FF0000";
            }
            else
            {
              canv.context.fillStyle = "#999999"
            }

          }
        }
      }

    }
    //by saying self = this, we can explicitly make sure that self refers to this object
    self.key = function(k)
    {

      if(k == progressString[progressInt])
      {
        progressInt++;
      }
      else
      {
        progressInt = 0;
      }

    }

    self.tick = function()
    {
      tickCount++;
      //console.log(tickCount);
      if(tickCount % 30 == 0)
      {
        //console.log(tickCount);
        toggleTextColor = !toggleTextColor;
      }
      if(progressInt >= 4)
      {
        game.nextScene();
      }
    }
  }

  self.ready = function()
  {
    self.keyer = new Keyer({});//Phil being dumb. js_hacks.js
    self.playButton = new PlayButton();
    self.keyer.register(self.playButton);

    self.drawer = new Drawer({source:stage.drawCanv});
    self.drawer.register(self.playButton);

    self.ticker = new Ticker({});
    self.ticker.register(self.playButton);
  };

  self.tick = function()
  {

//game.nextScene();
    self.keyer.flush();
    self.ticker.flush();
  };

  self.draw = function()
  {
    self.drawer.flush();
  };

  self.cleanup = function()
  {

  };
};
