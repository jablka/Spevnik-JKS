function init() {
  document.write(
    "<div id='offlineMenu'>"
    + "    <button id='lcToday' onclick='Domov()' title='Domov'>Domov</button>"
    + "    <button id='lcFontSizeSmaller' onclick='fontMinus()' title='Zmenšiť písmo'>A-</button>"
    + "    <input id='lcFontSize' onchange='setFontSize(this.value);' onclick='this.select();' "
    + " title='Veľkosť písma' value='" + getFontSize() + "%' />"
    + "    <button id='lcFontSizeBigger' onclick='fontPlus()' title='Zväčšiť písmo'>A+</button>"
    + "    <button id='lcRezim' onclick='zmenRezim()' title='Režim: svetlý / tmavý'>Režim</button>"
    + "</div>");

  applyRezim();

  root = document.querySelector(':root');
  setFontSize(getFontSize());
}

function applyRezim() {
  if (jeTmavy())
    document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}

function jeTmavy() {
  return localStorage.getItem('rezim') == 'dark';
}

function zmenRezim() {
  localStorage.setItem('rezim', ((jeTmavy()) ? '' : 'dark'));
  applyRezim();
}

var font_size_min = 40,   // percentá
  font_size_max = 500,
  font_size_krok = 10;
var root;   // = document.querySelector(':root');    -> init();

function fontMinus() {
  setFontSize(getFontSize() - font_size_krok);
}

function fontPlus() {
  setFontSize(getFontSize() + font_size_krok);
}

function getFontSize() {
  var font_size = localStorage.getItem('fontSize');
  if (!font_size) font_size = 100;
  return parseInt(font_size);
}

function setFontSize(font_size) {
  font_size = parseInt(font_size);
  if (!font_size) font_size = 100;
  font_size = Math.min(font_size_max, Math.max(font_size, font_size_min));    // do limitov
  localStorage.setItem('fontSize', font_size);
  root.style.setProperty('--zoom', font_size + '%');
  document.getElementById('lcFontSize').value = font_size + '%';
  console.log('font_size', font_size);

  return font_size;
}

function Domov() {
  // Get the full URL of the current page
  let currentURL = window.location.href;

  // Get the file name from the URL
  let fileName = currentURL.substring(currentURL.lastIndexOf('/') + 1);
  if (fileName === 'index.html') {
    window.location.href = 'index.html';
  } else {
    window.location.href = '../index.html';
  }
}
