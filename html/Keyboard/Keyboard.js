const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properities: {
        value: "",
        capslock: false
    },

    init(){
        // elemt create
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // element setup
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // fill the txt box
        document.querySelectorAll(".use-keyboard-input").forEach(elements => {
            elements.addEventListener("focus", () => {
                this.open(elements.value, currentValue => {
                    elements.value = currentValue;
                });
            });
        });
    }, 

    _createKeys(){
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // html icon create
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch(key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", ()=>{
                       this.properities.value = this.properities.value.substring(0, this.properities.value.length -1);
                       this._triggerEvent("oninput");
                    });
                    break;
                
                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activateable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", ()=>{
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--activate", this.properities.capslock);
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", ()=>{
                        this.properities.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;
                
                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", ()=>{
                        this.properities.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;
                
                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", ()=>{
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", ()=>{
                        this.properities.value += this.properities.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == "function"){
            this.eventHandlers[handlerName](this.properities.value);
        }
    },

    _toggleCapsLock(){
        this.properities.capslock = !this.properities.capslock;
        for(const key of this.elements.keys){
            if(key.childElementCount === 0){
                key.textContent = this.properities.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose){
        this.properities.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close(){
        this.properities.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }

};

window.addEventListener("DOMContentLoaded", function(){
    Keyboard.init();
    Keyboard.open("", function(currentValue){
        console.log("val changed: " + currentValue);
    }, function(currentValue) {
        console.log("keyboard closed, finishing value: " + currentValue);
    })
});