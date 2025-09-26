// Placeholder email service with functions for future provider integration
export async function sendWelcomeEmail(to, name) {
  // eslint-disable-next-line no-console
  console.log(`[EMAIL] Welcome -> ${to} | Hi ${name}`)
}

export async function sendPeerReviewRequest(to, fromName) {
  // eslint-disable-next-line no-console
  console.log(`[EMAIL] Peer Review Request -> ${to} from ${fromName}`)
}

export async function sendReviewCompletion(to) {
  // eslint-disable-next-line no-console
  console.log(`[EMAIL] Review Completed -> ${to}`)
}

export async function sendWeeklySummary(to) {
  // eslint-disable-next-line no-console
  console.log(`[EMAIL] Weekly Summary -> ${to}`)
}

export async function sendSkillMilestone(to, skill) {
  // eslint-disable-next-line no-console
  console.log(`[EMAIL] Skill Milestone -> ${to} | ${skill}`)
}

