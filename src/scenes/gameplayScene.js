var GamePlayScene = function(game, stage)
{
  var self = this;

  var BigFontPx = 30;
  var BigFont = BigFontPx+"px vg_font";
  var SmallFontPx = 20;
  var SmallFont = SmallFontPx+"px vg_font";

  var assetter;
  var dbugger; //'debugger' is a keyword... (why.)
  var drawer;
  var ticker;
  var keyer;
  var tgen;
  var bg_audio;
  var mermer_audio;

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
        if(searched == -1) searched = self.text.length;
        tentative_search = self.text.indexOf(" ",searched+1);
        if(tentative_search == -1) tentative_search = self.text.length;
        while(stage.drawCanv.context.measureText(self.text.substring(found,tentative_search)).width < width && searched != self.text.length)
        {
          searched = tentative_search;
          tentative_search = self.text.indexOf(" ",searched+1);
          if(tentative_search == -1) tentative_search = self.text.length;
        }
        if(self.text.substring(searched, searched+1) == " ") searched++;
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
      {
        mermer_audio.play();
        villain.talk();
        self.progress++;
      }
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
      shaker.randomize();
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

  var MonologueBubbleDisplay = function(mono, x,y,w,h)
  {
    var self = this;

    self.x = x;
    self.y = y+BigFontPx;
    self.w = w;
    self.h = h;

    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(BigFont,self.w);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);

    self.draw = function(canv)
    {
      canv.context.font=BigFont;

      var lineOn = 0;
      var lines = 3;
      for(var i = 0; i < self.lines.length; i++)
      {
        if(i != 0 && self.monologue.progress > self.lineCounts[i-1])
          lineOn = i;
      }

      if(lineOn > 0) lineOn--;

      //Gray background
      shaker.randomize();
      canv.context.fillStyle="#999999";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
        canv.context.fillText(self.lines[i],self.x+shaker.x,self.y+(BigFontPx*(i-lineOn))+shaker.y);

      //Red prompt
      shaker.randomize();
      canv.context.fillStyle="#FF0000";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
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
      shaker.randomize();
      canv.context.fillStyle="#000000";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
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

    self.tick = function()
    {
      if(self.t < self.total) self.t++;
      else self.t = 0;
    }
  }

  var TimerDisplay = function(timer, x,y,w,h)
  {
    var self = this;
    self.t = timer;

    self.x = x;
    self.y = y;
    self.w = w;
    self.h = h;

    self.draw = function(canv)
    {
      //draw red
      shaker.randomize();
      canv.context.strokeStyle = "#FF0000";
      canv.context.lineWidth = 10;
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.w/2+shaker.x,
      self.y+self.h/2+shaker.y,
      (self.w/2)-5,
      3*Math.PI/2,
      (3*(Math.PI/2)+(self.t.t/self.t.total)*(2*Math.PI))%(2*Math.PI)+0.01,
      true);
      canv.context.stroke();

      //draw black
      shaker.randomize();
      canv.context.strokeStyle = "#000000";
      canv.context.lineWidth = 10;
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.w/2+shaker.x,
      self.y+self.h/2+shaker.y,
      (self.w/2)-5,
      3*Math.PI/2,
      (3*(Math.PI/2)+(self.t.t/self.t.total)*(2*Math.PI))%(2*Math.PI)+0.01,
      true);
      canv.context.stroke();
    }
  }

  var BubbleDisplay = function(mono, timer)
  {
    var self = this;

    self.x = 200;
    self.y = 200;
    self.w = 520;
    self.h = 115;

    self.monologue = mono;
    self.timer = timer;
    self.mono_disp = new MonologueBubbleDisplay(self.monologue, self.x+(self.h), self.y+10, self.w-(self.h)-BigFontPx, self.h);
    self.timer_disp = new TimerDisplay(self.timer, self.x+10, self.y+10, self.h-20, self.h-20);

    self.draw = function(canv)
    {
      shaker.randomize();
      canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(self.x+shaker.x, self.y+shaker.y, self.w, self.h);
      self.mono_disp.draw(canv);
      self.timer_disp.draw(canv);
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
      self.randomize();
    }
    self.randomize = function()
    {
      self.x = (Math.random()*self.shake*2)-self.shake;
      self.y = (Math.random()*self.shake*2)-self.shake;
    }
  }

  var Villain = function()
  {
    var self = this;

    self.x = 700;
    self.y = 300;
    self.w = 100;
    self.h = 300;

    self.anim = 0;

    self.talk = function()
    {
      if(self.anim == 0) self.anim = 10;
    }

    self.draw = function(canv)
    {
      shaker.randomize();
      canv.context.fillStyle = "#000000";
      var x = shaker.x;
      var y = shaker.y;
      shaker.randomize();
      shaker.x*=20;
      shaker.y*=20;
      canv.context.fillRect(self.x+x-(shaker.x/2),self.y-self.anim+y-(shaker.y/2),self.w+shaker.x,self.h+self.anim+shaker.y);
      shaker.randomize();
    }

    self.tick = function()
    {
      if(self.anim > 0) self.anim--;
    }
  }

  var mono;
  var mono_full_disp;
  var bubb;
  var timer;
  var shaker;
  var villain;

  self.ready = function()
  {
    assetter = new Assetter({});
    dbugger = new Debugger({source:document.getElementById("debug_div")});
    ticker = new Ticker({});
    drawer = new Drawer({source:stage.drawCanv});
    keyer = new Keyer({source:stage.dispCanv.canvas});
    tgen = new TextGen();
    bg_audio = new Aud("assets/AllTiedUp.ogg", true);
    bg_audio.load();
    bg_audio.play();
    mermer_audio = new Aud("assets/merrmerr.m4a", false);
    mermer_audio.load();

    mono = new Monologue(tgen.getMonologue());
    mono_full_disp = new MonologueFullDisplay(mono);
    timer = new Timer();
    bubb = new BubbleDisplay(mono,timer);
    shaker = new Shaker();
    villain = new Villain();

    keyer.register(mono);
    drawer.register(mono_full_disp);
    drawer.register(bubb);
    ticker.register(timer);
    ticker.register(shaker);
    drawer.register(villain);
    ticker.register(villain);
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

