var GamePlayScene = function(game, stage)
{
  var self = this;

  var BigFontPx = 20;
  var BigFont = BigFontPx+"px vg_font";
  var SmallFontPx = 12;
  var SmallFont = SmallFontPx+"px vg_font";

  var assetter;
  var dbugger; //'debugger' is a keyword... (why.)
  var drawer;
  var ticker;
  var keyer;
  var tgen;
  var audio;

  var Monologue = function(str)
  {
    var self = this;
    self.text = str;
    self.progress = 0;

    self.splitTextIntoLines = function(font, width)
    {
      var lines = [];
      var found = 0;
      var searched = 0;
      var tentative_search = 0;

      stage.drawCanv.context.font=font;
      while(found < self.text.length)
      {
        searched = self.text.indexOf(" ",found);
        tentative_search = self.text.indexOf(" ",searched+1);
        if(tentative_search == -1) tentative_search = self.text.length;
        searched = tentative_search; //guarantee at least one word
        while(stage.drawCanv.context.measureText(self.text.substring(found,tentative_search)).width < width && searched != self.text.length)
        {
          searched = tentative_search;
          tentative_search = self.text.indexOf(" ",searched+1);
          if(tentative_search == -1) tentative_search = self.text.length;
        }
        lines.push(self.text.substring(found,searched));
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

    self.key = function(k)
    {
      if(k == self.text.substring(self.progress,self.progress+1).toLowerCase())
        self.progress++;
      else shaker.shake = 10;
    }
  }

  var MonologueFullDisplay = function(mono)
  {
    var self = this;

    self.x = 0;
    self.y = 0+SmallFontPx;

    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(SmallFont,stage.drawCanv.canvas.width);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);

    self.draw = function(canv)
    {
      canv.context.font=SmallFont;

      //Red prompt
      canv.context.fillStyle="#FF0000";
      for(var i = 0; i < self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(SmallFontPx*i)+shaker.y);
        else
        {
          var p;
          if(i == 0) p = self.monologue.progress;
          else       p = self.monologue.progress-self.lineCounts[i-1];
          if(self.lines[i].substring(p,p+1) == " ")
            canv.context.fillText(self.lines[i].substring(0,p)+"_",self.x+shaker.x,self.y+(SmallFontPx*i)+shaker.y);
          else
            canv.context.fillText(self.lines[i].substring(0,p+1),self.x+shaker.x,self.y+(SmallFontPx*i)+shaker.y);
        }
      }

      //Black completed
      canv.context.fillStyle="#000000";
      for(var i = 0; i < self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(SmallFontPx*i)+shaker.y);
        else
        {
            var p;
            if(i == 0) p = self.monologue.progress;
            else p = self.monologue.progress-self.lineCounts[i-1];
            canv.context.fillText(self.lines[i].substring(0,p),self.x+shaker.x,self.y+(SmallFontPx*i)+shaker.y);
        }
      }
    }
  }

  var MonologueBubbleDisplay = function(mono)
  {
    var self = this;

    self.x = 100;
    self.y = 100+BigFontPx;
    self.w = 400;
    self.h = 100;

    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(BigFont,self.w);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);

    self.draw = function(canv)
    {
      canv.context.font=BigFont;

      var lineOn = 0;
      for(var i = 0; i < self.lines.length; i++)
      {
        if(i != 0 && self.monologue.progress > self.lineCounts[i-1])
          lineOn = i;
      }

      //Gray background
      canv.context.fillStyle="#999999";
      for(var i = lineOn; i < lineOn+2 && i <self.lines.length; i++)
        canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);

      //Red prompt
      canv.context.fillStyle="#FF0000";
      for(var i = lineOn; i < lineOn+2 && i <self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);
        else
        {
          var p;
          if(i == 0) p = self.monologue.progress;
          else       p = self.monologue.progress-self.lineCounts[i-1];
          if(self.lines[i].substring(p,p+1) == " ")
            canv.context.fillText(self.lines[i].substring(0,p)+"_",self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);
          else
            canv.context.fillText(self.lines[i].substring(0,p+1),self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);
        }
      }

      //Black completed
      canv.context.fillStyle="#000000";
      for(var i = lineOn; i < lineOn+2 && i <self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);
        else
        {
            var p;
            if(i == 0) p = self.monologue.progress;
            else p = self.monologue.progress-self.lineCounts[i-1];
            canv.context.fillText(self.lines[i].substring(0,p),self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);
        }
      }
    }
  }


  var Timer = function()
  {
    var self = this;

    self.t = 0;
    self.total = 1000;

    self.x = 50;
    self.y = 100;
    self.w = 50;
    self.h = 50;

    self.draw = function(canv)
    {
      canv.context.strokeStyle = "#00FFFF";
      canv.context.lineWidth = 5;
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.w/2+shaker.x,
      self.y+self.h/2+shaker.y,
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

  var Shaker = function()
  {
    var self = this;

    self.shake = 0;

    self.x = 0;
    self.y = 0;

    self.tick = function()
    {
      if(self.shake > 0) self.shake -= 1;
      self.x = (Math.random()*self.shake*2)-self.shake;
      self.y = (Math.random()*self.shake*2)-self.shake;
    }
  }

  var mono;
  var mono_full_disp;
  var mono_bubb_disp;
  var timer;
  var shaker;

  self.ready = function()
  {
    assetter = new Assetter({});
    dbugger = new Debugger({source:document.getElementById("debug_div")});
    ticker = new Ticker({});
    drawer = new Drawer({source:stage.drawCanv});
    keyer = new Keyer({source:stage.dispCanv.canvas});
    tgen = new TextGen();
    audio = new Aud("assets/AllTiedUp.ogg");
    audio.load();
    //audio.play();

    mono = new Monologue(tgen.getMonologue());
    mono_full_disp = new MonologueFullDisplay(mono);
    mono_bubb_disp = new MonologueBubbleDisplay(mono);
    timer = new Timer();
    shaker = new Shaker();

    keyer.register(mono);
    drawer.register(mono_full_disp);
    drawer.register(mono_bubb_disp);
    drawer.register(timer);
    ticker.register(timer);
    ticker.register(shaker);
  };

  self.tick = function()
  {
    keyer.flush();
    ticker.flush();
  };

  self.draw = function()
  {
    stage.drawCanv.context.drawImage(assetter.asset("bg.png"),0+shaker.x,0+shaker.y);
    drawer.flush();
  };

  self.cleanup = function()
  {
  };

};

