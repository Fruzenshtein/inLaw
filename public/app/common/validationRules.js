'use strict';
/* Constants */

App.constant('ValidationRules', {
    en: {
        email: {
            identifier: 'email',
            optional: false,
            rules: [
                {
                    type: 'email',
                    prompt: 'Please enter a valid e-mail'
                },
                {
                    type: 'empty',
                    prompt: 'Please enter your email'
                }
            ]
        },
        password: {
            identifier: 'password',
            optional: false,
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter your password'
                },
                {
                    type: 'length[6]',
                    prompt: 'Your password must be at least 6 characters'
                }
            ]
        },
        passwordConfirm: {
            identifier: 'cpassword',
            rules: [{
                type: 'match[password]',
                prompt: 'Password don\'t match'
            }]
        }
    },
    uk: {
        email: {
            identifier: 'email',
            optional: false,
            rules: [
                {
                    type: 'email',
                    prompt: 'Будь-ласка введіть коректну електнонну адресу'
                },
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Вашу електронну адресу'
                }
            ]
        },
        password: {
            identifier: 'password',
            optional: false,
            rules: [
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Ваш пароль'
                },
                {
                    type: 'length[6]',
                    prompt: 'Ваш пароль повинен складатись щонайменш з 6 сімволів'
                }
            ]
        },
        passwordConfirm: {
            identifier: 'cpassword',
            rules: [{
                type: 'match[password]',
                prompt: 'Паролі не співпадають'
            }]
        },
        firstName: {
            identifier: 'firstName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Ім'я повино мати щонайменш 2 символи"
                }
            ]
        },
        lastName: {
            identifier: 'lastName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Призвище повино мати щонайменш 2 символи"
                }
            ]
        },
        middleName: {
            identifier: 'middleName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "По-батькові повино мати щонайменш 2 символи"
                }
            ]
        },
        street: {
            identifier: 'street',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Адреса повина мати щонайменш 2 символи"
                }
            ]
        },
        zip: {
            identifier: 'zip',
            optional: true,
            rules: [
                {
                    type: 'length[5]',
                    prompt: "Поштовий індекс повинен мати не менше 5 символів"
                },
                {
                    type: 'maxLength[5]',
                    prompt: "Поштовий індекс повинен бути не більше 5 символів"
                }
            ]
        },
        facebook: {
            identifier: 'facebook',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Facebook сторінку"
                }
            ]
        },
        twitter: {
            identifier: 'twitter',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Twitter сторінку"
                }
            ]
        },
        linkedin: {
            identifier: 'linkedin',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Linkedin сторінку"
                }
            ]
        },
        website: {
            identifier: 'website',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Web сторінку"
                }
            ]
        },
        emailOptional: {
            identifier: 'optEmail',
            optional: true,
            rules:[
                {
                    type: 'email',
                    prompt: 'Будь-ласка введіть коректну електнонну адресу'
                },
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Вашу електронну адресу'
                }
            ]
        }

    }
});