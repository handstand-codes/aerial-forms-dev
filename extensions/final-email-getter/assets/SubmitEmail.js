const api = new Gadget();


class Submit extends HTMLElement {
    constructor() {
        super()
        this.form = this.querySelector("form");
        this.form.addEventListener("submit", onSubmitHandler);
        
    }
}
customElements.define('submit-component', Submit)


async function onSubmitHandler(event) {
    event.preventDefault();
  
    const email = document.getElementById("submitEmail").value;
    console.log(email)
    await saveSelections(email);
}


async function saveSelections(email) {
    
    await api.email.create({
        email: 
            {
            submitEmail: email,             
            }
    });
}






