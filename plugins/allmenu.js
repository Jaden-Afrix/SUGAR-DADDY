/***********************************************
 💎 SUGAR DADDY MINI — COMMANDS INTERFACE 💎
 Stylish categorized menu for elite usage
 Owner: ALPHA-BLAKE
************************************************/

const AUDIO = "https://files.catbox.moe/cebgdf.mp3";
const BANNER = "https://i.ibb.co/4RfnHtVr/SulaMd.jpg";
const CHANNEL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

module.exports = {
  name: "allmenu",
  alias: ["cmds", "menu", "all"],
  category: "main",
  desc: "✨ Stylish full menu listing",
  
  async exec(m, { sock, prefix }) {
    const text = `╭───❖ *『 𝑺𝑼𝑮𝑨𝑹 𝑫𝑨𝑫𝑫𝒀 𝑴𝑰𝑵𝑰 』* ❖───╮
│ 👑 *Owner:* ${m.sender.split("@")[0]}
│ 🧩 *Prefix:* ${prefix}
│ 📦 *Cmds:* Type one by one
│ ⏱️ *Uptime:* Auto
│ ⚙️ *Runtime:* Stable v1.0
╰─────────────────────────────╯

╭─『 🔐 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}block
│ ${prefix}unblock
│ ${prefix}private
│ ${prefix}public
│ ${prefix}autoreact
│ ${prefix}autotyping
│ ${prefix}join
│ ${prefix}leave
│ ${prefix}unlock
╰────────────────────╯

╭─『 👥 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}antitag
│ ${prefix}join
│ ${prefix}leave
│ ${prefix}tag
│ ${prefix}tagall
│ ${prefix}promote
│ ${prefix}kick
│ ${prefix}demote
│ ${prefix}antilink
╰────────────────────╯

╭─『 📦 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}apk
│ ${prefix}play
│ ${prefix}video
│ ${prefix}mediafire
│ ${prefix}playdoc
│ ${prefix}img
╰────────────────────╯

╭─『 🤖 𝐀𝐈 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}gpt
│ ${prefix}daddy
│ ${prefix}deepseek
╰────────────────────╯

╭─『 🎮 𝐆𝐀𝐌𝐄 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}truth
│ ${prefix}dare
│ ${prefix}tictactoe
╰────────────────────╯

╭─『 🧾 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}channel
│ ${prefix}details
│ ${prefix}owner
│ ${prefix}ping
│ ${prefix}repo
│ ${prefix}uptime
╰────────────────────╯

╭─『 📣 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 』─╮
│ ${prefix}whatsappchannel
│ ${prefix}youtubechannel
╰────────────────────╯

╭─『 💣 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 』─╮
│ ${prefix}bug
│ ${prefix}bugx
│ ${prefix}xbulk
╰────────────────────╯

╭─『 🔞 𝐀𝐃𝐔𝐋𝐓 』─╮
│ ${prefix}xvideo
│ ${prefix}hetai
╰────────────────────╯

╭─『 🆘 𝐒𝐔𝐏𝐏𝐎𝐑𝐓 』─╮
│ ${prefix}support
╰────────────────────╯

📡 *Channel:* ${CHANNEL}
*🎙️ Powered by ALPHA-BLAKE*
`;
    
    await sock.sendMessage(m.chat, {
      text,
      contextInfo: {
        externalAdReply: {
          title: "💎 SUGAR DADDY MINI",
          body: "Stylish AI & Utility Bot",
          thumbnailUrl: BANNER,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: CHANNEL,
        },
      },
    });
    
    await sock.sendMessage(m.chat, {
      audio: { url: AUDIO },
      mimetype: "audio/mp4",
      ptt: true,
    });
  },
};