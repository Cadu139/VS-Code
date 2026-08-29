
let isLoginCardVisible = false
// Inicializa a variável com base na visibilidade inicial do cartão de login

let submit = null
let form_elements = null
// Inicializa as variáveis com base na visibilidade inicial do cartão de login

// Função para alternar entre login e signup
function toggleCard() {
    const loginCard = document.getElementById('login-card')
    const signupCard = document.getElementById('signup-card')

    isLoginCardVisible = !isLoginCardVisible

    submit = document.querySelector(isLoginCardVisible ? '#login-button' : '#signup-button')
    form_elements = document.querySelector(isLoginCardVisible ? '#login-card form' : '#signup-card form')

    loginCard.classList.toggle('hidden', !isLoginCardVisible)
    signupCard.classList.toggle('hidden', isLoginCardVisible)

    loginCard.style.display = ''
    signupCard.style.display = ''
}

// Adiciona event listeners aos links de cadastro e login
document.addEventListener('DOMContentLoaded', function() {

    toggleCard() // Inicializa a visibilidade correta dos cartões

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

    if (submit && form_elements) {
        let attemptedSubmit = false

        const inputs = Array.from(form_elements.elements).filter(el => el.tagName.toLowerCase() === 'input')

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
            submit.classList.remove('safe')
            submit.classList.add('error')
        }

        function setButtonSafe() {
            submit.classList.remove('error')
            submit.classList.add('safe')
        }

        function allInputsValid() {
            return inputs.every(i => i.checkValidity())
        }

        // Anexa os ouvintes em tempo real (input) uma única vez para validar após o primeiro envio
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

        submit.addEventListener('click', function(e) {
            e.preventDefault()
            attemptedSubmit = true

            // Dispara a validação nativa (que definirá :invalid nos campos)
            if (form_elements.checkValidity()) {
                // O formulário é válido: enviar
                form_elements.submit()
                return
            }

            // O formulário é inválido: mostrar erros nos campos inválidos e marcar o botão
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




