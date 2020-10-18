

import '../migdrp-components/migdrp-input';


export class TemarioView extends HTMLElement {



    private css():string { 
		return /*html*/ `

        <style>
        :host{
            width: 100%;
            height: fit-content;
            overflow-y:hidden;
            
        }

    
        #main-content{
            
            text-align:center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

			-webkit-animation: fadein .8s ease forwards;
            -moz-animation: fadein .8s ease forwards; 
            -ms-animation: fadein .8s ease forwards; 
            -o-animation: fadein .8s ease forwards; 
            animation: fadein .8s ease forwards;
        }

        migdrp-input{
            margin: 0px 0 10px 0;
            padding: 0px 0px 0px 0px;
            width:125%;
        }

        #inputs-container{
            padding: 20px 0px;
            margin: 0px 0px;
            width: 65%;
            text-align: center;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 10px;
            align-content: center;
        }

        #server-error{
            width: fit-content;
            padding: 0px 50px;
            margin: 10px 0px;
            background-color: #a92323;
            border-radius: 25px;
            color: #ffffff;
            font-weight: bold;
            box-shadow: 3px 2px 4px 1px rgba(0,0,0,0.4);
			transition: all .3s ease;
            opacity:0;
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

        .input-container{
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
        </style>
        `;
    }


    private html(css:string):string {
        return  /*html*/ `
		${css}


        <div id="main-content">
            <p>Herramienta para el diseño del temario</p>

            <p id="server-error"> ------------ </p>
            


            
			<button id="save-btn" class='oidc-btn'> Save <migdrp-spinner></migdrp-spinner> </button>

        </div>

        

        `;
	}


	
 	private renderTemplate():void{
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
        this.shadowRoot.innerHTML += template;
        
        this.saveBtn = this.shadowRoot.querySelector('#save-btn');

        this.inputAppName = this.shadowRoot.querySelector('#appName');
        this.inputAppSecret = this.shadowRoot.querySelector('#appSecret');

        this.inputUsername =  this.shadowRoot.querySelector('#userName');
        this.inputPassword = this.shadowRoot.querySelector('#userPassword');

        this.inputEmail = this.shadowRoot.querySelector('#email');
        this.inputPhone = this.shadowRoot.querySelector('#phone');

        this.inputFirstName = this.shadowRoot.querySelector('#firstName');
        this.inputLastName = this.shadowRoot.querySelector('#lastName');

        this.inputConfirmSecret = this.shadowRoot.querySelector('#confirmSecret');
        this.inputConfirmPassword = this.shadowRoot.querySelector('#confirmPassword');

        this.saveBtnSpinner = this.shadowRoot.querySelector('migdrp-spinner');
        this.serverError = this.shadowRoot.querySelector('#server-error');



	}


    private initEventListeners(){
		this.saveBtn.addEventListener('click', this.saveBtnPressed());
	}


    private saveBtn:HTMLButtonElement;
    private saveBtnSpinner: MigdrpSpinner;



    private inputAppName:    MigdrpInput;
    private inputAppSecret:  MigdrpInput;

    private inputUsername:   MigdrpInput;
    private inputPassword:   MigdrpInput;

    private inputEmail:      MigdrpInput;
    private inputPhone:      MigdrpInput;

    private inputFirstName:      MigdrpInput;
    private inputLastName:      MigdrpInput;

    private inputConfirmSecret:      MigdrpInput;
    private inputConfirmPassword:      MigdrpInput;

    private serverError: HTMLParagraphElement;


    constructor() {
		super();
        this.renderTemplate();
        this.initEventListeners();

	

    }
    

    
	private saveBtnPressed(){
		const spinner = this.saveBtnSpinner;
        const btn =  this.saveBtn;

        const AppName = this.inputAppName;
        const AppSecret =  this.inputAppSecret;

        const UserName = this.inputUsername;
        const UserPassword = this.inputPassword;

        const FirstName = this.inputFirstName;
        const LastName = this.inputLastName;

        const ConfirmSecret =  this.inputConfirmSecret;
        const ConfirmPassword = this.inputConfirmPassword;

        const email = this.inputEmail;
        const phone = this.inputPhone;

        const ErrorMsg =  this.serverError;


        const InputsArray = [ AppName, AppSecret, UserName, UserPassword, FirstName, LastName, ConfirmSecret, ConfirmPassword, email, phone];



		return () => {
            let invalidInput:MigdrpInput[] = [];


            ErrorMsg.style.padding = '0px 50px';
            ErrorMsg.style.opacity = '0';

            for (var counter = 0; counter < InputsArray.length; counter++){
                InputsArray[counter].removeAttribute('valid');
            }

            console.log("Invalid Inputs: ", invalidInput);


            console.log(InputsArray)
            for (var counter = 0; counter < InputsArray.length; counter++){
                if(InputsArray[counter].input.value === null || InputsArray[counter].input.value === undefined || InputsArray[counter].input.value === '' ){
                    console.log(`Error on ${InputsArray[counter]}`);
                    invalidInput.push(InputsArray[counter]);
                }

            }


            if(ConfirmPassword.input.value !== UserPassword.input.value ){
                console.log('User Password Missmatch');
                invalidInput.push( ConfirmPassword );
                invalidInput.push( UserPassword    );
            }

            if(ConfirmSecret.input.value !== AppSecret.input.value ){
                console.log('App secret Missmatch');
                invalidInput.push( ConfirmSecret );
                invalidInput.push( AppSecret     );
            }







            if (invalidInput.length > 0){
                for(var n = 0; n < invalidInput.length; n++){
                    invalidInput[n].setAttribute('valid', 'false')
                }
                return
            }

            
            for (var counter = 0; counter < InputsArray.length; counter++){
                InputsArray[counter].setAttribute('valid', 'true')
            }
            



			var secureReq = new XMLHttpRequest();
			secureReq.responseType = "json";
			secureReq.open("POST", `/startup`);
            secureReq.setRequestHeader('Content-Type','application/json');
            
            const body = {
                appName:        AppName.input.value,
                appSecret:      AppSecret.input.value,
                userName:       UserName.input.value,
                userPassword:   UserPassword.input.value,
                email:          email.input.value,
                phone:          phone.input.value,
                firstName:      FirstName.input.value,
                lastName:       LastName.input.value
            }

            console.log("Body: ", body)
	
			secureReq.onload = (event) => {
                console.log('Response:' , secureReq.response);

                if(secureReq.response.status === 'ok'){
                    console.log("Succsess")
                    for (var counter = 0; counter < InputsArray.length; counter++){
                        InputsArray[counter].setAttribute('value', '');
    
                    }
                    window.location.replace(secureReq.response.redirect);
                }
                
                if(secureReq.response.status === 'fail'){
                    ErrorMsg.style.padding = '15px 50px';
                    ErrorMsg.style.opacity = '1';
                    ErrorMsg.innerHTML = secureReq.response.message;

                }

                 
                for (var counter = 0; counter < InputsArray.length; counter++){
                    InputsArray[counter].removeAttribute('valid');
                }
                

				spinner.style.opacity = '0';
				btn.disabled = false;
			}
    
            
			secureReq.onerror = (event) => {
                ErrorMsg.style.padding = '15px 50px';
                ErrorMsg.style.opacity = '1';
                console.log("ERROR: ", event);

				
			}
	
			secureReq.send(JSON.stringify(body));
			spinner.style.opacity = '1';
			btn.disabled = true;
		}
			
	
	}

	


}

customElements.define('temario-view', TemarioView);
