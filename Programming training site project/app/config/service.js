module.exports = {
    recaptcha: {
        client_key: process.env.RECAPTION_CLIENT_KEY,
        secret_key: process.env.RECAPTION_SECRET_KEY,
        options: {
            hl: 'fa'
        }

    },
    google: {
        client_key: process.env.GOOGLE_CLIENT_KEY,
        secret_key: process.env.GOOGLE_SECRET_KEY,
        callback_url: process.env.GOOGLE_CALLBACK_URL


    }
}