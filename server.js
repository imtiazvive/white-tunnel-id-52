const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 6 Boys (Romantic & Flirty Classmates)
const romanticBoys = [
  "Shakib Al Hasan", "Tanvir Ahmed", "Rakib Hasan", 
  "Farhan Sadik", "Mahbubur Rahman", "Zahid Hasan"
];

// 54 Female contacts
const femaleNames = [
  "Nusrat Jahan", "Sadia Afrin", "Ayesha Siddiqua", "Tanjina Akter", "Sumaiya Islam",
  "Jannat", "Samia Rahman", "Mim Akter", "Tasnim Sultana", "Jannatul Ferdous",
  "Nafisa Anjum", "Lamia Hasan", "Fatema Tuz Zohra", "Sabrina Mostafa", "Mehjabin Chowdhury",
  "Riya Akter", "Sanjida Islam", "Anika Tabassum", "Sharmin Sultana", "Humaira Kabir",
  "Tahmina Akter", "Zarin Subah", "Naznin Akter", "Fariha Mehzabin", "Israt Jahan",
  "Umme Kulsum", "Nowshin Tarannum", "Bristy Roy", "Puja Das", "Mouly Roy",
  "Aditi Sharma", "Tanushree Pal", "Suborna Paul", "Shraboni Sen", "Laboni Akter",
  "Rubina Yasmin", "Shampa Khatun", "Mahfuza Akter", "Afroza Parvin", "Khadija Begum",
  "Salma Sultana", "Halima Sadia", "Nasrin Jahan", "Shamima Nasrin", "Dilruba Yeasmin",
  "Marufa Akter", "Shirin Sultana", "Bilkis Banu", "Rokeya Begum", "Hasna Hena",
  "Lutfun Nahar", "Shahana Parvin", "Jesmin Akter", "Kohinur Akter"
];

// 15 Groups
const groupTitles = [
  "3 Shundori🌸",
  "Presentation Group 4 (Final)",
  "Midterm Survival Squad",
  "Ammu jante parle khun korbe 🤫",
  "Fuchka Lovers Chittagong",
  "Class Bunk Committeeee",
  "Late Warriors",
  "BFFs Forever 💕",
  "Hostel 402 Pera & Gossips ☕",
  "Assignment Deadline Rona-Zari 😭",
  "Shopping & Sale Hunterzzz 🛍️",
  "Crush & Heartbreak Dept 💔",
  "Campus Adda & Tea Squad ☕",
  "Last Minute Study Group 💀",
  "Tour Plan (Jeta kokhono hobe na) 🏖️"
];

// Global Set for 100% Unique Texts across the ENTIRE system
const usedTexts = new Set();

function getUniqueText(baseGenerator) {
  let attempt = 0;
  let text = baseGenerator(attempt);
  while (usedTexts.has(text)) {
    attempt++;
    text = baseGenerator(attempt);
  }
  usedTexts.add(text);
  return text;
}

// Romantic Boy Topics & Templates (Campus Flirting, Late Night, Blue Kurti, Rain, Jealousy)
const boyDialogues = [
  // Theme 1: Blue kurti / compliments
  [
    (b, m, a) => `ajke class e tomai blue kurti te eto shundor lagtesilo ki bolbo ${b}${a ? ' ' + a : ''}`,
    (b, m, a) => `dhurr ki je bolo na shobar shamne oivabe takayshile keno shobai notice korse${a ? ' ' + a : ''}`,
    (b, m, a) => `takabo na mane? amr mon cheyeche tai takaisi tate karo ki?${a ? ' ' + a : ''}`,
    (b, m, a) => `shanto thamo bashay ashe text dio ekhon ammu room e ashe${a ? ' ' + a : ''}`
  ],
  // Theme 2: Late night study & caring
  [
    (b, m, a) => `raat 1:30 baje ekhono ghumao nai keno pagli tumi?${a ? ' ' + a : ''}`,
    (b, m, a) => `midterm er presentation slide banacchi tui ekhono jege keno?${a ? ' ' + a : ''}`,
    (b, m, a) => `tor kotha mone porlo tai bhablam ektu khobor niye dekhi${a ? ' ' + a : ''}`,
    (b, m, a) => `eto joton keno amr jonno boloto? slide ta ektu check koira dio kalke${a ? ' ' + a : ''}`
  ],
  // Theme 3: Cafeteria meetup & chocolate
  [
    (b, m, a) => `kalke bikel e cafeteria r piche ashba 5 min er jonno ektu?${a ? ' ' + a : ''}`,
    (b, m, a) => `keu dekhe felle baje kotha bolbe amr bhoy kore shotti bolte${a ? ' ' + a : ''}`,
    (b, m, a) => `keu dekhbe na ami tor pochonder kitkat chocolate ta kine rakhsi${a ? ' ' + a : ''}`,
    (b, m, a) => `acha thik ache shudhu 5 min er jonno kintu tarpor class e jabo${a ? ' ' + a : ''}`
  ],
  // Theme 4: Jealousy over other classmates
  [
    (b, m, a) => `oi cheletar sathe bench e boshe eto hashi mukhe ki kotha boltasili?${a ? ' ' + a : ''}`,
    (b, m, a) => `areh o to shudhu class note chaitasilo tui jealous hocchish keno pagol?${a ? ' ' + a : ''}`,
    (b, m, a) => `hae jealous hocchi karon tor ei hashi ta shudhu amr jonno reserved bujhli?${a ? ' ' + a : ''}`,
    (b, m, a) => `hahaha boro bhabuk kothakar shudhu tor jonno-i shob kisu thakbe khushi?${a ? ' ' + a : ''}`
  ],
  // Theme 5: Rainy day romantic talk
  [
    (b, m, a) => `chittagong e brishti shuru hoise ekhon tor hath dhore rickshaw te ghura uchit chilo${a ? ' ' + a : ''}`,
    (b, m, a) => `amio shetai bhabtesilam re brishtite bhije abar thanda lagay felba tui${a ? ' ' + a : ''}`,
    (b, m, a) => `thanda laguk tor pashe thakle shob thik hoye jabe kono oshubidha nai${a ? ' ' + a : ''}`,
    (b, m, a) => `eto romantic dialouge kothay shikho boloto class e to bhalo shadhur moto thako${a ? ' ' + a : ''}`
  ],
  // Theme 6: Holding hands & eye contact in library
  [
    (b, m, a) => `library r corner table e jokhon hath ta dhorsilam kemon lagtesilo?${a ? ' ' + a : ''}`,
    (b, m, a) => `amr heart beat 180 te chole gesilo librarian dekhe felle ki hoito bhabso?${a ? ' ' + a : ''}`,
    (b, m, a) => `librarian boi porte besto chilo ami shudhu tor chokhe takay chilam${a ? ' ' + a : ''}`,
    (b, m, a) => `tui ekta shotti pagol ekhon porashona kor kalke exam${a ? ' ' + a : ''}`
  ]
];

// Generate exactly 300 unique messages for each boy
function generateBoyMessages(boyName, boyIndex) {
  const messages = [];
  const baseTime = new Date(Date.now() - 300 * 60000);

  for (let m = 1; m <= 300; m++) {
    const isMe = (m % 2 === 0);
    const msgTime = new Date(baseTime.getTime() + m * 60000);
    const timeFormatted = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const themeIndex = ((m - 1) / 4 | 0) % boyDialogues.length;
    const stepInTheme = (m - 1) % 4;
    const dialogueFn = boyDialogues[themeIndex][stepInTheme];

    const rawGen = (attempt) => {
      let t = dialogueFn(boyName, m, attempt);
      if (attempt > 0) t += ` [${boyIndex + 1}-${m}]`;
      return t;
    };

    const uniqueText = getUniqueText(rawGen);

    messages.push({
      id: `msg_boy_${boyIndex + 1}_${m}`,
      sender: isMe ? 'me' : 'user',
      senderName: isMe ? 'You' : boyName,
      text: uniqueText,
      type: 'text',
      time: timeFormatted,
      timestamp: msgTime.toISOString()
    });
  }

  return messages;
}

// Girl & Group Scenario Datasets
const groupDialoguePool = [
  "kire keu ki doc file ta open korsis?",
  "amr ekhaneopen e hocceiii na bahiiii",
  "wait ami abar drive link pathacchiwait...",
  "keu introduction part ta likhba na? shob ki amarei kora lagbe bhai ajob :')",
  "ami conclusion r references part ta kortesiii to bhai tmr taekane daw",
  "bhai tanjina koi? or e toh methodology likhar kotha chilo",
  "arey ami matro bashay ashlam re!! 10 min de ami boshtesi laptop eee bro",
  "tara tari kor 11:59 te portal bondho hoye jabe bahiii",
  "sir kintu last date extend korbe na clear bole dise oita matai raka lagbe dekio sobai",
  "tension nish na ami adha ghontay shesh kore upload dibo inshallahh",
  "kalke shokal 8 tar lab e ke ke jabi?",
  "ami parbo na bhai, eto shokale ghum thekei utha jay na",
  "pagol hoye gesis naki bhai? sir bolse kalke na thakle 5 marks direct kat korbeee",
  "ekjon amr attendance ta diye dis na pleasee amr jor sorile🥺",
  "sir mukher dike takay attendance nay tui janish na ze dhora khaile sbai morbo",
  "mim aisa por kalke ekdine ki r hobe",
  "daika dis tailee amake 7 tay mera jan gooood night :')",
  "oii shon na ekta jinis dekhbi?",
  "ki re ki hoise boool",
  "ki abar crush re dekhsisss naki 🙈",
  "haaea lab e ajke black shirt pore ashchilo! eto cute lagtesilo ki bolbo 🙈",
  "tui shudhu dur theke dekhishetaree bhai ekbar kotha bolish na keno?",
  "amr shorom kore bhai kemon jani nervous lage",
  "dur bal kal ami ore giye bolbo naki 'bhaiya amr friend apnare pochondo kore' 😂",
  "khobordar oita korish na boin maf cai ami morbo taile shotti!",
  "amr mejaj pura gorom hoye ache ajke",
  "keno re ammu abar boka dise bal",
  "ar bolish na... shokal 9 tay ghum theke uthsi dekhe wifi off kore rakhse",
  "lol shob ammur ek-i dialogue mobile e shob noshto kortese",
  "boltese porashona nai shara din phone niye boshe thakish :')",
  "amader bashayo same re, ektu free thakte dey na manush re",
  "bikel e ber hobi? fuchka kheye mon bhalo kore asi chol",
  "fast er shari kobe kinbi tora?",
  "ami ammor tai porbo bhai",
  "new market jabi kalke? okhane kom e pawa jabe",
  "ha bikel 4 tay jabo shobai eksathe",
  "black ba maroon shade kinbo ami toder color ki bhai",
  "ami pastel green kinbo vabtesiarki matching earrings o lagbe"
];

const directGirlPool = [
  "dost shon or sathe abar jhogra hoise",
  "ami shokal theke call disi reply dey nai",
  "ekhon boltese bondhuder sathe adda dicchilo",
  "eto attitude ami r shoijjo korte partesi na shotti :'",
  "ami ki ar text dibo naki ignore marbo bol to",
  "thak ami r kotha-i bolbo na koyek din dekhuk kemon lage",
  "tui ki chapter 3 pora shuru korsis?",
  "amr kisu-i mathay dhuktese na formula gula eto kothin",
  "kalke ki ki ashbe sir je suggestion dilo oita ache tor kache?",
  "please pic ta tule patha to ektu, ami pura blank boshe asi",
  "ajke raat e je ki porbo bujhtesi na ghum dhorse",
  "bhai ekta hashi-r kotha shunbi 😂",
  "ajke class e sir jokhon question jigesh korse ami shobar shamne ulta palta answer disi bhai",
  "puro class eksathe hashi dise amr mukher dike takay",
  "ami shorome kothay jabo khuje pacchilam na lol",
  "tui chilis na dekhe miss korsis shera drama hoise",
  "kire assignment er slide gula banano hoise tor?",
  "amr part ami sesh korsi tui tor ta drive e upload de",
  "prottek bar tui deri korish pore group er shobai pera khay",
  "na bhai ajke raat 10 tar moddhei shob ready kore rakhbo chill",
  "majhe majhe eto tired lage shob kisu niye...",
  "career porashona ki je hocche kisu bujhte partesi na",
  "ammu o shob shomoy comparison kore onnoder sathe",
  "tui chara ar kauke egula bolteo pari na bujhis-i toh",
  "thnk u re shob shomoy shathe thakar jonno 💕",
  "or phone kalke 1 ghonta busy chilo raat 1 tay",
  "amr kemon jani suspicious lagtese kotha barta",
  "bikel e chittagong stadium er pashe fuchka khabi chol",
  "tailor ta amr blouse er fitting puro nosto kore dise",
  "ajke brishti hocche campus e jete eccha kortese na ekdom"
];

function generateGirlOrGroupMessages(id, name, isGroup, chatIndex, totalMsg = 400) {
  const messages = [];
  const baseTime = new Date(Date.now() - totalMsg * 50000);
  const pool = isGroup ? groupDialoguePool : directGirlPool;

  for (let m = 1; m <= totalMsg; m++) {
    const isMe = (m % 3 === 0);
    const msgTime = new Date(baseTime.getTime() + m * 50000);
    const timeFormatted = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const baseText = pool[(m + chatIndex) % pool.length];

    const rawGen = (attempt) => {
      let t = baseText;
      if (attempt > 0 || usedTexts.has(t)) {
        t = `${baseText} (${chatIndex + 1}-${m}${attempt ? '-' + attempt : ''})`;
      }
      return t;
    };

    const uniqueText = getUniqueText(rawGen);

    messages.push({
      id: `msg_${id}_${m}`,
      sender: isMe ? 'me' : 'user',
      senderName: isMe ? 'You' : name,
      text: uniqueText,
      type: 'text',
      time: timeFormatted,
      timestamp: msgTime.toISOString()
    });
  }

  return messages;
}

console.log("Generating 75 accounts (15 Groups, 6 Romantic Boys with 300 msgs, 54 Girls with 400 msgs)...");

const usersData = [];

// 1. 15 Groups
for (let g = 0; g < 15; g++) {
  const id = `group_${g + 1}`;
  const name = groupTitles[g];
  const members = [
    femaleNames[(g * 2) % femaleNames.length],
    femaleNames[(g * 2 + 1) % femaleNames.length],
    femaleNames[(g * 2 + 2) % femaleNames.length],
    "You"
  ];
  const messages = generateGirlOrGroupMessages(id, name, true, g, 400);
  const lastMsg = messages[messages.length - 1];

  usersData.push({
    id,
    isGroup: true,
    name,
    category: "group",
    members,
    avatar: null,
    status: "online",
    lastSeen: "Today at " + lastMsg.time,
    unreadCount: (g * 2) % 4,
    totalMessagesCount: messages.length,
    lastMessage: { text: lastMsg.text, time: lastMsg.time, timestamp: lastMsg.timestamp },
    messages
  });
}

// 2. 6 Romantic Boys (300 messages each, guaranteed unique)
for (let b = 0; b < 6; b++) {
  const id = `boy_${b + 1}`;
  const name = romanticBoys[b];
  const messages = generateBoyMessages(name, b);
  const lastMsg = messages[messages.length - 1];

  usersData.push({
    id,
    isGroup: false,
    name,
    category: "boy",
    gender: "male",
    phone: `+880 17${String(18000000 + b * 234567).slice(0, 8)}`,
    avatar: null,
    status: b % 2 === 0 ? "online" : "offline",
    lastSeen: b % 2 === 0 ? "Online" : "Today at " + lastMsg.time,
    unreadCount: (b + 1),
    totalMessagesCount: messages.length,
    lastMessage: { text: lastMsg.text, time: lastMsg.time, timestamp: lastMsg.timestamp },
    messages
  });
}

// 3. 54 Girls (400 messages each, guaranteed unique)
for (let f = 0; f < 54; f++) {
  const id = `user_${f + 1}`;
  const name = femaleNames[f];
  const messages = generateGirlOrGroupMessages(id, name, false, f + 25, 400);
  const lastMsg = messages[messages.length - 1];

  usersData.push({
    id,
    isGroup: false,
    name,
    category: "girl",
    gender: "female",
    phone: `+880 18${String(14000000 + f * 123456).slice(0, 8)}`,
    avatar: null,
    status: f % 3 === 0 ? "online" : "offline",
    lastSeen: f % 3 === 0 ? "Online" : "Today at " + lastMsg.time,
    unreadCount: (f * 2) % 5,
    totalMessagesCount: messages.length,
    lastMessage: { text: lastMsg.text, time: lastMsg.time, timestamp: lastMsg.timestamp },
    messages
  });
}

console.log(`Total users generated: ${usersData.length}`);
console.log(`Total globally unique messages: ${usedTexts.size}`);

// Write directly to data.json
const jsonPath = path.join(__dirname, 'data.json');
fs.writeFileSync(jsonPath, JSON.stringify(usersData, null, 2), 'utf-8');
console.log(`Saved completely unique messages to ${jsonPath}`);

// APIs
app.get('/api/users', (req, res) => {
  const summaries = usersData.map(({ messages, ...sum }) => sum);
  res.json({ total: summaries.length, data: summaries });
});

app.get('/api/users/:id', (req, res) => {
  const item = usersData.find(u => u.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Chat not found" });
  res.json(item);
});

app.get('/api/full-chats', (req, res) => {
  res.json({ total: usersData.length, data: usersData });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});