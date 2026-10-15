import { Admin } from '../models/admin.model.js';
import { BackgroundJob } from '../models/backgroundJob.model.js';
import { BoardingPass } from '../models/boardingPass.model.js';
import { Certificate } from '../models/certificate.model.js';
import { CertificateBatch } from '../models/certificateBatch.model.js';
import { Contact } from '../models/contact.model.js';
import { CustomQR } from '../models/customQR.model.js';
import { EmailBlocklist } from '../models/emailBlocklist.model.js';
import { Event } from '../models/event.model.js';
import { SystemLog } from '../models/log.model.js';
import { Session } from '../models/session.model.js';
import { StudentRegistration } from '../models/studentRegistration.model.js';
import { SystemSetting } from '../models/systemSetting.model.js';
import { TeamMember } from '../models/teamMember.model.js';
import { Token } from '../models/token.model.js';

/**
 * Production Database Storage Optimizer
 * Synchronizes model indexes with MongoDB to ensure optimal index tree sizes,
 * removes redundant/duplicate indexes, and enforces storage efficiency.
 */
export const optimizeDbIndexes = async () => {
  const models = [
    Admin,
    BackgroundJob,
    BoardingPass,
    Certificate,
    CertificateBatch,
    Contact,
    CustomQR,
    EmailBlocklist,
    Event,
    SystemLog,
    Session,
    StudentRegistration,
    SystemSetting,
    TeamMember,
    Token,
  ];

  for (const model of models) {
    try {
      await model.syncIndexes();
    } catch (err) {
      // Non-fatal warning if connection is still establishing or permission restricted
      console.warn(`[DB Optimizer] Index sync notice for ${model.modelName}:`, err.message);
    }
  }
};
