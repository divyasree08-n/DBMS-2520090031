const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/jobportal');
  
  const resumes = await mongoose.connection.collection('resumes').find({}).toArray();
  console.log('=== Resumes Collection (Count: ' + resumes.length + ') ===');
  resumes.forEach((r, idx) => {
    console.log(`[${idx+1}] ID: ${r._id}`);
    console.log(`    CandidateId: ${r.candidateId}`);
    console.log(`    File: ${r.fileName || r.fileUrl}`);
    console.log(`    FileType: ${r.fileType}`);
    console.log(`    Name: ${r.parsedData?.parsedName}`);
    console.log(`    Email: ${r.parsedData?.parsedEmail}`);
    console.log(`    Skills: ${(r.parsedData?.skills || []).join(', ')}`);
    console.log(`    CreatedAt: ${r.createdAt}`);
  });

  const candidates = await mongoose.connection.collection('candidates').find({}).toArray();
  console.log('\n=== Candidates Collection (Count: ' + candidates.length + ') ===');
  candidates.forEach((c, idx) => {
    console.log(`[${idx+1}] ID: ${c._id}`);
    console.log(`    FullName: ${c.fullName}`);
    console.log(`    Email: ${c.email}`);
    console.log(`    PrimaryResumeId: ${c.primaryResumeId}`);
  });

  await mongoose.disconnect();
}

check().catch(console.error);
