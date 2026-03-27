import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save, Upload, Trash2, Settings } from "lucide-react";
import { caseStudies as defaultCaseStudies } from "@/lib/data";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated, logout, token } = useAdmin();
  const { toast } = useToast();
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    fetchSections();
    fetchImages();
  }, [isAuthenticated]);

  async function fetchSections() {
    const res = await fetch("/api/content/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
  }

  async function fetchImages() {
    const res = await fetch("/api/content/images");
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
  }

  async function saveSection(section: string) {
    setLoading(true);
    try {
      const contentToSave = section === "caseStudies" 
        ? (Array.isArray(sections.caseStudies) && sections.caseStudies.length > 0 ? sections.caseStudies : defaultCaseStudies)
        : (sections[section] || {});
        
      const res = await fetch(`/api/content/${section}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: JSON.stringify(contentToSave) }),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      toast({ title: "تم الحفظ بنجاح" });
    } catch (err) {
      toast({ title: "خطأ", description: "فشل حفظ البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (res.ok) {
      await fetchImages();
      toast({ title: "تم رفع الصورة" });
    }
  }

  async function deleteImage(url: string) {
    const filename = url.split("/").pop();
    const res = await fetch(`/api/upload/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await fetchImages();
      toast({ title: "تم حذف الصورة" });
    }
  }

  const updateCaseStudy = (index: number, field: string, value: any) => {
    setSections(prev => {
      const currentCaseStudies = Array.isArray(prev.caseStudies) && prev.caseStudies.length > 0 
        ? [...prev.caseStudies] 
        : [...defaultCaseStudies];
      currentCaseStudies[index] = { ...currentCaseStudies[index], [field]: value };
      return { ...prev, caseStudies: currentCaseStudies };
    });
  };

  if (!isAuthenticated) return null;

  const editableSection = (section: string, field: string, label: string, multiline = false) => (
    <div key={field} className="mb-4">
      <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
      {multiline ? (
        <Textarea
          value={sections[section]?.[field] ?? ""}
          onChange={(e) => setSections((prev) => ({ ...prev, [section]: { ...prev[section], [field]: e.target.value } }))}
          className="bg-card/50 border-white/10 min-h-24 text-right"
          dir="rtl"
        />
      ) : (
        <Input
          value={sections[section]?.[field] ?? ""}
          onChange={(e) => setSections((prev) => ({ ...prev, [section]: { ...prev[section], [field]: e.target.value } }))}
          className="bg-card/50 border-white/10 text-right"
          dir="rtl"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => { logout(); navigate("/"); }}
            className="border-white/10 text-muted-foreground hover:text-white"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>

        <div className="space-y-8">
          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">صورتي المرفوعة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {images.map((url) => (
                <div key={url} className="relative group cursor-pointer" onClick={() => { navigator.clipboard?.writeText(url); toast({ title: "تم نسخ الرابط" }); }}>
                  <img src={url} alt="" className="w-full aspect-video object-cover rounded-xl" />
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteImage(url); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-destructive/80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl pointer-events-none">
                    اضغط لنسخ الرابط
                  </div>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-3 cursor-pointer bg-card/50 border border-dashed border-white/20 rounded-2xl px-6 py-4 hover:border-primary/50 transition-colors w-fit">
              <Upload className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">رفع صورة جديدة</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            </label>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">محتوى القسم الرئيسي</h2>
            {editableSection("hero", "badge", "الشارة")}
            {editableSection("hero", "headline", "العنوان الرئيسي")}
            {editableSection("hero", "subheadline", "العنوان الفرعي", true)}
            {editableSection("hero", "ctaPrimary", "زر CTA الرئيسي")}
            {editableSection("hero", "trustText", "نص الثقة")}
            {editableSection("hero", "heroCard1", "رابط صورة البطاقة 1 (اختياري - انسخ من الاعلى)")}
            {editableSection("hero", "heroCard2", "رابط صورة البطاقة 2 (اختياري - انسخ من الاعلى)")}
            <Button onClick={() => saveSection("hero")} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">هوية العلامة التجارية</h2>
            {editableSection("brand", "name", "اسم العلامة")}
            {editableSection("brand", "logoLetter", "حرف الشعار")}
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">الصورة الشخصية / الشعار</label>
              <div className="flex items-center gap-4 flex-row-reverse justify-end">
                <label className="flex items-center gap-2 cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/30 transition border border-primary/30">
                  <Upload className="w-4 h-4" /> رفع صورة
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("image", file);
                    const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
                    if (res.ok) {
                      const data = await res.json();
                      setSections((prev) => ({ ...prev, brand: { ...prev.brand, logoImage: data.url } }));
                      toast({ title: "تم رفع الصورة بنجاح!" });
                    }
                  }} />
                </label>
                {sections.brand?.logoImage ? (
                  <div className="relative group">
                    <img src={sections.brand.logoImage} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                    <button onClick={() => setSections((prev) => ({ ...prev, brand: { ...prev.brand, logoImage: "" } }))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-muted-foreground text-xs">لا يوجد</div>
                )}
              </div>
            </div>
            {editableSection("brand", "logoImage", "رابط صورة الشعار (يُعبأ تلقائياً عند الرفع)")}
            <Button onClick={() => saveSection("brand")} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">أسعار الباقات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {editableSection("pricing", "basicPrice", "سعر الباقة الأساسية")}
              {editableSection("pricing", "basicFeatures", "ميزات الباقة الأساسية (كل ميزة في سطر جديد)", true)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {editableSection("pricing", "proPrice", "سعر الباقة الاحترافية")}
              {editableSection("pricing", "proFeatures", "ميزات الباقة الاحترافية (كل ميزة في سطر جديد)", true)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {editableSection("pricing", "elitePrice", "سعر باقة النخبة")}
              {editableSection("pricing", "eliteFeatures", "ميزات باقة النخبة (كل ميزة في سطر جديد)", true)}
            </div>
            <Button onClick={() => saveSection("pricing")} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">صور معرض الأعمال (Portfolio)</h2>
            <p className="text-sm text-gray-400 mb-4">انسخ الروابط من الأعلى وألصقها هنا مسافة أو فاصلة بين كل رابط.</p>
            {editableSection("portfolio", "images", "روابط الصور", true)}
            <Button onClick={() => saveSection("portfolio")} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">قصص نجاح يوتيوبرز</h2>
            {((Array.isArray(sections.caseStudies) && sections.caseStudies.length > 0) ? sections.caseStudies : defaultCaseStudies).map((study: any, idx: number) => (
              <div key={study.id || idx} className="mb-8 border border-white/10 rounded-2xl p-6 bg-black/20 text-right">
                <h3 className="text-lg font-bold text-primary mb-4">قصة حالة {idx + 1}</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">اسم اليوتيوبر / القناة</label>
                  <Input value={study.name || ""} onChange={(e) => updateCaseStudy(idx, 'name', e.target.value)} dir="rtl" className="bg-card/50" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">المجال (Niche)</label>
                  <Input value={study.niche || ""} onChange={(e) => updateCaseStudy(idx, 'niche', e.target.value)} dir="rtl" className="bg-card/50" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">الصورة الرمزية (محسّن)</label>
                  <div className="flex items-center gap-4 flex-row-reverse justify-end">
                    <label className="flex items-center gap-2 cursor-pointer bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/30 transition border border-primary/30">
                      <Upload className="w-4 h-4" /> إضافة صورة حقيقية
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("image", file);
                        const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
                        if (res.ok) {
                          const data = await res.json();
                          updateCaseStudy(idx, 'avatarImage', data.url);
                          toast({ title: "تم رفع وتعيين الصورة بنجاح!" });
                        }
                      }} />
                    </label>
                    {study.avatarImage ? (
                      <div className="relative group">
                        <img src={study.avatarImage} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                        <button onClick={() => updateCaseStudy(idx, 'avatarImage', '')} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-muted-foreground text-xs">لا يوجد</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">نبذة قصيرة</label>
                  <Textarea value={study.shortBio || ""} onChange={(e) => updateCaseStudy(idx, 'shortBio', e.target.value)} dir="rtl" className="bg-card/50 min-h-20" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">الإحصائيات (الأرقام والنصوص المجاورة)</label>
                  <div className="space-y-4">
                    {(study.metrics || []).map((metric: any, mIdx: number) => (
                      <div key={mIdx} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">الرقم / القيمة</label>
                          <Input 
                            value={metric.value || ""} 
                            onChange={(e) => {
                              const newMetrics = [...(study.metrics || [])];
                              newMetrics[mIdx] = { ...newMetrics[mIdx], value: e.target.value };
                              updateCaseStudy(idx, 'metrics', newMetrics);
                            }} 
                            dir="rtl" 
                            className="bg-card/50" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">النص / الوصف</label>
                          <Input 
                            value={metric.label || ""} 
                            onChange={(e) => {
                              const newMetrics = [...(study.metrics || [])];
                              newMetrics[mIdx] = { ...newMetrics[mIdx], label: e.target.value };
                              updateCaseStudy(idx, 'metrics', newMetrics);
                            }} 
                            dir="rtl" 
                            className="bg-card/50" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">القصة الكاملة (تظهر في صفحة دراسة الحالة)</label>
                  <Textarea value={study.story || ""} onChange={(e) => updateCaseStudy(idx, 'story', e.target.value)} dir="rtl" className="bg-card/50 min-h-32" />
                </div>
              </div>
            ))}
            <Button onClick={() => saveSection("caseStudies")} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ قصص النجاح
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
