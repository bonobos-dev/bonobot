

class MigAppRoot extends HTMLElement {



    private css():string { 
		return /*html*/ `

        <style>
		:host{
			font-family: 'Quattrocento Sans', sans-serif;
			background-color: var(--migdrp-login-background-color, #fff);
			/*background:var(--migdrp-login-background, linear-gradient(200deg, #84ce29 0%, #56bc43 73%, #32931a 100%));*/
			display:flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			

			-webkit-animation: fadein .8s ease forwards;
            -moz-animation: fadein .8s ease forwards; 
            -ms-animation: fadein .8s ease forwards; 
            -o-animation: fadein .8s ease forwards; 
            animation: fadein .8s ease forwards;
		}
		
	
		
		migdrp-logo{
			width:190px;
            height:190px;
			margin:12% 0 50px 0;
			--migdrp-logo-text-size: 38px !important;
			transition: all .3s ease;

		}

		#welcome-container{
			display:flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			opacity:1;
			height:300px;
		}

		

		
		.oidc-btn{
			width: 140px;
			height: 40px;
			border-radius: 20px;
			background-color: #373737;
			border:none;
			outline: none;
			margin:30px 0 0 0;
			transition: all .3s ease;
			-webkit-box-shadow: 5px 5px 7px -8px rgba(0,0,0,0.8);
			-moz-box-shadow: 5px 5px 7px -8px rgba(0,0,0,0.8);
			box-shadow: 5px 5px 7px -8px rgba(0,0,0,0.8);
			color:#dedede;
			font-weight:bold;
			display:flex;
			padding: 0 5px 0 5px;

			flex-direction:row;
			justify-content: center;
			align-items: center;
			
			



		}

		

		.oidc-btn:hover{
			
			background-color: #6e6e6e;
		}

		.oidc-btn:active{
			transform:scale(1.015);
		}

		.oidc-btn[disabled]{
			background-color: #7c7c7c;
		}

		migdrp-spinner{
			transition:all 0.3s ease;
			position: absolute;
			display:block;
			opacity:0;
			margin: 0px 0px 0 43px;
		}



		#starup-config-container{
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
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
		

		@media (max-width: 1450px) {
		}

		@media (max-width: 1150px) {
		}

		@media (max-width: 700px) {
		}
		
		@media (max-width: 500px) {
		}

        </style>
        `;
    }


    private html(css:string):string {
        return  /*html*/ `
		${css}
		
		<div id='welcome-container'>
		
			<p>Welcome to the Bonobot v1.00</p>
		</div>

		<div id='starup-config-container'>
		</div>

        `;
	}
	
	private renderTemplate():void{
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
		this.shadowRoot.innerHTML += template;
	}


    constructor() {
		super();
		this.renderTemplate();

	

	}

	




}

customElements.define('mig-app-root', MigAppRoot);
