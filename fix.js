const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// 1. Sticky Order Buttons -> text-white-keep
content = content.replace(/className=\"flex items-center gap-3 px-5 py-3.5 rounded-full bg-\\[#25D366\\] text-white font-bold text-sm (.*?)\"/, 'className=\"flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#25D366] text-white-keep text-white font-bold text-sm $1\"');
content = content.replace(/className=\"flex items-center gap-3 px-5 py-3.5 rounded-full bg-primary text-white font-bold text-sm (.*?)\"/, 'className=\"flex items-center gap-3 px-5 py-3.5 rounded-full bg-primary text-white-keep text-white font-bold text-sm $1\"');

// 2. Discount Activation Button (was light-btn-blue text-white-keep)
// Wait I already did this one in the previous step: 'light-btn-blue text-white-keep' is on it, wait, “تفعيل الخصم الان”! I didn't do “تفعيل الخصم 20% الآن”, I did the other one ("استخدم العرض الآن").
// The 'تفعيل الخصم 20% الآن' button:
content = content.replace(/className={\`inline-flex items-center justify-center gap-3 border rounded-2xl px-10 py-5 mb-8 transition-all font-black text-xl lg:text-2xl \\$\\{(.*?)\\}\\`}/, 
  'className={\`inline-flex items-center justify-center gap-3 border rounded-2xl px-10 py-5 mb-8 transition-all font-black text-xl lg:text-2xl text-white-keep ${$1}\`}');

// 3. How It Works - Change fixed colors to theme colors
content = content.replace(/from-violet-500\/20 to-violet-500\/5/g, 'from-primary/20 to-primary/5');
content = content.replace(/border-violet-500\/20/g, 'border-primary/20');
content = content.replace(/from-blue-500\/20 to-blue-500\/5/g, 'from-secondary/20 to-secondary/5');
content = content.replace(/border-blue-500\/20/g, 'border-secondary/20');
content = content.replace(/from-green-500\/20 to-green-500\/5/g, 'from-accent/20 to-accent/5');
content = content.replace(/border-green-500\/20/g, 'border-accent/20');

// Fix glow values for How It Works to use RGB formats that Tailwind supports or hex...
// The glow value is set manually via style={{ boxShadow: `0 0 40px ${step.glow}0` }} where glow is \"rgba(139,92,246,0.3)\".
// Actually I'll replace `rgba(139,92,246,` globally to `hsl(var(--primary) / ` first...
content = content.replace(/glow: "rgba\\(139,92,246,0\\.3\\)"/g, 'glow: "hsl(var(--primary) / 0.3)"');
content = content.replace(/glow: "rgba\\(59,130,246,0\\.3\\)"/g, 'glow: "hsl(var(--secondary) / 0.3)"');
content = content.replace(/glow: "rgba\\(34,197,94,0\\.3\\)"/g, 'glow: "hsl(var(--accent) / 0.3)"');

content = content.replace(/from-violet-500\/30 via-blue-500\/30 to-green-500\/30/g, 'from-primary/30 via-secondary/30 to-accent/30');

// 4. Update pricing 'اختر احترافي' and icon to text-white-keep
// "كلمت اختر احترافي والايقونه اللي موجوده جنبها خليها باللون الابيض" and "الاكثر طلبا خليها لون ابيض"
content = content.replace(/bg-gradient-to-r from-primary to-secondary text-white/g, 'bg-gradient-to-r from-primary to-secondary text-white text-white-keep');
content = content.replace(/fill-white/g, 'fill-white text-white-keep');

// This modifies the 'الأكثر طلباً' span specifically
content = content.replace(/<Sparkles size={12} className="fill-white" \/>\\s*الأكثر طلباً\\s*<Sparkles size={12} className="fill-white" \/>/, 
  '<Sparkles size={12} className="fill-white text-white-keep" /> <span className="text-white-keep">الأكثر طلباً</span> <Sparkles size={12} className="fill-white text-white-keep" />');

// 5. Replace all hardcoded rgba(139,92,246, opacity) with hsl(var(--primary) / opacity) for shadows!
content = content.replace(/rgba\\(139,92,246,([0-9.]+)\\)/g, 'hsl(var(--primary) / $1)');

// ensure Icon in pro button is white: (Sparkles in the button)
content = content.replace(/<Sparkles size={16} className="ml-2 inline" \/>/, '<Sparkles size={16} className="ml-2 inline text-white-keep" />');

fs.writeFileSync('client/src/pages/Home.tsx', content);
console.log("Replacements done!");
