class MigdrpInput extends HTMLElement {

    static get observedAttributes() { return ['type', 'valid', 'placeholder', 'minlenght', 'maxlenght']; }

    get type() { return this.getAttribute('type'); }
    set type(newValue) { this.setAttribute('type', newValue); }

    get valid() { return this.getAttribute('valid'); }
    set valid(newValue) { this.setAttribute('valid', newValue); }

    get minlenght() { return this.getAttribute('minlenght'); }
    set minlenght(newValue) { this.setAttribute('minlenght', newValue); }

    get maxlenght() { return this.getAttribute('maxlenght'); }
    set maxlenght(newValue) { this.setAttribute('maxlenght', newValue); }

    get placeholder() { return this.getAttribute('placeholder'); }
    set placeholder(newValue) { this.setAttribute('placeholder', newValue); }

    attributeChangedCallback(name:string, oldValue:any, newValue:any) {
        switch (name) {
            case 'type':
                if(oldValue != newValue) 
                    this.input.type = newValue;
                else
                    this.input.type = oldValue;
                break;
                
            case 'placeholder':
                if(oldValue != newValue) 
                    this.input.placeholder = newValue;
                else
                    this.input.placeholder = oldValue;
                break;
            case 'valid':
                if(oldValue != newValue) {
                    if(newValue === 'true')
                        this.input.setAttribute('valid', 'true');
                    if(newValue === 'false')
                        this.input.setAttribute('valid', 'false');
                    if(newValue === null || newValue === undefined)
                        this.input.removeAttribute('valid');

                }
                break;
            case 'minlenght':
                if(oldValue != newValue) 
                    this.input.minLength = newValue;
                else
                    this.input.minLength = oldValue;
                break;
            
            case 'maxlenght':
                if(oldValue != newValue) 
                    this.input.maxLength = newValue;
                else
                    this.input.maxLength = oldValue;
                break;

        }
    }

    private css():string { 
		return /*html*/ `
        <style>

        :host{
            width: 100%;
            height: fit-content;
			display:flex;
			flex-direction: column;
			justify-content: center;
			align-items: center; 
        }

        input[type='text'],input[type='password'],input[type='number'],input[type='date'],input[type='datetime-local'],input[type='email'],input[type='month'],input[type='search'],input[type='tel'],input[type='time'],input[type='url'],input[type='week']{
            width: 60%;
            height: 40px;
            background-color:var(--migdrp-input-background-color, #f3f3f3);
            border-radius: 15px;
            border-color:transparent;
            border:none;
            -webkit-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.2);
            -moz-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.2);
            box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.2);

        }

        input:hover[type='text'],input:hover[type='password'],input:hover[type='number'],input:hover[type='date'],input:hover[type='datetime-local'],input:hover[type='email'],input:hover[type='month'],input:hover[type='search'],input:hover[type='tel'],input:hover[type='time'],input:hover[type='url'],input:hover[type='week']{
            -webkit-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.4);
            -moz-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.4);
            box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.4);
        }
            
        input{
            text-align: center;
            color: #373737;
            font-size: 13px;
            font-weight: bold;
            transition:all .3s ease;  
        }

        

        input:active[type='text'],input:active[type='password'],input:active[type='number'],input:active[type='date'],input:active[type='datetime-local'],input:active[type='email'],input:active[type='month'],input:active[type='search'],input:active[type='tel'],input:active[type='time'],input:active[type='url'],input:active[type='week']{
            -webkit-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
            -moz-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
            box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
        }

        input:focus-within[type='text'],input:focus-within[type='password'],input:focus-within[type='number'],input:focus-within[type='date'],input:focus-within[type='datetime-local'],input:focus-within[type='email'],input:focus-within[type='month'],input:focus-within[type='search'],input:focus-within[type='tel'],input:focus-within[type='time'],input:focus-within[type='url'],input:focus-within[type='week']{
            -webkit-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
            -moz-box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
            box-shadow: inset 1px 1px 4px 2px rgba(0,0,0,0.35);
        }

        input:focus[type='text'],input:focus[type='password'],input:focus[type='number'],input:focus[type='date'],input:focus[type='datetime-local'],input:focus[type='email'],input:focus[type='month'],input:focus[type='search'],input:focus[type='tel'],input:focus[type='time'],input:focus[type='url'],input:focus[type='week']{
            outline: none;
        }

        input[valid="true"]{
            background-color:var(--migdrp-input-background-color, rgba(132, 206, 41,.15));
        }

        input[valid="false"]{
            background-color:var(--migdrp-input-background-color, rgba(206, 77, 41,.15));
        }

        input::-webkit-calendar-picker-indicator {
            margin:0 10px 0 -25px;
        }

        input::-webkit-inner-spin-button {
            margin:0 10px 0 -25px;
        }
        
        input::-webkit-search-cancel-button {
            -webkit-appearance: none;
        }

        input::-ms-reveal{
            margin:0 10px 0 -30px;
        }
        
        

        

        


        
        
            
            
        </style>
        `;
    }
    
    private html(css:string):string {
        return  /*html*/ `
		${css}
		<input id="inputElement" type="text">

        
        
        `;
    }
    
    private renderTemplate():void{
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
        this.shadowRoot.innerHTML += template;
        this.input = this.shadowRoot.querySelector("#inputElement");
    }
    
    public input:HTMLInputElement;

    public constructor(){
        super();
        this.renderTemplate();
    }
}

customElements.define('migdrp-input', MigdrpInput);