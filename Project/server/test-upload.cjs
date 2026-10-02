const fs = require('fs');

async function testUpload() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileContent = 'Varnika Komali\nLead Full Stack Engineer\nEmail: varnika.tech@gmail.com\nPhone: +91 9123456780\nSkills: React, Node.js, TypeScript, AWS, Docker, MongoDB\nExperience: 5 years building scalable web apps\nEducation: B.Tech in CSE';
  
  const payload = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="resume"; filename="Varnika_Komali_FullStack_Resume.txt"',
    'Content-Type: text/plain',
    '',
    fileContent,
    `--${boundary}`,
    'Content-Disposition: form-data; name="user"',
    '',
    JSON.stringify({ name: 'Varnika Komali', email: 'varnika.tech@gmail.com' }),
    `--${boundary}--`,
    ''
  ].join('\r\n');

  const res = await fetch('http://127.0.0.1:5000/api/resumes/upload', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: Buffer.from(payload, 'utf-8')
  });

  const data = await res.json();
  console.log('Upload Status:', res.status);
  console.log('Saved to DB:', data?.data?.savedToDatabase);
  console.log('Filename:', data?.data?.filename);
  console.log('Parsed Profile:', data?.data?.parsedProfile?.name);
}

testUpload().catch(console.error);
