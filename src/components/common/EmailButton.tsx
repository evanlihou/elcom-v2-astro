import { useEffect, useState } from "preact/hooks";
import './EmailButton.scss';

type EmailButtonProps = {
  rawEmail: string;
}

function getRandomString(length: number) {
  var randomChars = '0123456789';
  var result = '';
  for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

function EmailButton({rawEmail}: EmailButtonProps) {
  const [email, setEmail] = useState<string>(rawEmail);

  useEffect(() => {setEmail(rawEmail.replace("SPAMGUARD", getRandomString(5)))}, []);

  return (
    <>
      <a href={"mailto:" + email} class="contact">Get in touch</a>
      <span class="contactText">{email}</span>
    </>
  )
}

export default EmailButton;