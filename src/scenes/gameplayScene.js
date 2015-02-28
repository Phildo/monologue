var GamePlayScene = function(game, stage)
{
  var self = this;
  var scene = self;

  var BigFontPx = 30;
  var BigFont = BigFontPx+"px vg_font";
  var SmallFontPx = 20;
  var SmallFont = SmallFontPx+"px vg_font";

  var assetter;
  var dbugger; //'debugger' is a keyword... (why.)
  var drawer;
  var particler;
  var ticker;
  var keyer;
  var tgen;
  var bg_audio;
  var mermer_audio;
  var cough_audio;
  var train_audio;
  var boing_audio;
  var scream_audio;

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
      self.progress = self.text.substring(0,self.progress+1).lastIndexOf(" ")+1;
    }

    self.key = function(k)
    {
      if(self.disabled)
      {
        self.scenario.bubb.bumpit();
      }
      else if(self.progress == self.text.length)
      {
        //i don't know...
      }
      else if(k == self.text.substring(self.progress,self.progress+1).toLowerCase())
      {
        if(self.scenario.timer) self.scenario.timer.start();
        self.scenario.bubb.bumpit();
        mermer_audio[Math.floor(Math.random()*mermer_audio.length)].play();
        self.scenario.villain.talk();
        self.progress++;
      }
      else
      {
        cough_audio[Math.floor(Math.random()*cough_audio.length)].play();
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
      /*
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
      */

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

    self.t = 0;

    self.scenario = scen;
    self.monologue = mono;
    self.lines = self.monologue.splitTextIntoLines(BigFont,self.w);
    self.lineCounts = self.monologue.getCountsForLines(self.lines);
    self.lastKnownProgress = 0;

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
      if(self.lastKnownProgress != self.monologue.progress) self.t = 20;
      self.lastKnownProgress = self.monologue.progress;
      if(self.monologue.disabled)      canv.context.fillStyle="#AA0000";
      else if(Math.round(self.t/20)%2) canv.context.fillStyle="#FF0000";
      else                             canv.context.fillStyle="#999999";
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

    self.tick = function()
    {
      self.t++;
    }
  }

  var Timer = function(scen)
  {
    var self = this;

    self.scenario = scen;
    self.t = 0;
    self.total = 2500;

    self.started = false;

    self.start = function()
    {
      self.started = true;
    }
    self.tick = function()
    {
      if(self.started && self.t < self.total) self.t++;
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
      canv.context.lineWidth = 40;
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
      if(Math.floor(self.t.t/30)%2) canv.context.strokeStyle = "#666666";
      else                          canv.context.strokeStyle = "#000000";
      canv.context.lineWidth = 40;
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

    self.x = 250;
    self.y = 200;
    self.w = 520;
    self.h = 115;
    self.bump = 0;

    self.scenario = scen;
    self.monologue = mono;
    self.timer = timer;
    self.mono_disp = new MonologueBubbleDisplay(self.scenario,self.monologue, self.x+(self.h), self.y+10, self.w-(self.h)-BigFontPx, self.h);
    self.timer_disp = new TimerDisplay(self.scenario,self.timer, self.x+20, self.y+20, self.h-40, self.h-40);

    self.bumpit = function()
    {
      self.bump = 5;
    }

    self.tick = function()
    {
      if(self.bump > 0) self.bump--;
      self.mono_disp.tick();
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

      var pointx = self.x+self.w/2+10+self.scenario.shaker.x;
      var pointy = self.y+self.h-3+self.scenario.shaker.y-self.bump;
      if(self.monologue.disabled) canv.context.fillStyle = "#BBBBBB";
      else                        canv.context.fillStyle = "#FFFFFF";
      canv.context.strokeStyle = "#000000";
      canv.context.beginPath();
      canv.context.moveTo(pointx, pointy);
      canv.context.lineTo(pointx+self.w/20, pointy+self.w/20);
      canv.context.lineTo(pointx+self.w/20, pointy);
      canv.context.fill();
      canv.context.stroke();
    }
  }

  var TimelessBubbleDisplay = function(scen, mono)
  {
    var self = this;

    self.x = 250;
    self.y = 200;
    self.w = 520;
    self.h = 115;
    self.bump = 0;

    self.scenario = scen;
    self.monologue = mono;
    self.mono_disp = new MonologueBubbleDisplay(self.scenario,self.monologue, self.x+10, self.y+10, self.w-BigFontPx, self.h);

    self.bumpit = function()
    {
      self.bump = 5;
    }

    self.tick = function()
    {
      if(self.bump > 0) self.bump--;
      self.mono_disp.tick();
    }

    self.draw = function(canv)
    {
      self.scenario.shaker.randomize();
      if(self.monologue.disabled) canv.context.fillStyle = "#BBBBBB";
      else                        canv.context.fillStyle = "#FFFFFF";
      canv.context.fillRect(self.x+self.scenario.shaker.x, self.y+self.scenario.shaker.y-self.bump, self.w, self.h);
      self.mono_disp.draw(canv, self.bump);
      self.scenario.shaker.randomize();
      canv.context.strokeStyle = "#000000";
      canv.context.lineWidth = 5;
      canv.context.strokeRect(self.x+self.scenario.shaker.x, self.y+self.scenario.shaker.y-self.bump, self.w, self.h);

      var pointx = self.x+self.w/2+10+self.scenario.shaker.x;
      var pointy = self.y+self.h-3+self.scenario.shaker.y-self.bump;
      if(self.monologue.disabled) canv.context.fillStyle = "#BBBBBB";
      else                        canv.context.fillStyle = "#FFFFFF";
      canv.context.strokeStyle = "#000000";
      canv.context.beginPath();
      canv.context.moveTo(pointx, pointy);
      canv.context.lineTo(pointx+self.w/20, pointy+self.w/20);
      canv.context.lineTo(pointx+self.w/20, pointy);
      canv.context.fill();
      canv.context.stroke();
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

    self.x = 600;
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
      var x = self.scenario.shaker.x;
      var y = self.scenario.shaker.y;
      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=20;
      self.scenario.shaker.y*=20;

      canv.context.fillStyle = "#000000";
      canv.context.fillRect(self.x+x-(self.scenario.shaker.x/2),self.y-self.anim+y-(self.scenario.shaker.y/2),self.w+self.scenario.shaker.x,self.h+self.anim+self.scenario.shaker.y);

      canv.context.strokeStyle = "#FFFFFF";
      canv.context.lineWidth = 10;
      canv.context.beginPath();
      canv.context.arc(
        self.x+self.w/4+self.scenario.shaker.x,
        self.y+self.h/8+self.scenario.shaker.y-self.anim,
        (self.w/6),
        0,
        2*Math.PI,
        true);
      canv.context.stroke();

      canv.context.lineWidth = 8;
      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=10;
      self.scenario.shaker.y*=10;

      canv.context.beginPath();
      canv.context.moveTo(self.x+self.w/2-self.w/10+self.scenario.shaker.x,self.y+self.h/4-self.anim+self.scenario.shaker.y);
      canv.context.lineTo(self.x-self.w/4+self.scenario.shaker.x,self.y+self.h/3-(self.anim*10)+self.scenario.shaker.y);
      canv.context.stroke();

      self.scenario.shaker.randomize();
      self.scenario.shaker.x*=10;
      self.scenario.shaker.y*=10;

      canv.context.beginPath();
      canv.context.moveTo(self.x+self.w/2+self.w/10+self.scenario.shaker.x,self.y+self.h/4-self.anim+self.scenario.shaker.y);
      canv.context.lineTo(self.x+self.w+self.w/4+self.scenario.shaker.x,self.y+self.h/3-(self.anim*10)+self.scenario.shaker.y);
      canv.context.stroke();

      self.scenario.shaker.randomize();
    }

    self.tick = function()
    {
      if(self.anim > 0) self.anim--;
    }
  }

  var Strap = function(x,y,w,h)
  {
    var self = this;

    self.sx = x+Math.random()*w;
    self.sy = y;
    self.ex = x+Math.random()*w;
    self.ey = y+h;
    self.draw = function(canv,offx,offy)
    {
      canv.context.strokeStyle = "#222222";
      canv.context.lineWidth = 5;
      canv.context.beginPath();
      canv.context.moveTo(self.sx+offx,self.sy+offy);
      canv.context.lineTo(self.ex+offx,self.ey+offy);
      canv.context.stroke();
    }
  }
  var Hero = function(scen)
  {
    var self = this;

    self.scenario = scen;

    self.x = 150;
    self.y = 530;
    self.w = 220;
    self.h = 100;

    self.orig_x = self.x;
    self.orig_y = self.y;
    self.orig_w = self.w;
    self.orig_h = self.h;

    self.escaping = false;
    self.t = 0;

    //personal wiggler
    self.s = new Shaker();
    self.samt = 0;;

    self.straps = [];
    self.maxstraps = 30;
    self.nstraps = self.maxstraps;
    self.lastknownnstraps = self.nstraps;
    for(var i = 0; i < self.nstraps; i++)
      self.straps.push(new Strap(self.x,self.y,self.w,self.h));

    self.draw = function(canv)
    {
      self.s.shake = 5*(1+self.samt);
      self.s.randomize();

      canv.context.fillStyle = "#FFFFFF";
      canv.context.strokeStyle = "#000000";
      canv.context.fillRect(self.x+self.s.x+self.scenario.shaker.x,self.y+self.s.y+self.scenario.shaker.y,self.w,self.h);
      canv.context.strokeRect(self.x+self.s.x+self.scenario.shaker.x,self.y+self.s.y+self.scenario.shaker.y,self.w,self.h);

      for(var i = 0; i < self.nstraps; i++)
        self.straps[i].draw(canv, self.s.x+self.scenario.shaker.x, self.s.y+self.scenario.shaker.y);

      self.scenario.shaker.randomize();
    }

    self.tick = function()
    {
      if(self.samt > 0) self.samt--;
      self.nstraps = Math.round((1-(self.scenario.timer.t/self.scenario.timer.total))*self.maxstraps);
      if(self.nstraps != self.lastknownnstraps)
      {
        console.log('snappin');
        boing_audio[Math.floor(Math.random()*boing_audio.length)].play();
        self.samt = 20;
      }
      self.lastknownnstraps = self.nstraps;
      if(self.escaping)
      {
        self.nstraps = 0;
        if(self.t == 0) boing_audio[Math.floor(Math.random()*boing_audio.length)].play();
        self.t++;
        self.y = self.orig_y - Math.abs(Math.sin(self.t/10))*200;
        self.x-=3;
      }
    }
  }

  var SmokePart = function(scen,x,y,s)
  {
    var self = this;

    self.scenario = scen;
    self.x = x;
    self.y = y;
    self.s = s;
    self.t = 0;

    self.draw = function(canv)
    {
      canv.context.fillStyle = "rgba(0,0,0,0.5)";
      canv.context.beginPath();
      canv.context.arc(
      self.x+self.s/2+self.scenario.shaker.x,
      self.y+self.s/2+self.scenario.shaker.y,
      (self.s/2),
      0,
      2*Math.PI,
      true);
      canv.context.fill();
    }

    self.tick = function()
    {
      self.t++;
      self.y -= self.s/5*Math.random();
      self.x += self.s/5*((Math.random()*2)-1);
      return self.t < 100;
    }
  }

  var Train = function(scen, mono)
  {
    var self = this;

    self.scenario = scen;
    self.monologue = mono;

    self.start_x = 250-5;
    self.start_y = 2*stage.drawCanv.canvas.height/3-20;
    self.start_w = 20;
    self.start_h = 20;

    self.end_x = 150-105;
    self.end_y = stage.drawCanv.canvas.height-420;
    self.end_w = 420;
    self.end_h = 420;

    self.sin_seed = 0;

    var lerp = function(s,e,t)
    {
      return s+(e-s)*(t*0.8);
    }
    self.draw = function(canv)
    {
      self.scenario.shaker.randomize();
      canv.context.fillStyle = "#FFFFFF";

      var t = self.monologue.progress/self.monologue.text.length;
      t = t*t;
      var x = lerp(self.start_x,self.end_x,t);
      var y = lerp(self.start_y,self.end_y,t);
      var w = lerp(self.start_w,self.end_w,t);
      var h = lerp(self.start_h,self.end_h,t);

      var sin = Math.sin(self.sin_seed);

      if(sin < 0) sin = (-sin*sin);
      sin /= 4;
      sin += 1.25;
      y -= ((h*sin)-h);
      h *= sin;

      sin = Math.sin(self.sin_seed+Math.PI);
      if(sin < 0) sin = (-sin*sin);
      sin /= 4;
      sin += 1.25;
      x -= ((w*sin)-w)/2;
      w *= sin;

      x += (w*(1/3))/2
      y += (h*(1/3))/2
      w *= 2/3;
      h *= 2/3;

      canv.context.fillStyle = "#888888";
      canv.context.strokeStyle = "#000000";
      canv.context.fillRect(x,y,w,h);
      canv.context.strokeRect(x,y,w,h);
      y+=h/3
      canv.context.beginPath();
      canv.context.arc(
      x+w/2+self.scenario.shaker.x,
      y+h/2+self.scenario.shaker.y,
      (w/2)-5,
      0,
      2*Math.PI,
      true);
      canv.context.fill();
      canv.context.stroke();
    }
    self.tick = function()
    {
      if(Math.floor(Math.random()*5) == 0)
      {
        var t = self.monologue.progress/self.monologue.text.length;
        t = t*t;
        var x = lerp(self.start_x,self.end_x,t);
        var y = lerp(self.start_y,self.end_y,t);
        var w = lerp(self.start_w,self.end_w,t);
        particler.register(new SmokePart(self.scenario,x+w/4,y,5+t*50));
      }
      self.sin_seed+=0.2;
    }
  }

  var Fade = function(scene)
  {
    var self = this;

    self.t = 0;

    self.draw = function(canv)
    {
      if(self.t != 0)
      {
        canv.context.fillStyle = "rgba(0,0,0,"+self.t+")";
        canv.context.fillRect(0,0,canv.canvas.width,canv.canvas.height);
      }
    }
  }

  var Scenario1 = function()
  {
    var self = this;

    self.mono;
    self.mono_full_disp;
    self.timer;
    self.bubb;
    self.shaker;
    self.train;
    self.villain;
    self.hero;
    self.fade;
    self.mode;
    self.modetweenhack;

    self.begin = function()
    {
      tgen = new TextGen();
      self.mono = new Monologue(self,tgen.getMonologue());
      self.mono_full_disp = new MonologueFullDisplay(self,self.mono);
      self.timer = new Timer(self);
      self.timer.total = Math.round(self.mono.text.length*8.75);
      self.bubb = new BubbleDisplay(self,self.mono,self.timer);
      self.shaker = new Shaker(self);
      self.train = new Train(self,self.mono);
      self.villain = new Villain(self);
      self.hero = new Hero(self);
      self.fade = new Fade(self);
      self.mode = 0;
      self.modetweenhack = 0;

      keyer.register(self.mono);
      ticker.register(self.mono);
      drawer.register(self.mono_full_disp);
      drawer.register(self.bubb);
      ticker.register(self.bubb);
      ticker.register(self.timer);
      ticker.register(self.shaker);
      drawer.register(self.villain);
      drawer.register(self.train);
      ticker.register(self.train);
      ticker.register(self.villain);
      drawer.register(particler);
      ticker.register(particler);
      drawer.register(self.hero);
      ticker.register(self.hero);
      drawer.register(self.fade);

      bg_audio.play();
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
      drawer.unregister(self.train);
      ticker.unregister(self.train);
      drawer.unregister(self.villain);
      ticker.unregister(self.villain);
      drawer.unregister(self.hero);
      ticker.unregister(self.hero);
      drawer.unregister(particler);
      ticker.unregister(particler);
      particler.clear();
      drawer.unregister(self.fade);

      bg_audio.stop();
    }

    // 0 = play
    // 1 = escape
    // 2 = victory
    self.tick = function()
    {
      if(self.mode == 0)
      {
        if(self.timer.t == self.timer.total)
        {
          keyer.unregister(self.mono);
          drawer.unregister(self.bubb);
          ticker.unregister(self.timer);
          self.mode = 1;
        }
        else if(self.mono.progress == self.mono.text.length)
        {
          keyer.unregister(self.mono);
          self.mode = 2;
        }
      }
      else if(self.mode == 1)
      {
        var tweenlen = 150;
        if(self.modetweenhack < tweenlen)
        {
          self.modetweenhack++;
          self.hero.escaping = true;
        }
        else
        {
          scene.goToScenario(1);
        }
      }
      else if(self.mode == 2)
      {
        var tweenlen = 50;
        if(self.modetweenhack < tweenlen+120)
        {
          self.modetweenhack++;
          if(self.modetweenhack > 30)
          {
            self.fade.t = ((self.modetweenhack-30)/(tweenlen-30));
          }
          if(self.modetweenhack == tweenlen)
            scream_audio.play();
        }
        else scene.goToScenario(2);
      }
    }
  }

  var Scenario2 = function()
  {
    var self = this;

    self.mono;
    self.mono_full_disp;
    self.bubb;
    self.shaker;
    self.villain;
    self.fade;
    self.mode;
    self.modetweenhack;

    self.begin = function()
    {
      tgen = new TextGen();
      self.mono = new Monologue(self,tgen.getFailureMonologue());
      self.mono_full_disp = new MonologueFullDisplay(self,self.mono);
      self.bubb = new TimelessBubbleDisplay(self,self.mono);
      self.shaker = new Shaker(self);
      self.villain = new Villain(self);
      self.fade = new Fade(self);
      self.mode = 0;
      self.modetweenhack = 0;

      keyer.register(self.mono);
      ticker.register(self.mono);
      drawer.register(self.mono_full_disp);
      drawer.register(self.bubb);
      ticker.register(self.bubb);
      ticker.register(self.shaker);
      drawer.register(self.villain);
      ticker.register(self.villain);
      drawer.register(particler);
      ticker.register(particler);
      drawer.register(self.fade);

      bg_audio.play();
    }

    self.end = function()
    {
      keyer.unregister(self.mono);
      ticker.unregister(self.mono);
      drawer.unregister(self.mono_full_disp);
      drawer.unregister(self.bubb);
      ticker.unregister(self.bubb);
      ticker.unregister(self.shaker);
      drawer.unregister(self.villain);
      ticker.unregister(self.villain);
      drawer.unregister(particler);
      ticker.unregister(particler);
      particler.clear();
      drawer.unregister(self.fade);

      bg_audio.stop();
    }

    //0 = lamenting
    //1 = fadeout
    self.tick = function()
    {
      if(self.mode == 0)
      {
        if(self.mono.progress == self.mono.text.length)
        {
          keyer.unregister(self.mono);
          self.mode = 1;
        }
      }
      else if(self.mode == 1)
      {
        var tweenlen = 110;
        if(self.modetweenhack < tweenlen)
        {
          self.modetweenhack++;
          if(self.modetweenhack > 20)
          {
            self.fade.t = ((self.modetweenhack-20)/(tweenlen-20));
          }
        }
        else
        {
          //try again
          scene.goToScenario(0);

          //go to home screen
          //bg_audio.stop();
          //game.nextScene();
        }
      }
    }
  }

  var Scenario3 = function()
  {
    var self = this;

    self.mono;
    self.mono_full_disp;
    self.bubb;
    self.shaker;
    self.villain;
    self.fade;
    self.mode;
    self.modetweenhack;

    self.begin = function()
    {
      tgen = new TextGen();
      self.mono = new Monologue(self,tgen.getSuccessMonologue());
      self.mono_full_disp = new MonologueFullDisplay(self,self.mono);
      self.bubb = new TimelessBubbleDisplay(self,self.mono);
      self.shaker = new Shaker(self);
      self.villain = new Villain(self);
      self.fade = new Fade(self);
      self.mode = 0;
      self.modetweenhack = 0;

      keyer.register(self.mono);
      ticker.register(self.mono);
      drawer.register(self.mono_full_disp);
      drawer.register(self.bubb);
      ticker.register(self.bubb);
      ticker.register(self.shaker);
      drawer.register(self.villain);
      ticker.register(self.villain);
      drawer.register(particler);
      ticker.register(particler);
      drawer.register(self.fade);

      bg_audio.play();
    }

    self.end = function()
    {
      keyer.unregister(self.mono);
      ticker.unregister(self.mono);
      drawer.unregister(self.mono_full_disp);
      drawer.unregister(self.bubb);
      ticker.unregister(self.bubb);
      ticker.unregister(self.shaker);
      drawer.unregister(self.villain);
      ticker.unregister(self.villain);
      drawer.unregister(particler);
      ticker.unregister(particler);
      particler.clear();
      drawer.unregister(self.fade);

      bg_audio.stop();
    }

    //0 = proudtalk
    //1 = fadeout
    self.tick = function()
    {
      if(self.mode == 0)
      {
        if(self.mono.progress == self.mono.text.length)
        {
          keyer.unregister(self.mono);
          self.mode = 1;
        }
      }
      else if(self.mode == 1)
      {
        var tweenlen = 110;
        if(self.modetweenhack < tweenlen)
        {
          self.modetweenhack++;
          if(self.modetweenhack > 20)
          {
            self.fade.t = ((self.modetweenhack-20)/(tweenlen-20));
          }
          if(self.modetweenhack >= tweenlen)
          {
            bg_audio.stop();
            game.nextScene();
          }
        }
      }
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
    particler = new Particler({});
    keyer = new Keyer({source:stage.dispCanv.canvas});

    tgen = new TextGen();

    bg_audio = new Aud("assets/AllTiedUp.ogg", true);
    bg_audio.load();
    mermer_audio = [];
    for(var i = 0; i < 10; i++)
    {
      mermer_audio.push(new Aud("assets/Talking"+(i+1)+".ogg", false));
      mermer_audio[i].load();
    }
    cough_audio = [];
    for(var i = 0; i < 4; i++)
    {
      cough_audio.push(new Aud("assets/Coughing"+(i+1)+".ogg", false));
      cough_audio[i].load();
    }
    train_audio = new Aud("assets/SteamWhistle.ogg",false);
    train_audio.load();
    boing_audio = [];
    for(var i = 0; i < 5; i++)
    {
      boing_audio.push(new Aud("assets/Jawharp"+(i+1)+".ogg",false));
      boing_audio[i].load();
    }
    scream_audio = new Aud("assets/Jawharp1.ogg",false);
    scream_audio.load();

    scenarios = [];
    var main = new Scenario1();
    scenarios.push(main);
    var ohno = new Scenario2();
    scenarios.push(ohno);
    var hooray = new Scenario3();
    scenarios.push(hooray);

    cur_scen = 0;
    scenarios[cur_scen].begin();
    ticker.register(scenarios[cur_scen]);

    cloud_particler.clear();
    for(var i = 0; i < 5; i++)
      cloud_particler.register(new Cloud(Math.random()*(stage.drawCanv.canvas.width+100),Math.random()*350+50));
  };

  var CloudPuff = function(x,y,s)
  {
    var self = this;

    self.x = x;
    self.y = y;
    self.s = s;
  }
  var Cloud = function(x,y)
  {
    var self = this;

    self.x = x;
    self.y = y;
    self.puffs = [];
    self.sp = 0.2+(Math.random()*0.5);

    var npuffs = 5+Math.floor(Math.random()*10);
    for(var i = 0; i < npuffs; i++)
      self.puffs.push(new CloudPuff((Math.random()*80)-40,(Math.random()*30)-15,Math.random()*20+10));

    self.draw = function(canv)
    {
      for(var i = 0; i < npuffs; i++)
      {
        canv.context.fillStyle = "#CCCCCC";
        canv.context.lineWidth = 5;
        canv.context.beginPath();
        canv.context.arc(
          self.x+self.puffs[i].x,
          self.y+self.puffs[i].y,
          self.puffs[i].s,
          0,
          Math.PI*2,
          true);
        canv.context.fill();
      }
    }

    self.tick = function()
    {
      self.x -= self.sp;
      return self.x > -40;
    }
  }

  var cloud_particler = new Particler({}); //hack so nothing needs to manage it
  self.tick = function()
  {
    keyer.flush();
    ticker.flush();
    cloud_particler.tick();

    if(Math.floor(Math.random()*1000) == 0) train_audio.play();
    if(Math.floor(Math.random()*500) == 0) cloud_particler.register(new Cloud(stage.drawCanv.canvas.width+100,Math.random()*350+50));
  };

  self.draw = function()
  {
    var canv = stage.drawCanv;
    canv.context.fillStyle = "#BBBBBB";
    canv.context.fillRect(0,0,canv.canvas.width,canv.canvas.height);

    cloud_particler.draw(stage.drawCanv); //draw after sky, before ground

    canv.context.fillStyle = "#555555";
    canv.context.fillRect(0,2*canv.canvas.height/3,canv.canvas.width,canv.canvas.height/2);

    canv.context.strokeStyle = "#333333";
    canv.context.lineWidth = 4;
    var tlx = 250; var tly = 2*canv.canvas.height/3;
    var trx = 260; var trY = 2*canv.canvas.height/3;
    var blx = 150; var bly = canv.canvas.height;
    var brx = 360; var bry = canv.canvas.height;
    canv.context.beginPath();
    canv.context.moveTo(tlx,tly);
    canv.context.lineTo(blx,bly);
    canv.context.stroke();
    canv.context.beginPath();
    canv.context.moveTo(trx,trY);
    canv.context.lineTo(brx,bry);
    canv.context.stroke();

    canv.context.strokeStyle = "#111111";
    var lerp = function(s,e,t) { return s+(e-s)*t; }
    var rails = 20;
    for(var i = 0; i < rails; i++)
    {
      var t = (i/rails)*(i/rails);
      canv.context.lineWidth = t*20;
      canv.context.beginPath();
      canv.context.moveTo(lerp(tlx,blx,t),lerp(tly,bly,t));
      canv.context.lineTo(lerp(trx,brx,t),lerp(trY,bry,t));
      canv.context.stroke();
    }

    drawer.flush();
  };

  self.goToScenario = function(s)
  {
    scenarios[cur_scen].end();
    ticker.unregister(scenarios[cur_scen]);
    cur_scen = s;
    scenarios[cur_scen].begin();
    ticker.register(scenarios[cur_scen]);
  }

  self.cleanup = function()
  {
  };
};

