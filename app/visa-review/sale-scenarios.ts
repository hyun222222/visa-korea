import type {ReviewMarket} from '@/lib/visa-review-locales';
import type {Plan} from './review-copy';

export const plansByScenario = [
  ['question'],
  ['documents', 'strategy'],
  ['question', 'documents'],
  ['documents'],
  ['strategy'],
] as const satisfies readonly (readonly Plan[])[];

export const saleScenarios = {
  en: {
    heading: 'What do you need help with?',
    situations: [
      'Korea Visa Portal refusal reason number: what does it mean and when can I apply again?',
      'Re-entry after deportation, a departure order, an entry ban or refused entry at the airport. If you have a formal notice to review, choose the written opinion.',
      'Staying in Korea after changing or losing an E-7 job, or checking the requirements for D-10 to E-7 or E-9 to E-7-4.',
      'An F-6 marriage visa refusal, or visa and invitation documents for the spouse or minor child of an F-4 holder.',
      'Review a refusal or departure notice, or a D-8 contract before you sign.',
    ],
  },
  zh: {
    heading: '你遇到的是哪种情况？',
    situations: [
      '在韩国签证门户上看到拒签原因编号：它是什么意思，什么时候可以再次申请？',
      '“遣返后多久能再去韩国？”收到出境命令、受到入境限制或在机场被拒绝入境后，可核对再次入境所需的材料。如需审查书面通知，请选书面法律意见。',
      '持有 E-7 身份，换工作或被解雇后能否继续在韩停留？也可核对从 D-10 转 E-7 或从 E-9 转 E-7-4 的条件。',
      'F-6 结婚移民签证被拒，或需要核对 F-4 持有人的配偶或未成年子女的签证及邀请材料。',
      '需要解读拒签或出境通知，或在签字前审查 D-8 相关合同。',
    ],
  },
  vi: {
    heading: 'Bạn đang gặp tình huống nào?',
    situations: [
      'Bị từ chối cấp visa Hàn Quốc: mã lý do trên Korea Visa Portal có nghĩa gì và khi nào có thể nộp lại?',
      'Muốn quay lại Hàn Quốc sau khi bị trục xuất, bị yêu cầu rời đi, bị từ chối tại sân bay hoặc có lệnh cấm nhập cảnh. Nếu có văn bản cần xem xét, hãy chọn ý kiến pháp lý về thông báo.',
      'Đổi việc hoặc bị sa thải khi đang giữ E-7, hay muốn kiểm tra điều kiện chuyển từ D-10 sang E-7 hoặc từ E-9 sang E-7-4.',
      'Bị từ chối visa kết hôn F-6 hoặc cần kiểm tra hồ sơ xin visa và giấy tờ bảo lãnh cho vợ, chồng hoặc con chưa thành niên của người có diện F-4.',
      'Cần xem thông báo từ chối, thông báo yêu cầu rời Hàn Quốc hoặc hợp đồng D-8 trước khi ký.',
    ],
  },
  id: {
    heading: 'Situasi mana yang Anda hadapi?',
    situations: [
      'Visa Korea ditolak: apa arti nomor alasan penolakan di Korea Visa Portal dan kapan bisa mengajukan lagi?',
      'Ingin masuk lagi setelah deportasi, perintah keluar, penolakan di bandara, atau dugaan blacklist karena overstay. Pilih pendapat tertulis jika Anda perlu menelaah surat resmi.',
      'Pindah kerja atau terkena PHK saat memegang E-7, atau ingin memeriksa syarat perubahan status dari D-10 ke E-7 atau dari E-9 ke E-7-4.',
      'Visa pernikahan F-6 ditolak, atau perlu memeriksa dokumen visa dan undangan bagi pasangan atau anak di bawah umur dari pemegang F-4.',
      'Perlu menelaah surat penolakan, pemberitahuan untuk meninggalkan Korea, atau kontrak D-8 sebelum ditandatangani.',
    ],
  },
  th: {
    heading: 'คุณกำลังเจอสถานการณ์ไหน?',
    situations: [
      'วีซ่าเกาหลีไม่ผ่าน อยากรู้ว่ารหัสเหตุผลใน Korea Visa Portal หมายถึงอะไรและยื่นใหม่ได้เมื่อไร หรือ K-ETA ไม่ผ่านและอยากทราบขั้นตอนถัดไป',
      'อยากกลับเข้าเกาหลีหลังถูกส่งกลับ ได้รับคำสั่งให้ออกนอกประเทศ ติด ตม. ที่สนามบิน หรือสงสัยว่าติดแบล็คลิสต์ หากมีหนังสือแจ้งที่ต้องการให้ตรวจ ให้เลือกความเห็นทางกฎหมายเป็นลายลักษณ์อักษร',
      'ถือวีซ่า E-7 แล้วเปลี่ยนงานหรือถูกเลิกจ้าง หรืออยากตรวจเงื่อนไขการเปลี่ยนจาก D-10 เป็น E-7 หรือจาก E-9 เป็น E-7-4',
      'วีซ่าคู่สมรส F-6 ไม่ผ่าน หรือต้องการตรวจเอกสารขอวีซ่าและหนังสือเชิญสำหรับคู่สมรสหรือบุตรที่ยังไม่บรรลุนิติภาวะของผู้ถือ F-4',
      'ต้องการให้ตรวจหนังสือแจ้งปฏิเสธ หนังสือให้ออกจากเกาหลี หรือสัญญา D-8 ก่อนลงนาม',
    ],
  },
  mn: {
    heading: 'Танд аль асуудлаар тусламж хэрэгтэй вэ?',
    situations: [
      'Солонгосын виз татгалзсан шалтгааны дугаар юу гэсэн үг вэ? Дахин хэзээ мэдүүлж болох вэ?',
      'Албадан гаргасан, улсаас гарахыг шаардсан эсвэл нисэх буудал дээр нэвтрүүлээгүй тохиолдолд дахин нэвтрэх боломж болон нэвтрэх хоригийн асуудал. Албан мэдэгдэлтэй бол бичгээр өгөх хууль зүйн дүгнэлтийг сонгоно уу.',
      'E-7 визтэй байхдаа ажил солих, ажлаас халагдсаны дараа оршин суух, эсвэл D-10-аас E-7, E-9-өөс E-7-4 рүү шилжих нөхцөлийг лавлах.',
      'F-6 гэрлэлтийн визээс татгалзсан эсвэл F-4 статустай хүний эхнэр, нөхөр, насанд хүрээгүй хүүхдийн виз, урилгын баримтыг шалгуулах.',
      'Татгалзсан эсвэл улсаас гарах тухай мэдэгдэл, эсвэл гарын үсэг зурахаас өмнөх D-8 гэрээг хянуулах.',
    ],
  },
  ja: {
    heading: 'どのようなことでお困りですか？',
    situations: [
      '韓国ビザの不許可理由番号の意味と、再申請できる時期を知りたい。',
      '強制退去、出国命令、空港での入国拒否の後に再入国できるか確認したい。通知書の内容を確認したい場合は、書面による意見書をお選びください。',
      'E-7で転職・解雇された後の在留や、D-10からE-7、E-9からE-7-4への在留資格変更について相談したい。',
      'F-6の結婚移民ビザが不許可になった、またはF-4保持者の配偶者・未成年の子のビザ申請や招へい書類を確認したい。',
      '不許可・出国に関する通知書や、署名前のD-8関連契約書を確認してほしい。',
    ],
  },
  tl: {
    heading: 'Alin dito ang sitwasyon mo?',
    situations: [
      'Na-deny ang Korea visa: ano ang ibig sabihin ng code ng pagtanggi at kailan puwedeng mag-apply ulit?',
      'Nais bumalik sa Korea matapos ma-deport, mautusan na umalis, o ma-deny sa airport. Kung may opisyal na abiso na kailangang basahin, piliin ang legal na opinyon sa abiso.',
      'Lilipat ng trabaho o natanggal habang naka-E-7, o gustong alamin ang mga kailangan para lumipat mula D-10 patungong E-7 o mula E-9 patungong E-7-4.',
      'Na-deny ang F-6 marriage visa, o kailangang ipasuri ang visa at invitation documents para sa asawa o menor de edad na anak ng may F-4.',
      'Kailangang ipasuri ang abiso ng pagtanggi o pag-alis, o ang kontrata para sa D-8 bago pumirma.',
    ],
  },
  ne: {
    heading: 'तपाईं कुन अवस्थामा हुनुहुन्छ?',
    situations: [
      'कोरियाको भिसा अस्वीकृत हुँदा पोर्टलमा देखिएको कारण नम्बरको अर्थ र फेरि कहिले आवेदन दिन मिल्छ भन्ने बुझ्न चाहनुहुन्छ।',
      'देश निकाला, देश छाड्ने आदेश वा विमानस्थलमा प्रवेश अस्वीकृत भएपछि कोरिया फर्कने सम्भावना बुझ्न चाहनुहुन्छ। आधिकारिक सूचना छ भने लिखित कानुनी राय छान्नुहोस्।',
      'E-7 मा जागिर फेरेपछि वा गुमाएपछि बस्न पाउने अवस्था, वा D-10 बाट E-7 अथवा E-9 बाट E-7-4 मा जाने योग्यता बुझ्न चाहनुहुन्छ।',
      'F-6 विवाह भिसा अस्वीकृत भएको छ, वा F-4 हैसियत भएका व्यक्तिको पति वा पत्नी वा नाबालिग सन्तानका लागि भिसा र निमन्त्रणाका कागजात जाँच गराउन चाहनुहुन्छ।',
      'अस्वीकृति वा कोरिया छाड्नेसम्बन्धी सूचना, वा हस्ताक्षर गर्नुअघि D-8 सम्झौता जाँच गराउन चाहनुहुन्छ।',
    ],
  },
  km: {
    heading: 'តើអ្នកត្រូវការជំនួយក្នុងស្ថានភាពណាមួយ?',
    situations: [
      'ចង់ដឹងថាលេខកូដមូលហេតុដែលទិដ្ឋាការកូរ៉េត្រូវបានបដិសេធមានន័យអ្វី ហើយអាចដាក់ពាក្យម្តងទៀតនៅពេលណា។',
      'ចង់ដឹងពីលទ្ធភាពត្រឡប់ទៅកូរ៉េបន្ទាប់ពីត្រូវបានបណ្តេញចេញ ទទួលបញ្ជាឱ្យចាកចេញ ឬត្រូវបានបដិសេធមិនឱ្យចូលនៅព្រលានយន្តហោះ។ បើមានលិខិតផ្លូវការដែលត្រូវពិនិត្យ សូមជ្រើសរើសយោបល់ផ្លូវច្បាប់លើលិខិត។',
      'ចង់ដឹងពីការស្នាក់នៅបន្ទាប់ពីប្តូរការងារ ឬត្រូវបានបញ្ឈប់ពីការងារពេលកាន់ទិដ្ឋាការ E-7 ឬពីលក្ខខណ្ឌប្តូរពី D-10 ទៅ E-7 ឬពី E-9 ទៅ E-7-4។',
      'ទិដ្ឋាការអាពាហ៍ពិពាហ៍ F-6 ត្រូវបានបដិសេធ ឬចង់ឱ្យពិនិត្យឯកសារសុំទិដ្ឋាការ និងលិខិតអញ្ជើញសម្រាប់ប្តី ប្រពន្ធ ឬកូនអនីតិជនរបស់អ្នកកាន់ F-4។',
      'ត្រូវការឱ្យពិនិត្យលិខិតបដិសេធ លិខិតតម្រូវឱ្យចាកចេញ ឬកិច្ចសន្យា D-8 មុនចុះហត្ថលេខា។',
    ],
  },
} satisfies Record<ReviewMarket, {heading: string; situations: readonly [string, string, string, string, string]}>;
