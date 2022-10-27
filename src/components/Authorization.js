import {api} from './API.js';
import { Form } from './Form'; 
import {Input} from './Input';
import { loginConfig, registerConfig } from './formConfigs.js';
import { taskBoard } from '../index';

const getLoginForm = (onSuccess) =>{
    return new Form({
        title: 'Login',
        inputs: loginConfig.map((input) => new Input(input)),
        submitButtonText: 'Submit',
        onSubmit: async (data) => {
            await api.login(data);
            onSuccess();
        },
    })
}

const getRegisterForm = (onSuccess) =>{
    return new Form({
        title: 'Register',
        inputs: registerConfig.map((input) => new Input(input)),
        submitButtonText: 'Submit',
        onSubmit: async (data) => {
            await api.register(data);
            onSuccess();
        },
    })
}

export class Auth {
    constructor({appContainer, onLoginSuccess}){
        this.appContainer = appContainer;

        this.formContainer = document.createElement('div');
        this.switchButton = document.createElement('button');
        this.logoutButton = document.createElement('button');
        this.avatar = document.createElement('span');

        this.form = null;
        this.user = null;
        this.isLogin = true;

        this.loginForm = getLoginForm(onLoginSuccess);
        this.registerForm = getRegisterForm(this.switchForms.bind(this));
        

        this.createFormContainer();
        this.createHeaderSettings();
    }

    createFormContainer(){
        this.formContainer.classList.add('authorization');
        this.switchButton.classList.add('button', 'button-text');
        this.switchButton.innerText = 'Register';
        this.formContainer.prepend(this.switchButton);

        this.switchButton.addEventListener('click', () => {
            this.switchForms();
        })
    }

    createHeaderSettings(){
        this.logoutButton.classList.add('button', 'button-text');
        this.logoutButton.innerText = 'Logout';
        this.avatar.classList.add('avatar');

        this.logoutButton.addEventListener('click', () => {
            this.logout();
            api.logout();
            taskBoard.logout();
        });
    }

    
    renderHeaderSettings() {
        const settingsContainer = document.getElementById('header-settings');
        this.avatar.innerText = this.user.name[0];

        settingsContainer.append(this.logoutButton, this.avatar);
    }

    renderAuthForm(){
        if(this.form){
            this.form.form.remove();
        }

        if(this.isLogin){
            this.form = this.loginForm;
        }else{
            this.form = this.registerForm;
        }

        this.form.render(this.formContainer);
        this.appContainer.append(this.formContainer);
        
    }

    switchForms(){
        this.isLogin = !this.isLogin;

        if(this.isLogin){
            this.switchButton.innerText = 'Register';
        }else{
            this.switchButton.innerText = 'Login';
        }

        this.renderAuthForm();
    }

    logout(){
        this.avatar.remove();
        this.logoutButton.remove();
        this.appContainer.innerHTML = '';
        this.isLogin = true;

        this.renderAuthForm();
    }
}




