
let searchInput;
let checkBox;
let btn;

// apply fulltextflag
let fulltextflag = localStorage.getItem('fulltext');
// console.log('flag=', fulltextflag)
if (fulltextflag == null) { // ak prvýkrát
    fulltextflag = 'false';
    localStorage.setItem('fulltext', fulltextflag);
}

function full_text_search(paragr) {

    // console.log('konecne',paragr);

    // Select the whole paragraph 
    let ob = new Mark(paragr);

    let piesne = paragr.querySelectorAll('.song')
    let nazvy = paragr.querySelectorAll('.nazov')

    let pelems = paragr.querySelectorAll('p') // riadky s názvami piesní

    // const searchInput = document.getElementById('SearchInput');
    searchInput.addEventListener('input', call_back_full);

    if (searchInput.value) { // pre preklikávanie medzi normal vs fulltext, hodnotu v inpute hneď vyhľadá. :-)
        searchInput.dispatchEvent(new Event("input"));
    }

    function call_back_full(event) {
        let currentValue = event.target.value; // 

        // First unmark the highlighted word or letter 
        ob.unmark();
        piesne.forEach(pies => {
            pies.classList.remove('see');
            pies.style.display = 'block';
        });
        pelems.forEach(pel => {
            pel.style.display = 'block';
        });

        const options = {
            "separateWordSearch": false,
            "diacritics": true,
            "ignorePunctuation": [',', '’'],
            "synonyms": { "ľ": "l" },
        };

        if (currentValue.length > 3 || /^\d+[ab]?$/.test(currentValue)) {

            // Highlight letter or word 
            ob.mark(currentValue, options);

            // TODO: tu budeme zisťovať, či je <mark> v názve piesne.
            // 
            // možno by sa dalo: if currentValue is number... 
            if (/^\d+[ab]?$/.test(currentValue)) {
                nazvy.forEach(naz => {
                    mark_node = naz.querySelector('mark');
                    if (mark_node) {
                        // filtering začiatku slova
                        let n_text = naz.textContent;
                        let mark_node_text = mark_node.textContent;
                        let ind = n_text.indexOf(mark_node_text);

                        // či je začiatok paragrafu alebo začiatok slova:
                        if (ind === 0) { // máme začiatok textu
                            // naz.parentNode.style.display = 'block';
                            naz.parentNode.classList.add('see');
                        } else if (n_text[ind - 1] == ' ') {
                            // naz.parentNode.style.display = 'block'; // začiatok slova 
                            naz.parentNode.classList.add('see');
                        } else {
                            naz.parentNode.classList.remove('see');
                            // naz.parentNode.style.display = 'none';  // mark je, ale nezobrazíme ho.
                        }
                    };
                });
            }
            else {
                // if (currentValue.length>3) {
                pelems.forEach(pel => {
                    mark_node = pel.querySelector('mark');

                    if (mark_node) {
                        // filtering začiatku slova
                        let p_text = pel.textContent;
                        let mark_node_text = mark_node.textContent;
                        let ind = p_text.indexOf(mark_node_text);

                        // či je začiatok paragrafu alebo začiatok slova:
                        if (ind === 0) { // máme začiatok textu
                            pel.style.display = 'block';
                            pel.parentNode.parentNode.classList.add('see');
                        } else if (p_text[ind - 1] == ' ' || p_text[ind - 1] == ':') { // začiatok slova alebo refrén [:...:]
                            pel.style.display = 'block'; // začiatok slova 
                            pel.parentNode.parentNode.classList.add('see');
                        } else {
                            pel.style.display = 'none';  // mark je, ale nezobrazíme ho.
                        }
                    }
                    else { // žiaden mark v paragrafe       
                        pel.style.display = 'none';
                    };
                });
                // }
            }

            piesne.forEach(pies => {
                let see = pies.classList.contains('see');
                if (see) {
                    pies.style.display = 'block';
                }
                else {
                    pies.style.display = 'none';
                }
            });
        }
        else { // ak nie je nič v inpute, zobrazíme všetko.
            piesne.forEach(pies => {
                pies.classList.remove('see')
                pies.style.display = 'block';
            })
        }
    }    
}

function normal_search(paragr) {
    // console.log('konecne', paragr);

    // Select the whole paragraph 
    let ob = new Mark(paragr);

    let piesne = paragr.querySelectorAll('div'); // riadky s názvami piesní

    // const searchInput = document.getElementById('SearchInput');
    searchInput.addEventListener('input', call_back_normal);

    if (searchInput.value) { // pre preklikávanie medzi normal vs fulltext, hodnotu v inpute hneď vyhľadá. :-)
        searchInput.dispatchEvent(new Event("input"));
    }

    function call_back_normal(event) {
        let currentValue = event.target.value; // tu bol .textContent, a nefungovalo to

        // First unmark the highlighted word or letter 
        ob.unmark();

        const options = {
            "separateWordSearch": false,
            "diacritics": true,
            "ignorePunctuation": [',', '’'],
            "synonyms": { "ľ": "l" },
        };

        // Highlight letter or word 
        ob.mark(currentValue, options);

        if (searchInput.value) { // ak je niečo v inpute

            piesne.forEach(pies => {
                mark_node = pies.querySelector('mark');

                if (mark_node) {
                    // filtering začiatku slova
                    let pies_text = pies.textContent;
                    let mark_node_text = mark_node.textContent;
                    let ind = pies_text.indexOf(mark_node_text);

                    if (ind === 0) { // máme začiatok textu
                        pies.style.display = 'block';
                    } else if (pies_text[ind - 1] == ' ') {
                        pies.style.display = 'block'; // začiatok slova          
                    } else {
                        pies.style.display = 'none';  // inak nezobrazíme.                
                    }
                }
                else { // žiaden mark, nezobrazíme.       
                    pies.style.display = 'none';
                };
            });

        }
        else { // ak nie je nič v inpute, zobrazíme všetko.
            piesne.forEach(pies => {
                pies.style.display = 'block';
            })
        }

    }

}


////
async function load_file(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();

    // document.getElementById("content").innerHTML = myText;
    let content = document.getElementById('content');
    content.innerHTML = myText;

    if (file == 'zoznam_piesni_large.html') {
        return document.getElementById('zoznam_fulltext');
    }
    else {
        return document.getElementById('zoznam');
    }
}

// pri loade web stránky:
// window.onload = apply_FT_Flag(); // toto nešlo.
window.onload = () => {
    searchInput = document.getElementById('SearchInput');
    btn = document.getElementById("myBtn");
    checkBox = document.getElementById("myCheck");

    modal();
    apply_FT_Flag();
}

function apply_FT_Flag() {
    // const btn = document.getElementById("myBtn");
    
    // const searchInput = document.getElementById('SearchInput');
    // const checkBox = document.getElementById("myCheck");
    // console.log(checkBox)

    if (fulltextflag == 'true') { // pri načítaní je to string!
        // console.log('nastavujeme flag.');
        checkBox.checked = true;
        // checkBox.checked = true;

        btn.style.display = 'inline';
        vysl = load_file("zoznam_piesni_large.html");
        vysl.then(x => full_text_search(x));
        //        main_search();
    }
    else {
        // console.log('nenastavujeme flag.');
        checkBox.checked = false;

        btn.style.display = 'none';
        vysl = load_file("zoznam_piesni.html");
        vysl.then(x => normal_search(x));
        //main_search();
    }
}

// pri zmene CheckerBoxu
function myCheckerFunction() {
    // const checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true) {
        fulltextflag = 'true'
        localStorage.setItem('fulltext', fulltextflag);

        // location.reload()
        apply_FT_Flag();
    }
    else {
        fulltextflag = 'false'
        localStorage.setItem('fulltext', fulltextflag);

        // location.reload()
        apply_FT_Flag();
    }
}

function modal() {
    // modal
    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    // const btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function mf(where) {
  window.location.href = 'res/'+where+'.html';
}
