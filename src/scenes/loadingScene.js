var LoadingScene = function(game, stage)
{
  var self = this;
  var pad;
  var barw;
  var progress;
  var canv = stage.drawCanv;

  var imagesloaded = 0;
  var img_srcs = [];
  var images = [];

  var imageLoaded = function()
  {
    imagesloaded++;
  };

  self.ready = function()
  {
    pad = 20;
    barw = (canv.canvas.width-(2*pad));
    progress = 0;
    canv.context.fillStyle = "#000000";
    canv.context.font = "1px vg_font";
    canv.context.fillText(".",0,0);// funky way to encourage any custom font to load

    //put strings in 'img_srcs' as separate array to get "static" count
    img_srcs.push("assets/bg.png");
    img_srcs.push("assets/BadGuy1.png");
    img_srcs.push("assets/BadGuy2.png");
    img_srcs.push("assets/Hero.png");
    img_srcs.push("assets/Train1.png");
    img_srcs.push("assets/Train2.png");
    img_srcs.push("assets/arm1.png");
    img_srcs.push("assets/arm2.png");
    img_srcs.push("assets/arm3.png");
    img_srcs.push("assets/arm4.png");
    img_srcs.push("assets/arm5.png");
    img_srcs.push("assets/arm6.png");
    img_srcs.push("assets/arm7.png");
    img_srcs.push("assets/star.png");
    for(var i = 0; i < img_srcs.length; i++)
    {
      images[i] = new Image();
      images[i].onload = imageLoaded; 
      images[i].src = img_srcs[i];
    }
    imageLoaded(); //call once to prevent 0/0 != 100% bug
  };

  self.tick = function()
  {
    if(progress <= imagesloaded/(img_srcs.length+1)) progress += 0.01;
    if(progress >= 1.0) game.nextScene();
  };

  self.draw = function()
  {
    canv.context.fillRect(pad,canv.canvas.height/2,progress*barw,1);
    canv.context.strokeRect(pad-1,(canv.canvas.height/2)-1,barw+2,3);
  };

  self.cleanup = function()
  {
    progress = 0;
    imagesloaded = 0;
    images = [];//just used them to cache assets in browser; let garbage collector handle 'em.
    canv.context.fillStyle = "#FFFFFF";
    canv.context.fillRect(0,0,canv.canvas.width,canv.canvas.height);
  };
};
