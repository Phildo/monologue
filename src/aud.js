var Aud = function(source)
{
  var self = this;

  self.audio = new Audio(source);
  self.audio.controls = false;
  self.audio.loop = true;

  self.load = function()
  {
    self.audio.load();
  }

  self.play = function()
  {
    self.audio.play();
  }

  self.stop = function()
  {
    self.audio.pause();
  }
}
