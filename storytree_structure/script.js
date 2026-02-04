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
    if (buttonLogin) {
        buttonLogin.addEventListener('click', function(e) {
            e.preventDefault()
            const loginForm = document.querySelector('#login-card form')
            if (loginForm) {
                Array.from(loginForm.elements).forEach(element => {
                    if (element.tagName.toLowerCase() === 'input') {
                        const errorSpan = element.nextElementSibling
                        if (!element.checkValidity()) {
                            errorSpan.classList.add('error-warning')
                            errorSpan.textContent = element.validationMessage
                            buttonLogin.classList.add('error')
                        } else {
                            errorSpan.textContent = ''
                            buttonLogin.classList.add('safe')
                        }
                    }
                })
            }
        })
    }
})




