
class MigdrpSpinner extends HTMLElement {

    private css():string { 
		return /*html*/ `
        <style>

        .spinner {
            /* Spinner size and color */
            width: 1.5rem;
            height: 1.5rem;
            border-top-color: #ffffff;
            border-left-color: #ffffff;

            /* Additional spinner styles */
            animation: spinner 400ms linear infinite;
            border-bottom-color: transparent;
            border-right-color: transparent;
            border-style: solid;
            border-width: 2px;
            border-radius: 50%;  
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
        }

        /* Animation styles */
        @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }


        </style>
        `;
    }
    

    private html(css:string):string {
        return  /*html*/ `
		${css}
		<span class="spinner"></span>

        
        
        `;
    }

    private renderTemplate():void{
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
        this.shadowRoot.innerHTML += template;
        this.span = this.shadowRoot.querySelector('span');
    }
    
    private span: HTMLSpanElement;

    public constructor (){
        super();
        this.renderTemplate();
    }
}
customElements.define('migdrp-spinner', MigdrpSpinner);

