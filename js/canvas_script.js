//Haomin liu,12109377,assignment 2,quizfun

$(document).ready(function(){
canvas=O('logo');
var c = canvas.getContext('2d'); 

c.fillStyle = "#272b30"; 
c.fillRect(0,0,canvas.width,canvas.height); 
 
c.shadowColor = "white"; 
c.shadowOffsetX = 5; 
c.shadowOffsetY = 5; 
c.shadowBlur = 15; 
 
window.setTimeout(function(){
	c.font = '50pt start'; 
	c.fillText("QUIZ  FUN",5,135); 
},100);

//c.fillStyle = "#C1EAF8"; 
//c.fillStyle = "#82D5FD"; 
//c.fillStyle = "#FFCCBC"; 
//c.fillStyle = "#69F0AE"; 
  
  
//c.fillStyle = "#cfcff6"; 
c.fillStyle = "#f7a877"; 
});


function O(obj)
{
  if (typeof obj == 'object') return obj
  else return document.getElementById(obj)
}
function S(obj)
{
  return O(obj).style
}
function C(name)
{
  var elements = document.getElementsByTagName('*')
  var objects  = []
  for (var i = 0 ; i < elements.length ; ++i)
    if (elements[i].className == name)
      objects.push(elements[i])
  return objects
}