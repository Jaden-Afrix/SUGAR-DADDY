/*************************************************
 SUGAR DADDY - OWNER CONTACT SYSTEM v2.0
 SECURE CONTACT MANAGEMENT WITH INTERACTIVE VCARDS
 Owner: ALPHA-BLAKE
**************************************************/

const OWNER_BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

// Owner contact database with security levels
const OWNER_CONTACTS = [
  {
    number: "263784812740",
    name: "ALPHA-BLAKE",
    country: "🇿🇼 Zimbabwe",
    role: "Lead Developer",
    contactHours: "09:00-17:00 GMT+2",
    securityLevel: "VIP",
    description: "For technical issues and business inquiries"
  },
  {
    number: "254780931677",
    name: "ALPHA-BLAKE",
    country: "🇰🇪 Kenya",
    role: "Support Manager",
    contactHours: "08:00-16:00 GMT+3",
    securityLevel: "Standard",
    description: "For user support and feature requests"
  }
];

// Contact request tracker
const contactPath = require('path').join(__dirname, '../lib/contact_requests.json');
let CONTACT_STATS = { requests: 0, lastRequest: '' };

// Load stats
try {
  if (require('fs').existsSync(contactPath)) {
    CONTACT_STATS = JSON.parse(require('fs').readFileSync(contactPath));
  }
} catch (e) {
  console.error('Contact stats error:', e);
}

module.exports = {
  name: "owner",
  alias: ["dev", "creator", "support"],
  category: "core",
  desc: "👑 Contact the bot developers",

  async exec(m, { sock }) {
    // Update stats
    CONTACT_STATS.requests++;
    CONTACT_STATS.lastRequest = new Date().toISOString();
    this.saveStats();
    
    const user = m.pushName || m.sender.split('@')[0];
    
    // Create contact message
    await sock.sendMessage(m.chat, {
      text: `👑 *BOT OWNER CONTACTS*\n
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔒 *Security Notice:*
┃  • Only contact for urgent issues
┃  • Business hours vary by region
┃  • Include your query when messaging
┃  
┃  👇 Select a contact method below
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📊 Contact requested ${CONTACT_STATS.requests} times`,
      
      templateButtons: [
        ...OWNER_CONTACTS.map((contact, index) => ({
          quickReplyButton: {
            displayText: `${contact.country} ${contact.role}`,
            id: `!owner contact ${index}`
          }
        })),
        { quickReplyButton: { displayText: "ℹ️ CONTACT INFO", id: "!owner info" }}
      ],
      
      contextInfo: {
        externalAdReply: {
          title: "👑 OFFICIAL SUPPORT CONTACTS",
          body: "Respect privacy - Contact wisely",
          thumbnailUrl: OWNER_BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: CHANNEL_LINK
        }
      }
    });

    // Add reaction
    await sock.sendMessage(m.chat, {
      react: { text: "👑", key: m.key }
    });
  },

  async handleEvent(m, { sock }) {
    const [action, type, index] = m.message.templateButtonReplyMessage.selectedId.split(' ');
    
    if (action === "!owner" && type === "contact") {
      const contactIndex = parseInt(index);
      if (contactIndex >= 0 && contactIndex < OWNER_CONTACTS.length) {
        const contact = OWNER_CONTACTS[contactIndex];
        return this.sendContactCard(m, sock, contact);
      }
    }
    
    if (action === "!owner" && type === "info") {
      return this.sendContactInfo(m, sock);
    }
  },

  async sendContactCard(m, sock, contact) {
    await sock.sendMessage(m.chat, {
      contacts: {
        displayName: `${contact.name} (${contact.role})`,
        contacts: [{
          displayName: contact.name,
          vcard: `BEGIN:VCARD
VERSION:1.0
FN:${contact.name}
ORG:SUGAR DADDY BOT;
TITLE:${contact.role}
TEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}
NOTE:Security Level: ${contact.securityLevel}\nContact Hours: ${contact.contactHours}\n${contact.description}
END:VCARD`
        }]
      },
      contextInfo: {
        externalAdReply: {
          title: `📞 CONTACT ${contact.name.toUpperCase()}`,
          body: contact.country,
          thumbnailUrl: OWNER_BANNER,
          sourceUrl: CHANNEL_LINK
        }
      }
    });
    
    // Send security reminder
    await sock.sendMessage(m.chat, {
      text: `⚠️ *IMPORTANT REMINDER*\n
• Contact only during ${contact.contactHours}
• Start messages with "SUGAR DADDY: "
• Include your issue details
• Be patient for responses
• Abuse will lead to blocking`
    });
  },

  async sendContactInfo(m, sock) {
    const contactInfo = OWNER_CONTACTS.map(contact => 
      `👤 *${contact.name}* (${contact.role})
📍 ${contact.country}
🕒 ${contact.contactHours}
🔒 ${contact.securityLevel} Access
💬 ${contact.description}`
    ).join("\n\n");

    await sock.sendMessage(m.chat, {
      text: `📇 *CONTACT INFORMATION*\n\n${contactInfo}\n\n` +
            "📌 *Contact Protocol:*\n" +
            "1. Start message with 'SUGAR DADDY: '\n" +
            "2. Include your issue details\n" +
            "3. Send during working hours\n" +
            "4. Wait 24-48 hours for response\n\n" +
            "❗ *Abuse of contacts will result in permanent ban*"
    });
  },

  saveStats() {
    require('fs').writeFileSync(contactPath, JSON.stringify(CONTACT_STATS, null, 2));
  }
};