import 'dotenv/config';
import transporter from '../config/email';

const run = async () => {
  try {
    console.log('Verifying email connection...');
    await transporter.verify();
    console.log('Transporter verification succeeded!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: 'Hafizhaideraliuet@gmail.com',
      subject: 'Test email from DivineCraft',
      text: 'Hello, this is a test email!',
    });
    console.log('Test email sent successfully!', info);
  } catch (err) {
    console.error('Test email failed:', err);
  }
};

run();
