import type {ReviewMarket} from '@/lib/visa-review-locales';
import styles from './official-visa-links.module.css';

type LookupCopy = {heading: string; guidance: string; visa: string; keta: string};

const lookupCopy: Record<ReviewMarket, LookupCopy> = {
  en: {
    heading: 'Where can I check my Korean visa result?',
    guidance: 'Choose your application type on the Korea Visa Portal. Enter the name on your passport, your date of birth and the number requested. If you applied for K-ETA, check the result on the K-ETA website.',
    visa: 'Check a visa application', keta: 'Check a K-ETA application',
  },
  zh: {
    heading: '在哪里查询韩国签证结果？',
    guidance: '在韩国签证门户网站选择申请类型，按要求填写护照上的英文姓名、出生日期及相应号码。如果申请的是 K-ETA，请前往 K-ETA 官网查询。',
    visa: '查询签证申请进度', keta: '查询 K-ETA 申请结果',
  },
  mn: {
    heading: 'Солонгосын визийн хариуг хэрхэн шалгах вэ?',
    guidance: 'БНСУ-ын визийн порталд өргөдлийн төрлөө сонгоод паспорт дээрх англи нэр, төрсөн огноо болон нэхсэн дугаарыг оруулна. K-ETA мэдүүлсэн бол хариугаа K-ETA-ийн албан ёсны сайтаас шалгана.',
    visa: 'Визийн хариу шалгах', keta: 'K-ETA-ийн хариу шалгах',
  },
  th: {
    heading: 'เช็กผลวีซ่าเกาหลีหรือผล K-ETA ได้ที่ไหน?',
    guidance: 'หากยื่นขอวีซ่า ให้เลือกประเภทคำขอใน Korea Visa Portal แล้วกรอกชื่อภาษาอังกฤษตามหนังสือเดินทาง วันเกิด และหมายเลขที่ระบบระบุ หากยื่น K-ETA ให้ตรวจผลที่เว็บไซต์ K-ETA ส่วนกรณีถูกปฏิเสธเข้าเมืองที่สนามบิน ให้ดูเอกสารที่ได้รับจากเจ้าหน้าที่ตรวจคนเข้าเมือง',
    visa: 'เช็กผลวีซ่าเกาหลี', keta: 'เช็กผล K-ETA',
  },
  id: {
    heading: 'Di mana saya bisa mengecek hasil visa Korea?',
    guidance: 'Pilih jenis permohonan di Korea Visa Portal. Masukkan nama sesuai paspor, tanggal lahir, dan nomor yang diminta. Jika statusnya ditolak, baca alasan yang tercantum sebelum memutuskan langkah berikutnya. Untuk permohonan K-ETA, cek hasilnya di situs K-ETA.',
    visa: 'Cek status visa Korea', keta: 'Cek hasil K-ETA',
  },
  tl: {
    heading: 'Saan ko makikita ang resulta ng Korean visa application ko?',
    guidance: 'Sa Korea Visa Portal, piliin ang uri ng aplikasyon. Ilagay ang pangalan sa pasaporte, petsa ng kapanganakan at numerong hinihingi. Kung tinanggihan ang aplikasyon, basahin ang nakasaad na dahilan. Kung K-ETA ang inapplyan mo, sa website ng K-ETA tingnan ang resulta.',
    visa: 'Tingnan ang resulta ng visa', keta: 'Tingnan ang resulta ng K-ETA',
  },
  vi: {
    heading: 'Tra cứu kết quả visa Hàn Quốc ở đâu?',
    guidance: 'Trên Cổng thông tin thị thực Hàn Quốc, chọn loại hồ sơ rồi nhập họ tên theo hộ chiếu, ngày sinh và số mà hệ thống yêu cầu. Nếu đã đăng ký K-ETA, hãy tra cứu kết quả trên trang chính thức của K-ETA.',
    visa: 'Tra cứu hồ sơ visa', keta: 'Tra cứu kết quả K-ETA',
  },
  ja: {
    heading: '韓国ビザの審査結果はどこで確認できますか？',
    guidance: '韓国ビザポータルで申請の種類を選び、旅券どおりの英字氏名、生年月日、画面で指定された番号を入力してください。K-ETAを申請した方は、K-ETA公式サイトで結果を確認できます。',
    visa: 'ビザの審査状況を確認する', keta: 'K-ETAの結果を確認する',
  },
  ne: {
    heading: 'कोरियाको भिसा आवेदनको नतिजा कहाँ हेर्ने?',
    guidance: 'कोरिया भिसा पोर्टलमा आवेदनको प्रकार छान्नुहोस्। राहदानीमा लेखिएको अङ्ग्रेजी नाम, जन्ममिति र पोर्टलले मागेको नम्बर भर्नुहोस्। K-ETA का लागि आवेदन दिनुभएको हो भने त्यसको नतिजा K-ETA को आधिकारिक वेबसाइटमा हेर्नुहोस्।',
    visa: 'भिसा आवेदनको स्थिति हेर्नुहोस्', keta: 'K-ETA को नतिजा हेर्नुहोस्',
  },
  km: {
    heading: 'តើខ្ញុំអាចពិនិត្យលទ្ធផលពាក្យសុំទិដ្ឋាការកូរ៉េនៅឯណា?',
    guidance: 'នៅលើគេហទំព័រ Korea Visa Portal សូមជ្រើសរើសប្រភេទពាក្យសុំ រួចបញ្ចូលឈ្មោះជាអក្សរឡាតាំងដូចក្នុងលិខិតឆ្លងដែន ថ្ងៃខែឆ្នាំកំណើត និងលេខដែលប្រព័ន្ធតម្រូវ។ ប្រសិនបើអ្នកបានដាក់ពាក្យសុំ K-ETA សូមពិនិត្យលទ្ធផលនៅលើគេហទំព័រផ្លូវការរបស់ K-ETA។',
    visa: 'ពិនិត្យស្ថានភាពពាក្យសុំទិដ្ឋាការ', keta: 'ពិនិត្យលទ្ធផល K-ETA',
  },
};

export function OfficialVisaLinks({locale}: {locale: ReviewMarket}) {
  const copy = lookupCopy[locale];
  const portalLanguage = locale === 'zh' ? 'CH' : 'EN';
  return (
    <aside className={styles.lookup} aria-labelledby="visa-status-help">
      <h3 id="visa-status-help">{copy.heading}</h3>
      <p>{copy.guidance}</p>
      <div>
        <a href={`https://www.visa.go.kr/openPage.do?MENU_ID=10301&LANG_TYPE=${portalLanguage}`}>{copy.visa}</a>
        <a href="https://www.k-eta.go.kr/portal/newapply/index.do">{copy.keta}</a>
      </div>
    </aside>
  );
}
