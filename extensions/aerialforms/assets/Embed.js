function createHTML() {
    const container = document.querySelector(".aerialForms")
    const dataHTML = document.querySelector('.aerialFormsJson')
    const dataJson = JSON.parse(dataHTML.innerHTML)

    let html = `
        <submit-component class="w-full">
            <div class="flex items-center justify-center">
                <h2 class=""> ${dataJson.email} </h2>

                <form class='flex'>
                    <input id="shopID" type="hidden" name="storeId" value="${dataJson.shopId}">
                    <input
                        class=""
                        style="
                        width: 25%;
                        font-size: 20px;
                        font-weight: normal;
                        padding: 10px 10px 10px 10px;
                        margin: 0 10px 0 0;
                        outline: none;
                        box-shadow: none;
                        border-style: solid;
                        border-color: black;
                        border-radius: 5px;
                        "
                        id="submitEmail"
                        type="email"
                        name="email"
                        value="${dataJson.email}"
                        aria-required="true"
                        autocorrect="off"
                        autocapitalize="off"
                        autocomplete="email"
                        placeholder="Enter your email"
                        required
                    >

                    <button class="" style="color: white; background: green; border: none; padding: 10px 15px 10px 15px; border-radius: 5px; cursor: pointer;" type="submit" name="commit" id="Subscribe" aria-label="{{ 'newsletter.button_label' | t }}">Submit</button>            
                    <p id="err" class="hidden" style="color: red">${dataJson.error}</p>

                </form>

                <p id="success" class="hidden" style="color: green">${dataJson.success}</p>

            </div>
        </submit-component>
        `;

    container.innerHTML = html;

}

createHTML()