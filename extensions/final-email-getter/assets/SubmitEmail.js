const api = new Gadget();


class Submit extends HTMLElement {
    constructor() {
        super()

        const form = this.querySelector("form");
        this.addEventListener("submit", async (e) => {
            e.preventDefault()
            const formData = new FormData(form)
            const email = formData.get("email")
            const currentStoreId = formData.get("storeId")
            if(this.form.posted_successfully == true) {
                console.log("WORKS")
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
