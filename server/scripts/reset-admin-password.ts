import 'dotenv/config'
import { db } from '../src/db'
import { user, account, userProfiles } from '../src/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function main() {
  const targetEmail = process.argv[2] || 'admin@gatra.com'
  const newPassword = process.argv[3] || 'admin123'

  console.log(`Setting/Resetting password for email: ${targetEmail}`)

  // 1. Find user by email
  let existingUser = await db.query.user.findFirst({
    where: eq(user.email, targetEmail),
  })

  let userId: string

  if (!existingUser) {
    console.log(`User ${targetEmail} not found. Creating user...`)
    userId = crypto.randomUUID()
    await db.insert(user).values({
      id: userId,
      name: 'Admin Gatra',
      email: targetEmail,
      emailVerified: true,
    })

    // Create user profile as super_admin
    await db.insert(userProfiles).values({
      userId: userId,
      role: 'super_admin',
      namaLengkap: 'Administrator Gatra',
      isActive: true,
    })
    console.log(`Created user & profile for ${targetEmail}`)
  } else {
    userId = existingUser.id
    console.log(`Found existing user with ID: ${userId}`)
  }

  // 2. Hash new password using bcrypt
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // 3. Check if account record exists in better-auth `account` table
  const existingAccount = await db.query.account.findFirst({
    where: eq(account.userId, userId),
  })

  if (existingAccount) {
    await db.update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(account.id, existingAccount.id))
    console.log(`Updated password for existing account record.`)
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
    })
    console.log(`Inserted new account record with password.`)
  }

  console.log(`\nSuccess! Password for ${targetEmail} has been set to: ${newPassword}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Error resetting password:', err)
  process.exit(1)
})
