import api from './api';

const endpoint = '/send-email/';

export default {
    sendEmail(emailData) {
        return api.post(endpoint, emailData)
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to send email: ' + error.message);
            });
    }
};