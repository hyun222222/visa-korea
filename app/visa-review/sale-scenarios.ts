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
      'Staying in Korea after an E-7 job change or dismissal, or eligibility to move from D-10 or E-9 to E-7.',
      'Refused F-6 marriage visa or family invitation related to an F-4 holder.',
      'Review a refusal or departure notice, or a D-8 contract before you sign.',
    ],
  },
  zh: {
    heading: '你遇到的是哪种情况？',
    situations: [
      '在韩国签证门户上看到拒签原因编号：它是什么意思，什么时候可以再次申请？',
      '“遣返后多久能再去韩国？”如果遇到出境命令、入境禁令或机场拒关，可核对再次入境所需的材料；如需审查书面通知，请选书面法律意见。',
      'E-7 持有者换工作或被解雇后能否继续在韩停留，或从 D-10、E-9 转为 E-7 的条件。',
      'F-6 结婚移民签证被拒，或 F-4 持有者邀请家属时申请被拒。',
      '需要解读拒签或出境通知，或在签字前审查 D-8 相关合同。',
    ],
  },
  vi: {
    heading: 'Bạn đang gặp tình huống nào?',
    situations: [
      'Rớt visa Hàn Quốc: mã lý do trên Korea Visa Portal có nghĩa gì và khi nào có thể nộp lại?',
      'Muốn quay lại Hàn Quốc sau khi bị trục xuất, bị yêu cầu rời đi, bị từ chối tại sân bay hoặc có lệnh cấm nhập cảnh. Nếu có văn bản cần xem xét, hãy chọn ý kiến pháp lý về thông báo.',
      'Đổi việc hoặc bị sa thải khi đang giữ E-7, hay muốn kiểm tra điều kiện chuyển visa D10 sang E7 hoặc từ E-9 sang E-7.',
      'Bị từ chối visa kết hôn F-6 hoặc hồ sơ mời người thân của người có diện F-4.',
      'Cần xem thông báo từ chối, thông báo yêu cầu rời Hàn Quốc hoặc hợp đồng D-8 trước khi ký.',
    ],
  },
  id: {
    heading: 'Situasi mana yang Anda hadapi?',
    situations: [
      'Visa Korea ditolak: apa arti nomor alasan penolakan di Korea Visa Portal dan kapan bisa mengajukan lagi?',
      'Ingin masuk lagi setelah deportasi, perintah keluar, penolakan di bandara, atau dugaan blacklist karena overstay. Pilih pendapat tertulis jika Anda perlu menelaah surat resmi.',
      'Pindah kerja atau terkena PHK saat memegang E-7, atau ingin memeriksa syarat pindah status dari D-10 atau E-9 ke E-7.',
      'Visa pernikahan F-6 atau permohonan undangan keluarga terkait pemegang F-4 ditolak.',
      'Perlu menelaah surat penolakan, pemberitahuan untuk meninggalkan Korea, atau kontrak D-8 sebelum ditandatangani.',
    ],
  },
  th: {
    heading: 'คุณกำลังเจอสถานการณ์ไหน?',
    situations: [
      'วีซ่าเกาหลีหรือ K-ETA ไม่ผ่าน อยากรู้ว่าต้องทำอย่างไรต่อ หรือรหัสเหตุผลการปฏิเสธใน Korea Visa Portal หมายถึงอะไรและยื่นใหม่ได้เมื่อไร',
      'อยากกลับเข้าเกาหลีหลังถูกส่งกลับ ได้รับคำสั่งให้ออกนอกประเทศ ติด ตม. ที่สนามบิน หรือสงสัยว่าติดแบล็คลิสต์ หากมีหนังสือแจ้งที่ต้องการให้ตรวจ ให้เลือกความเห็นทางกฎหมายเป็นลายลักษณ์อักษร',
      'ถือวีซ่า E-7 แล้วเปลี่ยนงานหรือถูกเลิกจ้าง หรืออยากตรวจเงื่อนไขการเปลี่ยนจาก D-10 หรือ E-9 เป็น E-7',
      'วีซ่าคู่สมรส F-6 ไม่ผ่าน หรือคำขอเชิญญาติของผู้ถือ F-4 ถูกปฏิเสธ',
      'ต้องการให้ตรวจหนังสือแจ้งปฏิเสธ หนังสือให้ออกจากเกาหลี หรือสัญญา D-8 ก่อนลงนาม',
    ],
  },
  mn: {
    heading: 'Танд аль асуудлаар тусламж хэрэгтэй вэ?',
    situations: [
      'Солонгосын виз татгалзсан шалтгааны дугаар юу гэсэн үг вэ? Дахин хэзээ мэдүүлж болох вэ?',
      'Албадан гаргасан, улсаас гарахыг шаардсан эсвэл нисэх буудал дээр нэвтрүүлээгүй тохиолдолд дахин нэвтрэх боломж болон нэвтрэх хоригийн асуудал. Албан мэдэгдэлтэй бол бичгээр өгөх хууль зүйн дүгнэлтийг сонгоно уу.',
      'E-7 визтэй байхдаа ажил солих эсвэл ажлаас халагдсаны дараа оршин суух, эсвэл D-10, E-9-өөс E-7 рүү шилжих нөхцөл.',
      'F-6 гэрлэлтийн виз эсвэл F-4 статустай хүний гэр бүлийн гишүүнээ урих хүсэлтийг татгалзсан.',
      'Татгалзсан эсвэл улсаас гарах тухай мэдэгдэл, эсвэл гарын үсэг зурахаас өмнөх D-8 гэрээг хянуулах.',
    ],
  },
  ja: {
    heading: 'どのようなことでお困りですか？',
    situations: [
      '韓国ビザの不許可理由番号の意味と、再申請できる時期を知りたい。',
      '強制退去、出国命令、空港での入国拒否の後に再入国できるか確認したい。通知書の内容を確認したい場合は、書面による意見書をお選びください。',
      'E-7で転職・解雇された後の在留や、D-10またはE-9からE-7への変更要件について相談したい。',
      'F-6の結婚移民ビザや、F-4保持者による家族の招へい申請が不許可になった。',
      '不許可・出国に関する通知書や、署名前のD-8関連契約書を確認してほしい。',
    ],
  },
  tl: {
    heading: 'Alin dito ang sitwasyon mo?',
    situations: [
      'Na-deny ang Korea visa: ano ang ibig sabihin ng code ng pagtanggi at kailan puwedeng mag-apply ulit?',
      'Nais bumalik sa Korea matapos ma-deport, mautusan na umalis, o ma-deny sa airport. Kung may opisyal na abiso na kailangang basahin, piliin ang legal na opinyon sa abiso.',
      'Lilipat ng trabaho o natanggal habang naka-E-7, o gustong alamin ang requirements para lumipat mula D-10 o E-9 patungong E-7.',
      'Na-deny ang F-6 marriage visa o aplikasyon ng may F-4 para mag-imbita ng kapamilya.',
      'Kailangang ipasuri ang abiso ng pagtanggi o pag-alis, o ang kontrata para sa D-8 bago pumirma.',
    ],
  },
  ne: {
    heading: 'तपाईं कुन अवस्थामा हुनुहुन्छ?',
    situations: [
      'कोरियाको भिसा अस्वीकृत हुँदा पोर्टलमा देखिएको कारण नम्बरको अर्थ र फेरि कहिले आवेदन दिन मिल्छ भन्ने बुझ्न चाहनुहुन्छ।',
      'देश निकाला, देश छाड्ने आदेश वा विमानस्थलमा प्रवेश अस्वीकृत भएपछि कोरिया फर्कने सम्भावना बुझ्न चाहनुहुन्छ। आधिकारिक सूचना छ भने लिखित कानुनी राय छान्नुहोस्।',
      'E-7 मा जागिर फेर्नु वा जागिर गुमेपछि बस्न पाउने अवस्था, वा D-10 वा E-9 बाट E-7 मा जाने योग्यता बुझ्न चाहनुहुन्छ।',
      'F-6 विवाह भिसा वा F-4 हैसियत भएका व्यक्तिले परिवारलाई बोलाउन दिएको निवेदन अस्वीकृत भएको छ।',
      'अस्वीकृति वा कोरिया छाड्नेसम्बन्धी सूचना, वा हस्ताक्षर गर्नुअघि D-8 सम्झौता जाँच गराउन चाहनुहुन्छ।',
    ],
  },
  km: {
    heading: 'តើអ្នកត្រូវការជំនួយក្នុងស្ថានភាពណាមួយ?',
    situations: [
      'ចង់ដឹងថាលេខកូដមូលហេតុដែលទិដ្ឋាការកូរ៉េត្រូវបានបដិសេធមានន័យអ្វី ហើយអាចដាក់ពាក្យម្តងទៀតនៅពេលណា។',
      'ចង់ដឹងពីលទ្ធភាពត្រឡប់ទៅកូរ៉េបន្ទាប់ពីត្រូវបានបណ្តេញចេញ ទទួលបញ្ជាឱ្យចាកចេញ ឬត្រូវបានបដិសេធមិនឱ្យចូលនៅព្រលានយន្តហោះ។ បើមានលិខិតផ្លូវការដែលត្រូវពិនិត្យ សូមជ្រើសរើសយោបល់ផ្លូវច្បាប់លើលិខិត។',
      'ចង់ដឹងពីការស្នាក់នៅបន្ទាប់ពីប្តូរការងារ ឬត្រូវបានបញ្ឈប់ពីការងារក្នុងអំឡុងពេលកាន់ទិដ្ឋាការ E-7 ឬពីលក្ខខណ្ឌប្តូរពី D-10 ឬ E-9 ទៅ E-7។',
      'ទិដ្ឋាការអាពាហ៍ពិពាហ៍ F-6 ឬពាក្យស្នើសុំអញ្ជើញសមាជិកគ្រួសាររបស់អ្នកកាន់ F-4 ត្រូវបានបដិសេធ។',
      'ត្រូវការឱ្យពិនិត្យលិខិតបដិសេធ លិខិតតម្រូវឱ្យចាកចេញ ឬកិច្ចសន្យា D-8 មុនចុះហត្ថលេខា។',
    ],
  },
} satisfies Record<ReviewMarket, {heading: string; situations: readonly [string, string, string, string, string]}>;
