export default {
    mainPage: {
        title: "Cartera | Inicio",
        description: "Guárdate tus secretos en esta app robusta!",
    },
    mainPageText1: "Tus secretos y tarjetas siempre estarán bajo de nuestra seguridad! 🔐",
    mainPageText2: "Rápido y Simplemente. 💨",
    mainPageText3: "Cross platform. 💻📱",
    mainPageText4: "También tiene un bot de telegram! 🤖",
    mainPageText5: "Solo unéte y ya está!",
    mainPageSignIn: "Ir a iniciar sesión 🔑",
    mainPageSignUp: "Ir a inscribirte 🤝",
    signInPage: {
        title: "Cartera | Iniciar sesión",
        description: "Entrar en una sistema.",
    },
    dashboardPage: {
        title: "Cartera | Dashboard",
        description: "Panel de estadística.",
    },
    auth: {
        error: {
            badCredentials: "Mal credenciales.",
            serverError: "Falla de autenticación. Algo ha pasado mal mientras del proceso de autenticación...",
            accessDenied: "Se le falta permiso para entrar a sistema.",
            // configuration: "Falla de autenticación. Algo ha pasado mal mientras del proceso de autenticación...",
            // configuration: "Falla de autenticación. Algo ha pasado mal mientras del proceso de autenticación...",
            // configuration: "Falla de autenticación. Algo ha pasado mal mientras del proceso de autenticación...",
            unknown: "Contáctanos si esa falla repetirá más",
            errorCode: "Código de falla:"
        },
        success: "La sesión iniciada con éxito.",
        validationErrors: {
            failed: "Campos están invalides!"
        },
        credentialsTitle: "Iniciar sesión con credenciales",
        oauth: "Iniciar sesión con {provider}",
        signIn: "Iniciar sesión",
        signOut: "Cerrar sesión",
    },
    ui: {
        emailInput: "Correo electrónico:",
        passwordInput: "Contraseña:"
    }
} as const;