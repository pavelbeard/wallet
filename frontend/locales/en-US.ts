export default {
    mainPage: {
        title: "Cartera | Main page",
        description: "Keep your secrets in this robust app!",
    },
    mainPageText1: "Your secrets and cards always will be under our security! 🔐",
    mainPageText2: "Fast and Simple. 💨",
    mainPageText3: "Cross platform. 💻📱",
    mainPageText4: "Also it has a telegram bot! 🤖",
    mainPageText5: "Just join us and that's it!",
    mainPageSignIn: "Go to sign in 🔑",
    mainPageSignUp: "Go to sign up 🤝",
    signInPage: {
        title: "Cartera | Sign In",
        description: "Sign in a system.",
    },
    dashboardPage: {
        title: "Cartera | Dashboard",
        description: "Main statistic panel.",
    },
    auth: {
        error: {
            badCredentials: "Bad credentials.",
            serverError: "Authentication error. Something went wrong while auth process...",
            accessDenied: "You lack permission for sign in.",
            unknown: "Contact us if that error persists",
            errorCode: "Error code:"
        },
        success: "The session initiated.",
        validationErrors: {
            failed: "Invalid fields!"
        },
        credentialsTitle: "Sign in with credentials",
        oauth: "Sign in with {provider}",
        signIn: "Sign in",
        signOut: "Sign out",
    },
    ui: {
        emailInput: "Email:",
        passwordInput: "Password:",
    }
} as const;