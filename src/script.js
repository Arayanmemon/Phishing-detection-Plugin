var needle = $('needle');
var el = $('el');

var measureDeg = function() {
  // matrix-to-degree conversion from https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  var st = window.getComputedStyle(needle, null);
  var tr = st.getPropertyValue("-webkit-transform") ||
           st.getPropertyValue("-moz-transform") ||
           st.getPropertyValue("-ms-transform") ||
           st.getPropertyValue("-o-transform") ||
           st.getPropertyValue("transform") ||
           "fail...";

  var values = tr.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
  var a = values[0];
  var b = values[1];
  var c = values[2];
  var d = values[3];

  var scale = Math.sqrt(a*a + b*b);

  // arc sin, convert from radians to degrees, round
  var sin = b/scale;
  var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  
  el.set('data-value', angle);
};

var periodicalID = measureDeg.periodical(10);
// const n = document.getElementbyId("#el")
// n.childNodes[0].style.transform = "rorate(120deg)"