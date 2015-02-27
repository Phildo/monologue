var Keyer = function(init)
{
  var default_init =
  {
    source:document.createElement('div')
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  var keyables = [];
  var callbackQueue = [];
  var evtQueue = [];
  self.register = function(keyable) { keyables.push(keyable); }
  self.unregister = function(keyable) { keyables.splice(keyables.indexOf(keyable),1); }
  self.clear = function() { keyables = []; }
  self.attach = function() //will get auto-called at creation
  {
    //self.source.addEventListener('keypress', key, false);
    document.addEventListener('keypress', key, false);
  }
  self.detach = function()
  {
    //self.source.removeEventListener('keypress', key);
    document.removeEventListener('keypress', key);
  }

  function key(evt)
  {
    var code;
    if((code = evt.charCode) == 13) code = 32;
    var k = String.fromCharCode(code).toLowerCase();
    if(k != "")
    {
      for(var i = 0; i < keyables.length; i++)
      {
        callbackQueue.push(keyables[i].key);
        evtQueue.push(k);
      }
    }
    evt.preventDefault();
  }
  self.flush = function()
  {
    for(var i = 0; i < callbackQueue.length; i++)
      callbackQueue[i](evtQueue[i]);
    callbackQueue = [];
    evtQueue = [];
  }

  self.attach();
}

//example keyable- just needs key callback
var Keyable = function(args)
{
  var self = this;

  self.key = args.key ? args.key : function(){};
}

