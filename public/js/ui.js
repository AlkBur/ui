'use strict';

//Global
const widgets = new Map();
const $ = (selector) => {
    return document.getElementById(selector);
};
const $$ = (selector) => {
    return UI[selector]
};

//Utils
function newID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function isString(val) {
    return (typeof val === "string" || val instanceof String);
}

function isFunction(val) {
    return (typeof val === "function" || val instanceof Function);
}

function isProperty(obj, val) {
    return (typeof obj[val] !== "undefined");
}

function addWidget(name, fn) {
    if (isString(name) && isFunction(fn)) {
        widgets[name.toLowerCase() ] = fn;
    }
}

function newUI(data) {
    if (isProperty(data, "type") && isString(data.type)) {
        let fn = widgets[data.type.toLowerCase()];
        if (isFunction(fn)) {
            return fn(data);
        }
    }
}

class UI {
    constructor(obj) {
        this.items = [];
        if (isProperty(obj, "items")) {
            for (let el of obj.items) {
                let u = newUI(el);
                if (u !== undefined) {
                    this.items.push(u)
                }
            }
        }
        this.copyProperty(obj, "style", "")
        this.copyProperty(obj, "html", "")
    }
    render() {
        let html = this.html;
        if (html === "") {
            html = "<div" + ((this.style == "") ? "" : " style=\"" + this.style +"\"") + ">";
            for (let el of this.items) {
                html += `<div>${el.render()}</div>`;
            }
            html += `</div>`;
        } 
        return html;
    }
    copyProperty(obj, key, defVal) {
        if (isProperty(obj, key)) {
            this[key] = obj[key];
        } else {
            this[key] = defVal;
        }
    }
}


/************************************************************************
*   Flexbox
************************************************************************/
class Carousel extends UI {
    constructor(obj) {
        super(obj);
        super.copyProperty(obj, "direction", "horizontal");
    }
    render() {
        let items = "<ul>";
        for (let el of this.items) {
            items += `<li>${el.render()}</li>`;
        }
        items += "</ul>"

        let html = `<div class="ui-carousel ${this.direction}" ${((this.style == "") ? "" : "style=\"" + this.style + "\"")}>
        ${items}
        </div>`

        return html;
    }
}
addWidget("carousel", (options) => new Carousel(options));


class Button extends UI {
    constructor(obj) {
        super(obj);
        super.copyProperty(obj, "text", "");
    }
    render() {
        let html = `<button type="button" class="ui-button">${this.text}</button>`

        return html;
    }
}
addWidget("button", (options) => new Button(options));

/************************************************************************
//  Main function
************************************************************************/
async function ui(data) {
    let u;
    if (isString(data)) {
        const response = await fetch(data);
        const json = await response.json();
        u = newUI(json);
    } else {
        u = newUI(data);
    }
    if (u !== undefined) {
        document.body.innerHTML = u.render();
    }
}





