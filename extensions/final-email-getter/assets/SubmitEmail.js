const api = new Gadget();


class Submit extends HTMLElement {
    constructor() {
        super()

        const success = this.querySelector('#success');
        const err = this.querySelector('#err');
        const form = this.querySelector("form");
        this.addEventListener("submit", async (e) => {
            e.preventDefault()
            const formData = new FormData(form)
            const email = formData.get("email")
            const currentStoreId = formData.get("storeId")
            
        console.log(formData)

        if(email) {
            success.classList.remove('hidden');
            form.classList.add('hidden')
            err.classList.add('hidden')
        } else {
            err.classList.remove('hidden');
        }
            await saveSelections(currentStoreId, email);
        });

  }
}
customElements.define('submit-component', Submit)


async function saveSelections(currentStoreId, email) {
    
    await api.email.create({
        email: 
            {
                currentStoreId: currentStoreId,    
                submitEmail: email           
            }
    });
}
