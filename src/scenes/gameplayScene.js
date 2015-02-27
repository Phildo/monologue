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
  var cough_audio;

  var Monologue = function(scen, str)
  {
    var self = this;

    self.scenario = scen;
    self.text = str;
    self.progress = 0;
    self.disabled = 0;

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
    self.revokeProgress = function()
    {
      self.progress = self.text.substring(0,self.progress).lastIndexOf(" ")+1;
    }

    self.key = function(k)
    {
      if(self.disabled)
      {
        self.scenario.bubb.bumpit();
      }
      else if(k == self.text.substring(self.progress,self.progress+1).toLowerCase())
      {
        self.scenario.bubb.bumpit();
        mermer_audio[Math.floor(Math.random()*mermer_audio.length)].play();
        self.scenario.villain.talk();
        self.progress++;
      }
      else
      {
        cough_audio.play();
        self.scenario.shaker.shake = 10;
        self.disabled = 50;
        self.revokeProgress();
      }
    }

    self.tick = function()
    {
      if(self.disabled > 0) self.disabled--;
    }
  }

  var MonologueFullDisplay = function(scen, mono)
  {
    var self = this;

    self.x = 0;
    self.y = 0+SmallFontPx;

    self.scenario = scen;
    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(SmallFont,stage.drawCanv.canvas.width);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);

    self.draw = function(canv)
    {
      self.scenario.shaker.randomize();
      canv.context.font=SmallFont;

      //Red prompt
      if(self.monologue.disabled) canv.context.fillStyle="#AA0000";
      else                        canv.context.fillStyle="#FF0000";
      for(var i = 0; i < self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+self.scenario.shaker.x,self.y+(SmallFontPx*i)+self.scenario.shaker.y);
        else
        {
          var p;
          if(i == 0) p = self.monologue.progress;
          else       p = self.monologue.progress-self.lineCounts[i-1];
          if(self.lines[i].substring(p,p+1) == " ")
            canv.context.fillText(self.lines[i].substring(0,p)+"_",self.x+self.scenario.shaker.x,self.y+(SmallFontPx*i)+self.scenario.shaker.y);
          else
            canv.context.fillText(self.lines[i].substring(0,p+1),self.x+self.scenario.shaker.x,self.y+(SmallFontPx*i)+self.scenario.shaker.y);
        }
      }

      //Black completed
      if(self.monologue.disabled) canv.context.fillStyle="#444444";
      else                        canv.context.fillStyle="#000000";
      for(var i = 0; i < self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+self.scenario.shaker.x,self.y+(SmallFontPx*i)+self.scenario.shaker.y);
        else
        {
            var p;
            if(i == 0) p = self.monologue.progress;
            else p = self.monologue.progress-self.lineCounts[i-1];
            canv.context.fillText(self.lines[i].substring(0,p),self.x+self.scenario.shaker.x,self.y+(SmallFontPx*i)+self.scenario.shaker.y);
        }
      }
    }
  }

  var MonologueBubbleDisplay = function(scen, mono, x,y,w,h)
  {
    var self = this;

    self.x = x;
    self.y = y+BigFontPx;
    self.w = w;
    self.h = h;

    self.scenario = scen;
    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(BigFont,self.w);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);

    self.draw = function(canv, off)
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
      self.scenario.shaker.randomize();
      canv.context.fillStyle="#999999";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
        canv.context.fillText(self.lines[i],self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);

      //Red prompt
      self.scenario.shaker.randomize();
      if(self.monologue.disabled) canv.context.fillStyle="#AA0000";
      else                        canv.context.fillStyle="#FF0000";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);
        else
        {
          var p;
          if(i == 0) p = self.monologue.progress;
          else       p = self.monologue.progress-self.lineCounts[i-1];
          if(self.lines[i].substring(p,p+1) == " ")
            canv.context.fillText(self.lines[i].substring(0,p)+"_",self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);
          else
            canv.context.fillText(self.lines[i].substring(0,p+1),self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);
        }
      }

      //Black completed
      self.scenario.shaker.randomize();
      if(self.monologue.disabled) canv.context.fillStyle="#444444";
      else                        canv.context.fillStyle="#000000";
      for(var i = lineOn; i < lineOn+lines && i <self.lines.length; i++)
      {
        if(self.monologue.progress >= self.lineCounts[i])
          canv.context.fillText(self.lines[i],self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);
        else
        {
            var p;
            if(i == 0) p = self.monologue.progress;
            else p = self.monologue.progress-self.lineCounts[i-1];
            canv.context.fillText(self.lines[i].substring(0,p),self.x+self.scenario.shaker.x,self.y+(BigFontPx*(i-lineOn))+self.scenario.shaker.y-off);
        }
      }
    }
  }

  var Timer = function(scen)
  {
    var self = this;

    self.scenario = scen;
    self.t = 0;
    self.total = 1000;

    self.tick = function()
    {
      if(self.t < self.total) self.t++;
      else self.t = 0;
    }
  }

  var TimerDisplay = function(scen, timer, x,y,w,h)
  {
    var self = this;

    self.scenario = scen;
    self.t = timer;

    self.x = x;
    self.y = y;
    self.w = w;
    self.h = h;

    self.s = new Shaker();

    self.draw = function(canv, off)
    {
      self.s.shake = 10*((self.t.t/self.t.total)/1);
      self.s.randomize();

      //draw red
      self.scenario.shaker.randomize();
      canv.context.strokeStyle = "#FF0000";
      canv.context.lineWidth = 10;
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.w/2+self.scenario.shaker.x+self.s.x,
      self.y+self.h/2+self.scenario.shaker.y+self.s.y-off,
      (self.w/2)-5,
      3*Math.PI/2,
      (3*(Math.PI/2)+(self.t.t/self.t.total)*(2*Math.PI))%(2*Math.PI)+0.01,
      true);
      canv.context.stroke();

      //draw black
      self.scenario.shaker.randomize();
      canv.context.strokeStyle = "#000000";
      canv.context.lineWidth = 10;
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.w/2+self.scenario.shaker.x,
      self.y+self.h/2+self.scenario.shaker.y-off,
      (self.w/2)-5,
      3*Math.PI/2,
      (3*(Math.PI/2)+(self.t.t/self.t.total)*(2*Math.PI))%(2*Math.PI)+0.01,
      true);
      canv.context.stroke();
    }
  }

  var BubbleDisplay = function(scen, mono, timer)
  {
    var self = this;

    self.x = 200;
    self.y = 200;
    self.w = 520;
    self.h = 115;
    self.bump = 0;

    self.scenario = scen;
    self.monologue = mono;
    self.timer = timer;
    self.mono_disp = new MonologueBubbleDisplay(self.scenario,self.monologue, self.x+(self.h), self.y+10, self.w-(self.h)-BigFontPx, self.h);
    self.timer_disp = new TimerDisplay(self.scenario,self.timer, self.x+10, self.y+10, self.h-20, self.h-20);

    self.bumpit = function()
    {
      self.bump = 5;
    }

    self.tick = function()
    {
      if(self.bump > 0) self.bump--;
    }

    self.draw = function(canv)
    {
      self.scenario.shaker.randomize();
      if(self.monologue.disabled) canv.context.fillStyle = "#BBBBBB";
      else                        canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(self.x+self.scenario.shaker.x, self.y+self.scenario.shaker.y-self.bump, self.w, self.h);
      self.mono_disp.draw(canv, self.bump);
      self.timer_disp.draw(canv, self.bump);
      self.scenario.shaker.randomize();
      canv.context.strokeStyle = "#000000";
      canv.context.lineWidth = 5;
      canv.context.strokeRect(self.x+self.scenario.shaker.x, self.y+self.scenario.shaker.y-self.bump, self.w, self.h);
    }
  }

  var Shaker = function(scen)
  {
    var self = this;

    self.scenario = scen;
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

  var Villain = function(scen)
  {
    var self = this;

    self.scenario = scen;

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
      self.scenario.shaker.randomize();
      canv.context.fillStyle = "#000000";
      var x = self.scenario.shaker.x;
      var y = self.scenario.shaker.y;
      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=20;
      self.scenario.shaker.y*=20;
      canv.context.fillRect(self.x+x-(self.scenario.shaker.x/2),self.y-self.anim+y-(self.scenario.shaker.y/2),self.w+self.scenario.shaker.x,self.h+self.anim+self.scenario.shaker.y);
      self.scenario.shaker.randomize();
    }

    self.tick = function()
    {
      if(self.anim > 0) self.anim--;
    }
  }

  var Hero = function(scen)
  {
    var self = this;

    self.scenario = scen;

    self.x = 220;
    self.y = 500;
    self.w = 200;
    self.h = 80;

    //personal wiggler
    self.s = new Shaker();

    self.draw = function(canv)
    {
      self.s.shake = 10;
      self.s.randomize();
      self.s.shake = self.s.x;
      self.s.randomize();
      self.s.shake = self.s.x;
      self.s.randomize();

      self.s.randomize();
      self.scenario.shaker.randomize();
      canv.context.fillStyle = "#FFFFFF";
      var x = self.scenario.shaker.x;
      var y = self.scenario.shaker.y;
      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=20;
      self.scenario.shaker.y*=20;
      canv.context.fillRect(self.x+x-(self.scenario.shaker.x/2)+self.s.x,self.y+y-(self.scenario.shaker.y/2)+self.s.y,self.w+self.scenario.shaker.x,self.h+self.scenario.shaker.y);

      self.s.randomize();
      self.scenario.shaker.randomize();
      canv.context.strokeStyle = "#000000";
      var x = self.scenario.shaker.x;
      var y = self.scenario.shaker.y;
      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=20;
      self.scenario.shaker.y*=20;
      canv.context.strokeRect(self.x+x-(self.scenario.shaker.x/2)+self.s.x,self.y+y-(self.scenario.shaker.y/2)+self.s.y,self.w+self.scenario.shaker.x,self.h+self.scenario.shaker.y);

      self.scenario.shaker.randomize();
    }
  }

  var Scenario = function()
  {
    var self = this;

    self.mono = new Monologue(self,tgen.getMonologue());
    self.mono_full_disp = new MonologueFullDisplay(self,self.mono);
    self.timer = new Timer(self);
    self.bubb = new BubbleDisplay(self,self.mono,self.timer);
    self.shaker = new Shaker(self);
    self.villain = new Villain(self);
    self.hero = new Hero(self);

    self.begin = function()
    {
      keyer.register(self.mono);
      ticker.register(self.mono);
      drawer.register(self.mono_full_disp);
      drawer.register(self.bubb);
      ticker.register(self.bubb);
      ticker.register(self.timer);
      ticker.register(self.shaker);
      drawer.register(self.villain);
      ticker.register(self.villain);
      drawer.register(self.hero);
    }

    self.end = function()
    {
      keyer.unregister(self.mono);
      ticker.unregister(self.mono);
      drawer.unregister(self.mono_full_disp);
      drawer.unregister(self.bubb);
      ticker.unregister(self.bubb);
      ticker.unregister(self.timer);
      ticker.unregister(self.shaker);
      drawer.unregister(self.villain);
      ticker.unregister(self.villain);
      drawer.unregister(self.hero);
    }
  }

  var scenarios;
  var cur_scen;

  var mono;
  var mono_full_disp;
  var bubb;
  var timer;
  var shaker;
  var villain;
  var hero;

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
    mermer_audio = [];
    for(var i = 0; i < 10; i++)
    {
      mermer_audio.push(new Aud("assets/Talking"+(i+1)+".ogg", false));
      mermer_audio[i].load();
    }
    cough_audio = new Aud("assets/cough.ogg", false);
    cough_audio.load();

    scenarios = [];
    var main = new Scenario();
    scenarios.push(main);

    cur_scen = 0;
    scenarios[cur_scen].begin();
  };

  self.tick = function()
  {
    keyer.flush();
    ticker.flush();
  };

  self.draw = function()
  {
    stage.drawCanv.context.drawImage(assetter.asset("bg.png"),0+scenarios[cur_scen].shaker.x,0+scenarios[cur_scen].shaker.y);
    drawer.flush();
  };

  self.cleanup = function()
  {
  };
};

