"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Үйлчилгээний нөхцөл
        </motion.h1>

        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Ерөнхий нөхцөл</h2>
            <p className="text-gray-600 mb-4">
              Энэхүү үйлчилгээний нөхцөл нь likes.mn сайтын хэрэглэгчдэд зориулсан үйлчилгээний ашиглалтын журам юм. 
              Та манай сайтад хандаж, үйлчилгээг ашигласнаар дараах нөхцөлүүдийг хүлээн зөвшөөрч буйд тооцогдоно.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Үйлчилгээний тухай</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>likes.mn нь Instagram дагагч нэмэх болон постны лайк өсгөх үйлчилгээ үзүүлнэ.</li>
              <li>Үйлчилгээ нь автоматаар хийгдэх бөгөөд захиалга баталгаажсанаас хойш 5-30 минутын дотор эхэлнэ.</li>
              <li>Бид зөвхөн таны Instagram хаягийн нэр шаарддаг бөгөөд нууц үг авахгүй, хаягт тань хандалт хийхгүй.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Төлбөр, буцаалт</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Төлбөр нь byl.mn системээр хийгдэнэ.</li>
              <li>Захиалга баталгаажсаны дараа үйлчилгээ автоматаар хийгддэг тул төлбөр буцаах боломжгүй.</li>
              <li>Хэрэв техникийн саатал, үйлчилгээ хүргэгдээгүй тохиолдолд бид асуудлыг шийдвэрлэхэд тусална.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Хэрэглэгчийн хариуцлага</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Хэрэглэгч Instagram хаягийнхаа нийтийн тохиргоог идэвхжүүлсэн байх шаардлагатай.</li>
              <li>Бидний үйлчилгээ Instagram-тай ямар ч хамааралгүй, хэрэглэгч өөрийн аккаунтыг хамгаалах үүрэгтэй.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Баталгаа, хязгаарлалт</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Бидний өгч буй дагагчид, лайк нь жинхэнэ профайл эсвэл бот хольсон байдаг тул дагагч буурах магадлалтай. Бид баталгаа өгөхгүй.</li>
              <li>Instagram-ийн бодлого өөрчлөгдсөнөөс үүдэн гарсан хязгаарлалт, аккаунт хаагдах зэрэг эрсдэлийг хэрэглэгч өөрөө хариуцна.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Үйлчилгээний өөрчлөлт</h2>
            <p className="text-gray-600">
              likes.mn нь үйлчилгээний нөхцөл, үнэ тарифыг урьдчилан мэдэгдэлгүйгээр өөрчлөх эрхтэй.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Холбоо барих</h2>
            <p className="text-gray-600">
              Асуудал, санал хүсэлт байвал бидэнтэй холбогдоорой:
            </p>
            <p className="text-gray-600">
              📧 <a href="mailto:support@likes.mn" className="text-purple-600 hover:text-purple-700">support@likes.mn</a>
            </p>
            <p className="text-gray-600">
              <a href="https://instagram.com/likesmn" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                instagram.com/likesmn
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
} 