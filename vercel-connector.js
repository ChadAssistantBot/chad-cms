import fetch from 'node-fetch'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') })

const vercelToken = process.env.VERCEL_ACCESS_TOKEN

async function getDeployments() {
  if (!vercelToken) {
    console.error('Missing VERCEL_ACCESS_TOKEN in .env')
    return
  }

  try {
    const response = await fetch('https://api.vercel.com/v6/deployments', {
      headers: {
        'Authorization': `Bearer ${vercelToken}`
      }
    })
    const data = await response.json()
    console.log('Vercel Deployments:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error fetching Vercel deployments:', error.message)
  }
}

getDeployments()
