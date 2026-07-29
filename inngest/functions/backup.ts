import { inngest } from '../client';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const databaseBackup = inngest.createFunction(
  { id: 'database-backup' },
  { cron: '0 0 * * *' }, // Run daily at midnight
  async ({ step }) => {
    const backupData = await step.run('extract-database', async () => {
      // Extract data from core models
      const users = await prisma.user.findMany();
      const repositories = await prisma.repository.findMany();
      const reviews = await prisma.review.findMany();

      return {
        timestamp: new Date().toISOString(),
        data: {
          users,
          repositories,
          reviews,
        },
      };
    });

    await step.run('save-backup', async () => {
      const backupDir = path.join(process.cwd(), '.backups');
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const fileName = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const filePath = path.join(backupDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf-8');
      console.log(`[INNGEST] Database backup saved to: ${filePath}`);
    });

    return { success: true, timestamp: backupData.timestamp };
  }
);
