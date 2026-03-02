#!/usr/bin/env node

/**
 * Studio API Configuration Verifier
 * Run this to verify your R2 and Replicate credentials are working
 */

console.log('🔍 Verifying Studio API Configuration...\n')

// Check environment variables
const requiredVars = {
  'R2_ENDPOINT': process.env.R2_ENDPOINT,
  'R2_ACCESS_KEY_ID': process.env.R2_ACCESS_KEY_ID,
  'R2_SECRET_ACCESS_KEY': process.env.R2_SECRET_ACCESS_KEY,
  'R2_BUCKET_NAME': process.env.R2_BUCKET_NAME,
  'R2_PUBLIC_URL': process.env.R2_PUBLIC_URL,
  'REPLICATE_API_TOKEN': process.env.REPLICATE_API_TOKEN,
}

let missingVars = []
let configuredVars = []

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    missingVars.push(key)
    console.log(`❌ ${key}: NOT SET`)
  } else {
    configuredVars.push(key)
    // Mask sensitive values
    const maskedValue = value.length > 20 
      ? value.substring(0, 20) + '...[MASKED]'
      : '[SET]'
    console.log(`✅ ${key}: ${maskedValue}`)
  }
}

console.log('\n' + '='.repeat(60))

if (missingVars.length === 0) {
  console.log('✅ All environment variables are set!')
  console.log('\n📋 Configuration Summary:')
  console.log(`   - R2 Endpoint: ${process.env.R2_ENDPOINT}`)
  console.log(`   - R2 Bucket: ${process.env.R2_BUCKET_NAME}`)
  console.log(`   - R2 Public URL: ${process.env.R2_PUBLIC_URL}`)
  console.log(`   - Replicate Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 8)}...`)
  console.log('\n🚀 Ready to test the Studio APIs!')
  console.log('\nNext steps:')
  console.log('1. Restart your dev servers (yarn dev)')
  console.log('2. Navigate to http://localhost:8000/us/studio')
  console.log('3. Upload an image and test the full flow')
} else {
  console.log(`❌ Missing ${missingVars.length} environment variable(s):`)
  missingVars.forEach(v => console.log(`   - ${v}`))
  console.log('\n📝 Please add these to your .env.local file')
  console.log('See: studio-docs/API_SETUP_GUIDE.md for instructions')
}

console.log('='.repeat(60))
