document.addEventListener('DOMContentLoaded', function() {

    // Кнопки

    const   profileButton = document.querySelector('.header__profile')
            profileMenu = document.querySelector('.profile-menu')
            changeScreenBtn = document.querySelectorAll('.js-screen-btn')
            screen = document.querySelectorAll('.js-screen')
            headerBtns = document.querySelectorAll('.header__nav-btn')
            discover = document.querySelector('.discover')
            
    function showMenu(button, menu) {
        button.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });
    };
    
    function changeScreen(button, screen) {
        button.forEach((btn) => {
           btn.addEventListener('click', () => {    
                if(btn.classList.contains('header__nav-btn_active')) {
                    return;
                }
                headerBtns.forEach((item) => {
                    if(item.classList.contains('header__nav-btn_active')) {
                        item.classList.remove('header__nav-btn_active')

                    } else {
                        item.classList.add('header__nav-btn_active')
                    } 
                })
                screen.forEach((item) => {
                    item.style.display = item.style.display === 'none' ? 'flex' : 'none';
                })
                discover.classList.toggle('discover_build')
            }); 
        });
    };

    changeScreen(changeScreenBtn, screen)
    showMenu(profileButton, profileMenu)

    // modal

    const   modalClose = document.querySelectorAll('.js-close');
    const   modal = document.querySelector('.js-modal');
    const   checkout = document.querySelector('.build-burger__checkout')
    
    function closeModal() {
        modalClose.forEach((item) => {
                item.addEventListener('click', () => {
                modal.style.display = 'none'
            })
        })
        
    }
    function showModal() {
        checkout.addEventListener('click', () => {
            modal.style.display = 'block'
        })
    }

    closeModal()
    showModal()

    /// burger 

    let topBun;
    const burger = document.querySelector('.build-burger__burger');
    const $price = document.querySelector(".build-burger__checkout-summ");
    const $calculate = [...document.querySelectorAll('.build-burger__calculate-data-name')]

    function loadInrgedients() {
        const template = document.querySelector('#ingredient');
        const ingredients = document.querySelector('.build-burger__ingridients');
        
        let data;
        

        readFile("./js/data.json", function(text){
            data = JSON.parse(text);
            data.forEach((el, i) => {
                if (el.auto) {
                    i--;
                    return;
                }
                const clone = template.content.cloneNode(true);
                const cloneImg = document.createElement("img");
                const cloneName = clone.querySelector(".build-burger__name");
                const cloneAddBtn = clone.querySelector(".build-burger__plus");
                const cloneRemoveBtn = clone.querySelector(".build-burger__minus");
                const amount = clone.querySelector(".build-burger__amount");
                
                cloneImg.classList.add("build-burger__img");
                cloneImg.src = el.img;
                cloneName.innerHTML = el.name;
                
                ingredients.appendChild(clone);
                const appendClone = ingredients.querySelector(`.ingredient:last-of-type`);
                appendClone.insertBefore(cloneImg, cloneName);

                el.amount = amount;

                cloneAddBtn.addEventListener("click", () => addInrgedient(el));
                cloneRemoveBtn.addEventListener("click", () => removeInrgedient(el));
            });
            topBun = data[0]
        }); 
    }
   
    function readFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    let ingHeight = 5

    function addInrgedient(ing) {
        const newIngridient = document.createElement('img')
        const burgerElements = document.querySelectorAll('.build-burger__item')

        $price.dataset.price = (parseFloat($price.dataset.price) + ing.price).toFixed(2);
        $calculate.forEach($data => {
            if ($data.dataset.name === 'min') $data.dataset.value = (parseFloat($data.dataset.value) + ing.min).toFixed(2);
            if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) + ing.oz).toFixed(1);
            if ($data.dataset.name === 'kcal') {
                const curKcal = parseFloat($data.dataset.value) + ing.kcal;
                $data.dataset.value = curKcal.toFixed(0);
              
                question(curKcal > 1500)
            }
        });

        newIngridient.classList.add(ing.name);
        newIngridient.classList.add('build-burger__item')
        
        if (burgerElements[burgerElements.length - 1].classList.contains('Bun-top')) {
            burgerElements[burgerElements.length - 1].remove()
            ingHeight -= 4
            $price.dataset.price = (parseFloat($price.dataset.price) - topBun.price).toFixed(2);
            $calculate.forEach($data => {
                if ($data.dataset.name === 'min') $data.dataset.value = (parseFloat($data.dataset.value) - topBun.min).toFixed(2);
                if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) - topBun.oz).toFixed(1);
                if ($data.dataset.name === 'kcal') {
                   const curKcal = parseFloat($data.dataset.value) - topBun.kcal;
                   $data.dataset.value = curKcal.toFixed(0);
     
                   question(curKcal > 1500)
                }
            });
            clearTimeout(addTopBunTimout);
            addTopBunTimout = null;
        }

        if (ing.img_group) {
            newIngridient.src = ing.img_group;
        } else {
            newIngridient.src = ing.img;
        }
        setTimeout(() => {
            ingHeight += 4
            newIngridient.style.bottom = `${ingHeight}%`
            burger.appendChild(newIngridient); 
        }, 1);
        

        if (ing.amount) {ing.amount.dataset.value++}

        if (addTopBunTimout) {
            clearTimeout(addTopBunTimout);
            addTopBunTimout = null;
        } 
        if (burgerElements.length >= 2) {addTopBun()}
    }

    function removeInrgedient(ing) {

        const burgerSceneElements = document.querySelectorAll(`.${ing.name}`)
        const burgerElements = document.querySelectorAll('.build-burger__item')

        if (typeof burgerSceneElements[burgerSceneElements.length - 1] === 'undefined') {return;}
        burgerSceneElements[burgerSceneElements.length - 1].remove();

        if (burgerElements[burgerElements.length - 1].classList.contains('Bun-top') && burgerElements.length <= 3) {
            burgerElements[burgerElements.length - 1].remove()
            ingHeight -= 4
            $price.dataset.price = (parseFloat($price.dataset.price) - topBun.price).toFixed(2);
            $calculate.forEach($data => {
                if ($data.dataset.name === 'min') $data.dataset.value = (parseFloat($data.dataset.value) - topBun.min).toFixed(2);
                if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) - topBun.oz).toFixed(1);
                if ($data.dataset.name === 'kcal') {
                   const curKcal = parseFloat($data.dataset.value) - topBun.kcal;
                   $data.dataset.value = curKcal.toFixed(0);
     
                   question(curKcal > 1500)
                 }
            });
            clearTimeout(addTopBunTimout);
            addTopBunTimout = null;
        } 

        if (ing.amount && parseInt(ing.amount.dataset.value) === 0 ) return;
        $price.dataset.price = (parseFloat($price.dataset.price) - ing.price).toFixed(2);
        $calculate.forEach($data => {
           if ($data.dataset.name === 'min') $data.dataset.value = (parseFloat($data.dataset.value) - ing.min).toFixed(2);
           if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) - ing.oz).toFixed(1);
           if ($data.dataset.name === 'kcal') {
              const curKcal = parseFloat($data.dataset.value) - ing.kcal;
              $data.dataset.value = curKcal.toFixed(0);

              question(curKcal > 1500)
            }
        });
       
        if (burgerElements.length > 2) {addTopBun()} 
        if (addTopBunTimout) {
            clearTimeout(addTopBunTimout);
            addTopBunTimout = null;
        } 

        ingHeight -= 4
        const bottomToRemove = parseInt(burgerSceneElements[burgerSceneElements.length - 1].style.bottom);
        const ingToUpdate = document.querySelectorAll(`.build-burger__item[style*="bottom"]:not([style*="bottom:${bottomToRemove}px"])`);
        
        ingToUpdate.forEach((element) => {
            if (parseInt(burgerSceneElements[burgerSceneElements.length - 1].style.bottom) <  parseInt(element.style.bottom)) {
                const currentBottom = parseInt(element.style.bottom);
                element.style.bottom = `${currentBottom - 4}%`;
            }
        });

        if (ing.amount) {ing.amount.dataset.value--}
    }

    var addTopBunTimout;

    function addTopBun() {
        addTopBunTimout = setTimeout(() => {
            addInrgedient(topBun);
            clearTimeout(addTopBunTimout);
            addTopBunTimout = null;
            
        }, 3000);  
    }   

    function question(value) {
        const $question = document.querySelector('.build-burger__question');

        if (value === true) {
            $question.style.display = 'block'
        } else {
            $question.style.display = 'none'
        }
    }
    
    function addKetchup() {
        const $ketchupBtn = document.querySelector('.build-burger__ketchup');
        const $ketchupImg = document.querySelector('.build-burger__ketchup-img');

        $ketchupBtn.addEventListener('click', () => {
            $ketchupImg.style.display = $ketchupImg.style.display === 'none' ? 'block' : 'none';
            if ($ketchupImg.style.display === 'none') {
                $calculate.forEach($data => {
                    if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) - 1.2).toFixed(1);
                }) 
            } else {
                $calculate.forEach($data => {
                    if ($data.dataset.name === 'oz') $data.dataset.value = (parseFloat($data.dataset.value) + 1.2).toFixed(1);
                }) 
            }    
        })
    }

    loadInrgedients()
    addKetchup()
}); 
