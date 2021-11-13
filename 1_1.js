const data = (new function () {
    let int = 0;
    const arr = {};
    this.create = obj => {
        obj.Id = int++;
        arr[obj.Id] = obj;
        return obj;
    }
    this.getAll = () => {
        return Object.values(arr);
    }
    this.get = id => arr[id];
    this.update = obj => {
        arr[obj.Id] = obj;
        return obj;
    }
    this.delete = id => {
        delete arr[id];
    }
});

data.create({
    name: "Dsdsdsd",
    age: "18",
    phone: "+70000000000",
    email: "dssdsd@mail.ru",
    gender: "мужской"
});

const util = new function () {
    this.parse = (tpl, obj) => {
        let str = tpl;
        for (let k in obj) {
            str = str.replaceAll("{" + k + "}", obj[k]);
        }
        return str;
    };
    this.id = el => document.getElementById(el);
    this.q = el => document.querySelectorAll(el);
    this.listen = (el, type, callback) => el.addEventListener(type, callback);
}

const student = new function () {
    this.submit = () => {
        const st = {
            name: util.id("name").value,
            age: util.id("age").value,
            phone: util.id("phone").value,
            email: util.id("email").value,
            gender: util.id("gender").value,
        };
        if(util.id("Id").value == "-1") data.create(st)
        else {
            st.Id = util.id("Id").value;
            data.update(st);
        }
        this.render();
        util.id("edit").style.display = "none"
    }
    this.remove = () => {
        data.delete(activeStudent);
        activeStudent = null;
        this.render()
        util.id("remove").style.display = "none"
    }
    const init = ()=>{
        this.render();
        util.q("button.add1").forEach(el=>{
            util.listen(el, "click",add);
        });
        util.q(".span-close, .close").forEach(el=>{
            util.listen(el, "click", ()=>{
                util.id(el.dataset["id"]).style.display = "none";
            });
        });
        util.q(".submit").forEach(el=>{
            util.listen(el, "click", ()=>{
                this[el.dataset["func"]]();
            });
        });
    };
    const add = () => {
        util.q("#edit .modal-title")[0].innerHTML = "Добавить студента";
        util.q("#edit .submit")[0].innerHTML = "Добавить";
        util.q("#edit form")[0].reset();
        util.id("Id").value = "-1";
        util.id("edit").style.display = "block";
    };
    const edit = el => {
		util.q("#edit .modal-title")[0].innerHTML = "Изменить студента";
        util.q("#edit .submit")[0].innerHTML = "Изменить";
        util.q("#edit form")[0].reset();
        const st = data.get(el.dataset["id"]);
        for(let k in st){
            util.id(k).value = st[k];
        }
        util.id("edit").style.display = "block";
    };
    let activeStudent = null;
    const rm = el => {
        util.id("remove").style.display = "block";
        activeStudent = el.dataset["id"];
    };
    const listeners = {edit: [], rm:[]};
    const clearListener = ()=>{
        listeners.edit.forEach(el=>{
            el.removeEventListener("click",edit);
        });
        listeners.rm.forEach(el=>{
            el.removeEventListener("click",rm);
        });
        listeners.edit = [];
        listeners.rm = [];
    };
    const addListener = ()=>{
        util.q("button.edit").forEach(el=>{
            listeners.edit.push(el);
            util.listen(el, "click", ()=>edit(el));
        });
        util.q("button.rm").forEach(el=>{
            listeners.rm.push(el);
            util.listen(el, "click", ()=>rm(el));
        });
    };
    this.render = () => {
        clearListener()
        util.id("c1").innerHTML = data
            .getAll()
            .map(el => util.parse(tpl, el)).join("");
        addListener();
    };
    const tpl = `
        <tr>
        <td>{name}</td>
        <td>{age}</td>
        <td>{phone}</td>
        <td>{email}</td>
        <td>{gender}</td>
        <td>
            <button class="edit" data-id="{Id}" type="button">Изменить</button>
            <button class="rm" data-id="{Id}" type="button">Удалить</button>
        </td>
        </tr>
    `;
    window.addEventListener("load",init);
}