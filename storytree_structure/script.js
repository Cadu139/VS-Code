// Função para alternar entre login e signup
function toggleCard() {
    const loginCard = document.getElementById('login-card')
    const signupCard = document.getElementById('signup-card')
    
    // Alterna a visibilidade dos cards
    loginCard.style.display = loginCard.style.display === 'none' ? 'block' : 'none'
    signupCard.style.display = signupCard.style.display === 'none' ? 'block' : 'none'
}

// Adiciona event listeners aos links de cadastro e login
document.addEventListener('DOMContentLoaded', function() {
    // Link para cadastro
    const signupLink = document.getElementById('signup-link')
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault()
            toggleCard()
        })
    }
    
    // Link para voltar ao login
    const loginLink = document.getElementById('login-link')
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault()
            toggleCard()
        })
    }

    const buttonLogin = document.querySelector('#login-button')
    const loginForm = document.querySelector('#login-card form')
    if (buttonLogin && loginForm) {
        let attemptedSubmit = false

        const inputs = Array.from(loginForm.elements).filter(el => el.tagName.toLowerCase() === 'input')

        function showError(input) {
            const errorSpan = input.nextElementSibling
            if (!errorSpan) return
            errorSpan.classList.add('error-warning')
            errorSpan.classList.add('shake')
            errorSpan.textContent = input.validationMessage
        }

        function hideError(input) {
            const errorSpan = input.nextElementSibling
            if (!errorSpan) return
            errorSpan.classList.remove('error-warning')
            errorSpan.classList.remove('shake')
            errorSpan.textContent = ''
        }

        function setButtonError() {
            buttonLogin.classList.remove('safe')
            buttonLogin.classList.add('error')
        }

        function setButtonSafe() {
            buttonLogin.classList.remove('error')
            buttonLogin.classList.add('safe')
        }

        function allInputsValid() {
            return inputs.every(i => i.checkValidity())
        }

        // Attach realtime (input) listeners once to validate after first submit
        inputs.forEach(input => {
            if (input.dataset.hasRealtimeListener) return
            input.addEventListener('input', function() {
                if (!attemptedSubmit) return
                if (!input.checkValidity()) {
                    showError(input)
                    setButtonError()
                } else {
                    hideError(input)
                    if (allInputsValid()) setButtonSafe()
                }
            })
            input.dataset.hasRealtimeListener = 'true'
        })

        buttonLogin.addEventListener('click', function(e) {
            e.preventDefault()
            attemptedSubmit = true

            // Trigger native validation (will set :invalid on fields)
            if (loginForm.checkValidity()) {
                // form is valid: submit
                loginForm.submit()
                return
            }

            // form invalid: show errors for invalid inputs and mark button
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    showError(input)
                } else {
                    hideError(input)
                }
            })
            setButtonError()
        })
    }
})




