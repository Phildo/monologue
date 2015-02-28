var StartScene = function(game, stage)
{
  var self = this;

  var PlayButton = function()
  {
    var self = this;
    var toggleTextColor = true;
    var tickCount = 0;

    var progressString = "play";
    var progressInt = 0; //this is the progress of the string in terms of index.

    self.draw = function(canv)
    {
      //NOTE: canv.canvas.width/.height to access those


      //story box
      canv.context.fillStyle = "#000000";
      canv.context.fillRect(75, 50, 750, 450); //x, y, width, eight
      canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(85, 60, 730, 430); //x, y, width, eight


      canv.context.fillStyle = "#000000";
      canv.context.font = "24px vg_font";
      canv.context.fillText(" You are the baddest villain", 100, 204);//str, x, y
      canv.context.fillText("         in the west.", 100, 228);//str, x, y   //topkek -> #hackcity dawg


      canv.context.fillStyle = "#000000";
      canv.context.font = "24px vg_font";
      canv.context.fillText(" Again, you have caught your", 100, 252+24);//str, x, y
      canv.context.fillText("         archnemesis.", 100, 276+24);//str, x, y


      canv.context.fillStyle = "#000000";
      canv.context.font = "24px vg_font";
      canv.context.fillText(" Deliver the final monologue", 100, 300+48);//str, x, y
      canv.context.fillText("      before they escape!", 100, 324+48);//str, x, y


      canv.context.fillStyle = "#FF1F0A";
      canv.context.font = "24px vg_font";
      canv.context.fillText("      Type to start...", 100, 348+96);//str, x, y




      //textbox
      canv.context.fillStyle = "#000000";
      canv.context.fillRect(140, 450, 620, 200); //x, y, width, eight
      canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(150, 460, 600, 180); //x, y, width, eight




      //boxbehindtopreventborderconflict
      canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(75, 65, 750, 96); //x, y, width, eight
      //title text
      canv.context.fillStyle = "#000000";
      canv.context.font = "96px vg_font";
      canv.context.fillText("Monologue", 10, 154);//str, x, y



      if(shouldTransition)
      {
        canv.context.font = "144px vg_font";
        canv.context.fillStyle = "#000000";
        canv.context.fillText("play", 154, 615);
      }
      else
      {
        //play text
        canv.context.font = "144px vg_font";
        canv.context.fillStyle = "#999999";
        canv.context.fillText("play", 154, 615);

        if(toggleTextColor)
        {
          canv.context.fillStyle = "#FF0000";       
        }
        else
        {
          canv.context.fillStyle = "#999999";
        }
        canv.context.fillText(progressString.substring(0,progressInt+1), 154, 615);

        canv.context.fillStyle = "#000000";
        canv.context.fillText(progressString.substring(0,progressInt), 154, 615);
      }
    }


    //by saying self = this, we can explicitly make sure that self refers to this object
    self.key = function(k)
    {

      if(k == progressString[progressInt])
      {
        progressInt++;
        tickCount = 0;
        toggleTextColor = true;
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
        shouldTransition = true;
        // game.nextScene();
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


  var shouldTransition = false;
  var basedAlphaTrainsition = 0.0;

  self.tick = function()
  {

    self.keyer.flush();
    self.ticker.flush();

    if(basedAlphaTrainsition >= 1.1)
    {
      game.nextScene();
    }

  };

  self.draw = function()
  {
    self.drawer.flush();

    if(shouldTransition)
    {
      var canv = stage.drawCanv;
      canv.context.fillStyle = "rgba(0,0,0,"+basedAlphaTrainsition+")";
      canv.context.fillRect(0,0,canv.canvas.width,canv.canvas.height);
      basedAlphaTrainsition += .01;
    }
  };

  self.cleanup = function()
  {

  };
};
