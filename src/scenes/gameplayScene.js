var GamePlayScene = function(game, stage)
{
  var self = this;

  var BigFontPx = 20;
  var BigFont = BigFontPx+"px Courrier";
  var SmallFontPx = 30;
  var SmallFont = SmallFontPx+"px Courrier";

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

    self.splitTextIntoLines = function(str, font, width)
    {
      var lines = [];
      var found = 0;
      var searched = 0;
      var tentative_search = 0;

      stage.drawCanv.context.font=font;
      while(found < str.length)
      {
        searched = str.indexOf(" ",found);
        tentative_search = str.indexOf(" ",searched+1);
        if(tentative_search == -1) tentative_search = str.length;
        while(stage.drawCanv.context.measureText(str.substring(found,tentative_search)).width < width && searched != tentative_search)
        {
          searched = tentative_search;
          tentative_search = str.indexOf(" ",searched+1);
          if(tentative_search == -1) tentative_search = str.length;
        }
        lines.push(str.substring(found,searched));
        found = searched;
      }

      return lines;
    }
    self.getCountsForLines = function(lines)
    {
      var counts = [];
      for(var i = 0; i < lines.length; i++)
      {
        if(i == 0) counts[i] = lines[i].length;
        else       counts[i] = lines[i].length+counts[i-1];
      }
      return counts;
    }

    self.fullWidthLines = self.splitTextIntoLines(self.text,BigFont,stage.drawCanv.canvas.width);
    self.fullWidthLineCounts = self.getCountsForLines(self.fullWidthLines);

    self.key = function(k)
    {
      if(k == self.text.substring(self.progress,self.progress+1).toLowerCase())
        self.progress++;
    }
  }

  var MonologueDisplay = function(mono)
  {
    var self = this;

    self.x = 0;
    self.y = 0+BigFontPx;

    self.monologue = mono;
    self.draw = function(canv)
    {
      canv.context.font=BigFont;

      //Gray background
      canv.context.fillStyle="#999999";
      for(var i = 0; i < self.monologue.fullWidthLines.length; i++)
        canv.context.fillText(self.monologue.fullWidthLines[i],self.x,self.y+(BigFontPx*i));

      //Red prompt
      canv.context.fillStyle="#FF0000";
      for(var i = 0; i < self.monologue.fullWidthLines.length; i++)
      {
        if(self.monologue.progress >= self.monologue.fullWidthLineCounts[i])
          canv.context.fillText(self.monologue.fullWidthLines[i],self.x,self.y+(BigFontPx*i));
        else
        {
          var p;
          if(i == 0) p = self.monologue.progress;
          else       p = self.monologue.progress-self.monologue.fullWidthLineCounts[i-1];
          if(self.monologue.fullWidthLines[i].substring(p,p+1) == " ")
            canv.context.fillText(self.monologue.fullWidthLines[i].substring(0,p)+"_",self.x,self.y+(BigFontPx*i));
          else
            canv.context.fillText(self.monologue.fullWidthLines[i].substring(0,p+1),self.x,self.y+(BigFontPx*i));
        }
      }

      //Black completed
      canv.context.fillStyle="#000000";
      for(var i = 0; i < self.monologue.fullWidthLines.length; i++)
      {
        if(self.monologue.progress >= self.monologue.fullWidthLineCounts[i])
          canv.context.fillText(self.monologue.fullWidthLines[i],self.x,self.y+(BigFontPx*i));
        else
        {
            var p;
            if(i == 0) p = self.monologue.progress;
            else p = self.monologue.progress-self.monologue.fullWidthLineCounts[i-1];
            canv.context.fillText(self.monologue.fullWidthLines[i].substring(0,p),self.x,self.y+(BigFontPx*i));
        }
      }
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

