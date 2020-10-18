import { MigdrpIcon } from './migdrp-icon';



export class MigdrpLogo extends HTMLElement {

    static get observedAttributes() { return ['has-text', 'dark-color', 'text-size']; }

    get hasText() { return this.getAttribute('has-text'); }
    set hasText(newValue) { this.setAttribute('has-text', newValue); }

    
    get textSize() { return this.getAttribute('text-size'); }
    set textSize(newValue) { this.setAttribute('text-size', newValue); }
    
    get darkColor() { return this.getAttribute('dark-color'); }
    set darkColor(newValue) { this.setAttribute('dark-color', newValue); }
   
    attributeChangedCallback(name:string, oldValue:any, newValue:any) {
        switch (name) {
            case 'has-text':
                if(this.hasText === 'true') 
                    this.migdrpText.style.display = 'block';
                else{
                    this.migdrpText.style.display = 'none';
                }
                break;
                
            case 'dark-color':
                if(newValue != oldValue){
                    if((/^#[0-9A-F]{6}$/i.test(newValue))) {
                        this.darkColor = newValue;
                        if(this.migdrpIcon){
                            console.log("Already loaded changing back color..");
                            this.migdrpIcon.setAttribute("style", `--migdrp-icon-circle-color:${this.darkColor};`);
                            this.migdrpText.style.color = this.darkColor;
                            this.setAttribute("style", `--migdrp-logo-loader-darkcolor:${this.darkColor};`)
                        }
                    }
                    else{
                        this.darkColor = '#313131';
                        throw new Error("Invalid dark-color. Please use Hex")
                    }
                }
               
                    
                break;
            
            case 'text-size':
                if(newValue !== oldValue) 
                    this.migdrpText.style.fontSize = newValue
                break;
                
        }
    }

    private css():string { 
        return /*html*/ `
        <style>
            :host{
                display:block;
                margin:0;
                padding:0;
	            font-family: 'Quattrocento Sans', sans-serif;
                justify-content:center;
                align-items:center;
            }


            p{
                margin-top:var(--migdrp-logo-text-mt, -10%);
                font-size:var(--migdrp-logo-text-size, ${this.textSize});
                font-weight: bold;
                text-align: center;
                color:var(--migdrp-logo-text-color, ${this.darkColor}); 
                -webkit-animation: fadein 1s linear forwards;
                -moz-animation: fadein 1s linear forwards; 
                -ms-animation: fadein 1s linear forwards; 
                -o-animation: fadein 1s linear forwards; 
                animation: fadein 1s linear forwards;
            }


            span{
                color:var(--migdrp-logo-g-color, #84ce29);
            }


            migdrp-icon{
                position:relative;
                width:100%;
                height:100%;
                margin:0;
                padding:0;
                --migdrp-icon-circle-color:var(--migdrp-logo-icon-bgcolor, transparent);
            }


            #icon-container{
                width:100%;
                height:100%;
                opacity:0;
                transition:all .8s ease;
            }

            #loader-box{
                height: 80%;
                width: 80%;
                margin: 200% 0px 0 0;
                background-color:#fff;
                border-radius:50%;
                z-index: 2;
            }

            #loader-container{
                width:  100%;
                height: 100%;
                margin-top: -100%;
                padding:0;
                display:flex;
                justify-content:center;
                align-items:center;
                position:relative;
                opacity: 0;
                z-index: 5;
	            transition: all 1s linear;

                -webkit-animation: fadein .5s linear forwards;
                -moz-animation: fadein .5s linear forwards; 
                -ms-animation: fadein .5s linear forwards; 
                -o-animation: fadein .5s linear forwards; 
                animation: fadein .5s linear forwards;


            }

            @keyframes fadein           {  0% { opacity: 0; }   100% { opacity: 1 ; }   }
            @-moz-keyframes fadein      {  0% { opacity: 0; }   100% { opacity: 1 ; }   }
            @-webkit-keyframes fadein   {  0% { opacity: 0; }   100% { opacity: 1 ; }   }
            @-ms-keyframes fadein       {  0% { opacity: 0; }   100% { opacity: 1 ; }   }
            @-o-keyframes fadein        {  0% { opacity: 0; }   100% { opacity: 1 ; }   }

            @keyframes fadeout           {  0% { opacity: 1; }   100% { opacity: 0 ; }   }
            @-moz-keyframes fadeout      {  0% { opacity: 1; }   100% { opacity: 0 ; }   }
            @-webkit-keyframes fadeout   {  0% { opacity: 1; }   100% { opacity: 0 ; }   }
            @-ms-keyframes fadeout       {  0% { opacity: 1; }   100% { opacity: 0 ; }   }
            @-o-keyframes fadeout        {  0% { opacity: 1; }   100% { opacity: 0 ; }   }

            

            #loader{
                width:  100%;
                height: 100%;
                -webkit-animation: spin 1.3s linear infinite;
                        animation: spin 1.3s linear infinite;
            }


            #loader:before{
                content: "";
                position: fixed;
                top: 35%;
                left: 35%;
                right: 35%;
                bottom: 35%;
                border-radius: 50%;
                border: 1.3px solid transparent;
                border-top-color: var(--migdrp-logo-loader-darkcolor, ${this.darkColor});
                -webkit-animation: spin 2s cubic-bezier(0.48, 0.05, 0.46, 0.9) infinite;
                        animation: spin 2s cubic-bezier(0.48, 0.05, 0.46, 0.9) infinite;
            }


            #loader:after{
                content: "";
                position: fixed;
                top: 25%;
                left: 25%;
                right: 25%;
                bottom: 25%;
                border-radius: 50%;
                border: 1px solid transparent;
                border-top-color: #56bc43;
                -webkit-animation: spin 1.5s cubic-bezier(0.48, 0.05, 0.46, 0.9) infinite;
                        animation: spin 1.5s cubic-bezier(0.48, 0.05, 0.46, 0.9) infinite;
            }


            @-webkit-keyframes spin{  
                0%  {  -webkit-transform: rotate(0deg);  -ms-transform: rotate(0deg);  transform: rotate(0deg);  }
                100%{   -webkit-transform: rotate(360deg);  -ms-transform: rotate(360deg);  transform: rotate(360deg);  }
            }

            @-moz-keyframes spin{  
                0%  {  -webkit-transform: rotate(0deg);  -ms-transform: rotate(0deg);  transform: rotate(0deg);  }
                100%{   -webkit-transform: rotate(360deg);  -ms-transform: rotate(360deg);  transform: rotate(360deg);  }
            }

            @-ms-keyframes spin{  
                0%  {  -webkit-transform: rotate(0deg);  -ms-transform: rotate(0deg);  transform: rotate(0deg);  }
                100%{   -webkit-transform: rotate(360deg);  -ms-transform: rotate(360deg);  transform: rotate(360deg);  }
            }

            @-o-keyframes spin{  
                0%  {  -webkit-transform: rotate(0deg);  -ms-transform: rotate(0deg);  transform: rotate(0deg);  }
                100%{   -webkit-transform: rotate(360deg);  -ms-transform: rotate(360deg);  transform: rotate(360deg);  }
            }

            @keyframes spin{  
                0%  {  -webkit-transform: rotate(0deg);  -ms-transform: rotate(0deg);  transform: rotate(0deg);  }
                100%{   -webkit-transform: rotate(360deg);  -ms-transform: rotate(360deg);  transform: rotate(360deg);  }
            }




            

        </style>
        `;
    }

    private html(css:string):string {
        return  /*html*/ `
        
        ${css}
        

        <div id='loader-container'>
            <div id='loader-box'>
                <div id="loader"></div>
            </div>
        </div>

        <div id="icon-container">
        </div>

        <p id="migdrp-text"> mi<span>g</span>drp </p>
        `;
    }

    private initTemplate(): void {
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
        this.shadowRoot.innerHTML += template;

        this.loader =  <HTMLDivElement> this.shadowRoot.getElementById('loader-container');
        this.migdrpText =  <HTMLParagraphElement> this.shadowRoot.getElementById('migdrp-text');
        this.iconContainer =  <HTMLParagraphElement> this.shadowRoot.getElementById('icon-container');

        
        this.migdrpText.style.fontSize =  `${(this.offsetWidth*0.20)}px`;
        this.textSize = `${(this.offsetWidth*0.20)}px`;
      
        //console.log(this.textSize)


    }

    private initEventListeners(){

        let migdrpText =  this.migdrpText;
        let webComponent =  this;

        const resize = () => {
            return () => {
                migdrpText.style.fontSize =  `${(this.offsetWidth*0.20)}px`;
                webComponent.textSize = `${(this.offsetWidth*0.20)}px`;
                
            }
        }

        window.addEventListener('resize', resize());
    }

    private addFonts(): void {
        var fontLink = window.document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css?family=Quattrocento%20Sans";
        fontLink.rel = "stylesheet";

        window.document.getElementsByTagName("head")[0].appendChild(fontLink);
    }

    private loadedObserver(){
        let resolutions = this.loadedResolutions;
        this.loaded = new Promise(function(resolve, reject){
            resolutions.push({resolve: resolve, reject: reject});
        });
    }

    
    private loader:HTMLDivElement;
    private iconContainer:HTMLDivElement;
    private migdrpText:HTMLParagraphElement;
    private migdrpIcon:MigdrpIcon;




    private loadedResolutions = [];

    public loaded:Promise<any>;

  

    public constructor(){
        super();
        
        

        this.initTemplate();
        this.initEventListeners();
        //this.addFonts();    
    

        

    }

    connectedCallback(){

        this.importMigdrpIcon();
        this.loadedObserver();   
    }

    private importMigdrpIcon(){
        //console.log("LoadingContent");
        
        import(/* webpackChunkName:"threejs" , webpackPrefetch:true */ './migdrp-icon').then( module =>{

            setTimeout( () => { 
                this.loader.setAttribute("style", 
                    `-webkit-animation: fadeout .8s linear ; 
                    -moz-animation: fadeout .8s linear ;  
                    -ms-animation: fadeout .8s linear ; 
                    -o-animation: fadeout .8s linear ; 
                    animation: fadeout .8s linear ;`);  
                setTimeout( () => { 
                    this.iconContainer.style.opacity = '1';
                    this.loader.style.display = 'none';  
                }, 1000);
            }, 2000);

            let color = this.darkColor === null ? '#313131' : this.darkColor;
            //console.log("Color:", color)
            let container = this.shadowRoot.getElementById('icon-container');
            container.innerHTML = /*html*/`  <migdrp-icon id="migdrp-icon"></migdrp-icon>      `;

            this.migdrpIcon =  <MigdrpIcon> this.shadowRoot.getElementById('migdrp-icon');
            this.migdrpIcon.setAttribute("style", `--migdrp-icon-circle-color:${color};`);
            //console.log(this.loadedResolutions)
            this.loadedResolutions[0].resolve(true);
            
        });
    }

}

window.customElements.define('migdrp-logo', MigdrpLogo);
