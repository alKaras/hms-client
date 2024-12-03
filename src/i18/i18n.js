import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    login: "Login",
                    eng: "English",
                    ua: "Ukrainian",
                    //header
                    report: "Report",
                    patients: "Patients",
                    settings: "Settings",
                    orderHistory: "Order History",
                    hospital: "Hospital",
                    hospitals: "Hospitals",
                    profile: "Profile",
                    exit: "Log out",
                    services: "Services",
                    userServices: "My Services",
                    userReferrals: "My Referrals",
                    home: "Home",
                    //doctorCard
                    appointment: "Make an appointment",
                    // Order
                    order: "Order",
                    numofservices: "Number of services",
                    delete: "Delete",
                    //HospitalPage
                    information: "General Info",
                    name: "Title",
                    address: "Address",
                    description: "Description",
                    phone: "Phone",
                    email: "Email",
                    departments: "Departments",
                    create: "Create",
                    actions: "Actions",
                    doctors: "Doctors",
                    importbtn: "Import",
                    chdep: "Choose department",
                    search: "Search",
                    //doctorInfo
                    firstname: "Firstname",
                    lastname: "Lastname",
                    specialization: "Specialization",
                    status: "Status",
                    addHospital: "Add hospital",
                    alias: "Alias",
                    addService: "Integrate new service",
                    doctor: "Doctor",
                    chdoc: "Choose doctor",
                    editHosp: "Edit hospital",
                    nameServicePlaceHolder: "Enter name of service",
                    nameOfHospitalPlaceHolder: "Enter title of hospital",
                    aliasPlaceholder: "alias (test-hospital)",
                    addressPlaceHolder: "Enter address",
                    save: "Save",
                    editDoc: "Edit doctor information",
                    addDoc: "Add doctor",
                    editDep: "Edit Department",
                    addDep: "Add Department",
                    addTimeSlot: "Create Timeslot",
                    selectTimeslot: "Select TimeSlot",
                    chStartTime: "Select start time",
                    chEndTime: "Select end time",
                    timeslots: "Timeslots",
                    emptyTimeslots: "No coupons available at this time",
                    cfgTimeSlots: "Configure Timeslots",
                    chdate: "Select date",
                    startTime: "Start time",
                    endTime: "End time",
                    price: "Price",
                    paymentStatus: "Payment status",
                    paymentId: "Payment ID",
                    emptyOrders: "doesn't (don't) have paid orders",
                    addUser: "Register User",
                    required: "Required field",
                    incorrectFormat: "Incorrect format",
                    password: "Password",
                    msgPassword: "The password must contain at least 8 characters, 1 letter, 1 number and 1 special character",
                    back: "Go back",
                    editUser: "Change user information",
                    editRoles: "Change user roles",
                    roles: "User Roles",
                    suggestedRoles: "Suggested Roles",
                    verifiedStatus: "Verified",
                    auth: "Authorization",
                    registerLink2: "Register",
                    register: "Registration",
                    registerLink: "Not with us yet? Register now",
                    authLink: "Are already with us? Login now",

                    //Canceled order page
                    canceled: "Payment cancelled",
                    msg1: "Unfortunately, your payment could not be completed. Please check your payment card details or try again later.",
                    msg2: "If the problem persists, please contact our support team and we will help you resolve the issue.",
                    msg3: "Your health is important to us and we hope you can complete your booking quickly.",
                    msg4: "Thank you for your understanding. We are always ready to help you!",

                    //Paid Statuses
                    paid: "Paid",
                    pending: "Pending",
                    cancel: "Canceled",

                    reserved: "RESERVED",
                    free: "FREE",
                    sold: "SOLD",

                    //Paid order page
                    successmsg1: "Thank you for your payment! Your booking has been confirmed",
                    successmsg2: "Your payment was successful, and we are pleased to inform you that the vouchers for the selected services have been successfully booked. Our specialists will be ready to see you at the appointed time. You can view the booking details in your personal account.",
                    intoProfile: "Go to your account",
                    successmsg3: "If you have any questions or would like to reschedule your visit, please contact our support team.",
                    successmsg4: "Thank you for choosing our hospital for your health! We care about your health. Stay in touch and be healthy!",

                    //HospitalInfo
                    service: "Service",
                    department: "Department",
                    reviews: "Reviews",
                    review: "Review",
                    addReviews: "Write your own review",
                    rating: "Rating",
                    sendSth: "Send",

                    //ShoppingCart
                    cart: "Your cart",
                    contents: "Contents of the cart",
                    uah: "UAH",
                    serviceFee: "Service charge",
                    total: "TOTAL",
                    userOrder: "Your order",
                    cancelAct: "Cancel",
                    confirmAct: "Confirm",

                    //Profile
                    verificationEmail: "Verification email is sent",
                    verification: "Verification",
                    error: "An error occurred",
                    verifiedAt: "Verified at",
                    sendVerificationMsg: "To confirm your account and access all the features of the site, you need to confirm your email. We have sent you an email (check your spam folder) If you still do not receive the letter, we will send it again",
                    seeMore: "See more",

                    //Referral page
                    createdRefMsg: "Referral number for client has created. Referral number - ",
                    selectServices: "Select services",
                    referralNum: "Referral code",
                    expdate: "Expiration date",
                    assignedTo: "Assigned to",
                    unverified: "Unverified",

                    operations: "Operations",
                    totalSum: "Total",
                    subtotal: "Subtotal",
                    dateSold: "Sold date",
                    reserveExp: "Reserve expired at",
                    client: "Client name",

                    dateCreated: "Created at",
                    dateConfirmed: "Confirmed at",

                    dateCancel: "Canceled at",
                    reason: "Cancel reason",
                    sendSlots: "Send timeslots to email",
                    cancelOrder: "Cancel order",

                    processTime: "Time for processing:",
                    appointments: "Appointments",

                    dateCreatedStart: "Initial create date",
                    dateCreatedEnd: "End create date",

                    dateConfirmedStart: "Initial confirm date",
                    dateConfirmedEnd: "End confirm date",

                    chReportFilter: "Choose report filter",
                    reportByHospital: "Report by hospital",

                    generate: "Generate",

                    avgServicePerDay: "Average number of services/day",
                    detailedInfo: "Detailed information",
                    
                    download: "Download",
                    patient: "Patient",

                    emptyAppointments: "You don't have appointments",

                    urAppointments: "Your appointments",
                    medAppointment: "Medical Appointment",

                    summary: "Summary",
                    notes: "Notes",
                    recommendations: "Recommendations",

                    completed: "Completed",
                    scheduled: "Scheduled",
                    canceledAppointment: "Canceled",
                    availableSlots: 'Available tickets',
                    emptyAvailableSlots: "No tickets available",
                    date: "Date",

                    numofavailable: "Number of available",
                    medicalHub: "Medical records",
                    medcard: "Med Card",
                    onlySold: "(Only sold orders)",

                    emptyMedcard: "Unfortunately, your medical record has not been created or completed",

                    yourMedCard: "Your Medical Card",
                    gender: "Gender",

                    male: "Male",
                    female: "Female",
                    nonBinary: "Non-binary",
                    date_birthday: "Birthday",

                    blood_type: 'Blood type',
                    emergency_contact_name: "Emergency contact name",
                    emergency_contact_phone: "Emergency contact phone",

                    insurance_details: "Insurance details",
                    chronic_conditions: "Chronic conditions",
                    current_medications: "Current medications",
                    additional_notes: "Additional notes",

                    details: "Details",
                    allergies: "Allergies",
                    fillMedCard: "Fill out a medical card",
                    editMedCard: "Edit a medical card information",
                    isOnline: "Service type",
                    online: "online",
                    offline: "offline",
                    forConsult: "for consultation",

                    addManager: "Add manager",
                    pageNotFound: "Unfortunately, this page does not exist or you do not have permission to view this content.",
                    returnHome: "Return home",
                    doctorAttacher: "Here you can assign a doctor to the service.",
                    emptyDoctors: "There are no doctors available for this service",
                    attach: "Attach",
                    checkSlots: "Check slots",
                    type: "Type",
                },
            },
            uk: {
                translation: {
                    type: "Тип",
                    attach: "Прикріпити",
                    checkSlots: "Перевірити талони",
                    emptyDoctors: "Для відділення цієї послуги немає вільних лікарів",
                    doctorAttacher: "Тут можна прикріпити лікаря до послуги",
                    pageNotFound: "На жаль, такої сторінки не існує або у вас немає дозволу до перегляду цього вмісту.",
                    returnHome: "Повернутись додому",

                    forConsult: "на консультацію",
                    emptyMedcard: "На жаль ваша медична картка не створена або не заповнена",
                    gender: "Стать",
                    online: "онлайн",
                    offline: "у лікарні",

                    isOnline: "Тип послуги",

                    details: "Деталі",
                    allergies: "Алергії",

                    male: "Чоловіча",
                    female: "Жіноча",
                    nonBinary: "Небінарна",
                    blood_type: 'Група крові',

                    date_birthday: "День народження",
                    additional_notes: "Додаткові примітки",

                    fillMedCard: "Заповнити медичну картку",
                    editMedCard: "Змінити інформацію медичної картки",
                    yourMedCard: "Ваша медична картка",
                    current_medications: "Поточні ліки",

                    emergency_contact_name: "Ім'я екстреного контакту",
                    emergency_contact_phone: "Телефон екстреного контакту",

                    insurance_details: "Деталі страхування",
                    chronic_conditions: "Хронічні захворювання",

                    onlySold: "(Тільки оплачені замовлення)",
                    medcard: "Медична карта",
                    medicalHub: "Медичні записи",
                    numofavailable: "К-сть вільних талонів",
                    date: "Дата",
                    processTime: "Час на оформлення:",
                    appointments: "Відвідування",
                    download: "Завантажити",

                    availableSlots: 'Доступні талони',
                    emptyAvailableSlots: "Доступних талонів немає",

                    emptyAppointments: "'У вас немає запланованих зустрічей'",

                    dateCreatedStart: "Початкова дата створення",
                    dateCreatedEnd: "Кінцева дата створення",

                    dateConfirmedStart: "Початкова дата підтвердження",
                    dateConfirmedEnd: "Кінцева дата підтвердження",

                    chReportFilter: "Виберіть фільтр звіту",
                    reportByHospital: "Звіт за лікарнею",

                    generate: "Сформувати",

                    avgServicePerDay: "Середня к-сть послуг/день",

                    urAppointments: "Ваші зустрічі",
                    medAppointment: "Медичний прийом",

                    summary: "Висновок",
                    notes: "Замітки",
                    recommendations: "Рекомендації",

                    completed: "Проведено",
                    scheduled: "Заплановано",
                    canceledAppointment: "Скасовано",

                    login: "Увійти",
                    eng: "English",
                    ua: "Українська",
                    report: "Звіти",
                    patients: "Пацієнти",
                    settings: "Налаштування",
                    orderHistory: "Історія замовлень",
                    hospital: "Лікарня",
                    hospitals: "Лікарні",
                    profile: "Профіль",
                    exit: "Вийти",
                    services: "Послуги",
                    userServices: "Мої послуги",
                    userReferrals: "Мої направлення",
                    home: "Головна",
                    //doctorCard
                    appointment: "Записатися",
                    //Order
                    order: "Замовлення",
                    numofservices: "К-сть послуг",
                    delete: "Видалити",
                    //HospitalPage
                    information: "Основна інформація",
                    detailedInfo: "Детальна інформація",
                    name: "Назва",
                    address: "Адреса",
                    description: "Опис",
                    phone: "Телефон",
                    email: "Пошта",
                    departments: "Відділи",
                    create: "Створити",
                    actions: "Дії",
                    doctors: "Лікарі",
                    importbtn: "Імпортувати",
                    chdep: "Вибрати відділення",
                    search: "Знайти",
                    //doctorInfo
                    firstname: "Ім'я",
                    lastname: "Прізвище",
                    specialization: "Спеціалізація",
                    status: "Статус",
                    addHospital: "Додати лікарню",
                    addManager: "Додати менеджера",
                    alias: "Слаг",

                    addService: "Інтегрувати нову послугу",
                    doctor: "Лікар",
                    chdoc: "Вибрати лікаря",
                    editHosp: "Редагувати лікарню",
                    nameServicePlaceHolder: "Введіть назву послуги",
                    nameOfHospitalPlaceHolder: "Введіть назву лікарні",
                    aliasPlaceholder: "alias (test-hospital)",
                    addressPlaceHolder: "Введіть адресу",
                    save: "Зберегти",
                    editDoc: "Редагувати інформацію лікаря",
                    addDoc: "Додати лікаря",
                    editDep: "Редагувати відділення",
                    addDep: "Додати відділення",
                    addTimeSlot: "Створити талон",
                    selectTimeslot: "Вибрати талон",
                    chStartTime: "Вибрати початковий час",
                    chEndTime: "Вибрати кінцевий час",
                    timeslots: "Талони",
                    emptyTimeslots: "На даний момент талонів немає",
                    cfgTimeSlots: "Налаштувати талони",
                    chdate: "Вибрати час",
                    startTime: "Початковий час",
                    endTime: "Кінцевий час",
                    price: "Ціна",
                    paymentStatus: "Статус оплати",
                    paymentId: "ID Платежу",
                    emptyOrders: "не має оплачених замовлень",
                    addUser: "Зареєструвати користувача",
                    required: "Обов'язкове поле",
                    incorrectFormat: "Некоректний формат",
                    password: "Пароль",
                    msgPassword: "Пароль повинен містити щонайменше 8 символів, 1 літеру, 1 цифру та 1 спеціальний символ",
                    back: "Назад",
                    editUser: "Змінити інформацію про користувача",
                    editRoles: "Змінити ролі користувача",
                    roles: "Ролі користувача",
                    suggestedRoles: "Пропоновані ролі",
                    verifiedStatus: "Верифікований",
                    auth: "Авторизація",
                    registerLink2: "Зареєструватись",
                    register: "Реєстрація",
                    registerLink: "Досі не з нами? Зареєструватися",
                    authLink: "Вже з нами? Авторизуватися",

                    //Canceled order page
                    canceled: "Оплата скасована",
                    msg1: "На жаль, ваш платіж не може бути завершений. Будь ласка, перевірте дані вашої платіжної картки або повторіть спробу пізніше.",
                    msg2: "Якщо проблема не зникне, зверніться до нашої служби підтримки, і ми допоможемо вам вирішити її.",
                    msg3: "Ваше здоров'я важливе для нас, і ми сподіваємося, що ви зможете швидко завершити бронювання.",
                    msg4: "Дякуємо за розуміння. Ми завжди готові вам допомогти!",

                    //Paid Statuses
                    paid: "Оплачене",
                    pending: "В очікуванні оплати",
                    cancel: "Скасоване",

                    reserved: "В резерві",
                    free: "Вільний",
                    sold: "Проданий",

                    //Paid order page
                    successmsg1: "Дякуємо за оплату! Ваше бронювання підтверджено",
                    successmsg2: "Ваша оплата пройшла успішно, і ми раді повідомити вам, що ваучери на обрані послуги були успішно заброньовані. Наші фахівці будуть готові зустрітися з вами в призначений час. Деталі бронювання ви можете переглянути в особистому кабінеті.",
                    intoProfile: "Перейти в кабінет",
                    successmsg3: "Якщо у вас виникли запитання або ви хочете перенести свій візит, будь ласка, зв'яжіться з нашою службою підтримки.",
                    successmsg4: "Дякуємо, що обрали нашу лікарню для свого здоров'я! Ми дбаємо про Ваше здоров'я. Залишайтеся на зв'язку та будьте здорові!",

                    //HospitalInfo
                    service: "Послуга",
                    department: "Відділення",
                    reviews: "Відгуки",
                    patient: "Пацієнт",
                    review: "Відгук",
                    addReviews: "Напишіть власний відгук",
                    rating: "Рейтинг",
                    sendSth: "Надіслати",

                    //ShoppingCart
                    cart: "Ваш кошик",
                    contents: "Вміст кошику",
                    uah: "грн",
                    serviceFee: "Сервісний збір",
                    total: "ВСЬОГО",
                    userOrder: "Ваше замовлення",
                    cancelAct: "Скасувати",
                    confirmAct: "Підтвердити",

                    //Profile
                    verificationEmail: "Відправлено лист з підтвердженням",
                    verification: "Верифікація",
                    unverified: "Не верифікований",
                    error: "Сталася помилка",
                    verifiedAt: "Верифікований",
                    sendVerificationMsg: "Щоб підтвердити свій обліковий запис і отримати доступ до всіх функцій сайту, вам необхідно підтвердити свою електронну пошту. Ми надіслали вам листа (перевірте папку «Спам») Якщо ви все ще не отримали листа, ми надішлемо його ще раз",
                    seeMore: "Переглянути детальніше",

                    //Referral page
                    createdRefMsg: "Створено направлення для клієнта. Номер направлення - ",
                    selectServices: "Виберіть послуги",
                    referralNum: "Направлення",
                    expdate: "Строк придатності",
                    assignedTo: "Призначено",

                    //Operations
                    operations: "Операції",
                    totalSum: "Загальна сума",
                    dateSold: "Дата продажу",
                    dateCreated: "Дата створення",
                    dateConfirmed: "Дата підтвердження",
                    reserveExp: "Закінчення резерву",
                    client: "Ім'я клієнта",
                    subtotal: "Сума послуг",
                    dateCancel: "Дата скасування",
                    reason: "Причина скасування",

                    sendSlots: "Відправити талони на пошту",
                    cancelOrder: "Скасувати замовлення",
                },
            },
        },
        lng: "uk",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;